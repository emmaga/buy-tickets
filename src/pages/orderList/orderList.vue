<template>
  <div class="order-list">

    <div class="form-box form-box-5">

      <div class="col-20">
        <label>检票状态</label>
        <select v-model="checkStatus" class="form-control">
          <option value="all">全部检票状态</option>
          <option value="checked">已检票</option>
          <option value="checking">检票中</option>
          <option value="waiting">待检票</option>
          <option value="refund">已退票</option>
        </select>
      </div>

      <div class="col-20">
        <label>过期状态</label>
        <select v-model="isExpired" class="form-control">
          <option value="all">已过期及未过期</option>
          <option value="yes">已过期</option>
          <option value="no">未过期</option>
        </select>
      </div>

      <div class="col-20">
        <label>成交时间范围</label>
        <el-date-picker v-model="orderDateRange" type="daterange" align="right" placeholder="选择日期范围"
                        :picker-options="pickerOptions" @change="clearDate">
        </el-date-picker>
      </div>

      <div class="col-20">
        <label>游玩时间范围</label>
        <el-date-picker v-model="visitDateRange" type="daterange" align="right" placeholder="选择日期范围"
                        :picker-options="pickerOptions">
        </el-date-picker>
      </div>

      <div class="col-20">
        <label>检票时间范围</label>
        <el-date-picker v-model="checkDateRange" type="daterange" align="right" placeholder="选择日期范围"
                        :picker-options="pickerOptions">
        </el-date-picker>
      </div>

    </div>

    <div class="form-box form-box-8">

      <div class="col-12">
        <el-input v-model="bookPerson" placeholder="预订人姓名"></el-input>
      </div>

      <div class="col-12">
        <el-input v-model="bookMobile" placeholder="预订人手机号"></el-input>
      </div>

      <div class="col-12">
        <el-input v-model="orderTicketCode" placeholder="辅助码"></el-input>
      </div>

      <div class="col-12">
        <el-input v-model="parterOrderId" placeholder="分销商订单号"></el-input>
      </div>

      <div class="col-12">
        <el-input v-model="orderId" placeholder="景区订单号"></el-input>
      </div>

      <div class="col-12">
        <el-input v-model="goodsName" placeholder="商品名"></el-input>
      </div>

      <div class="col-12">
        <select class="flex-item form-control" v-model="bookerIDType">
          <option value="ID_CARD">身份证</option>
          <option value="ERTONG">儿童无证件</option>
          <option value="GANGAO">港澳通行证</option>
          <option value="HUZHAO">护照</option>
          <option value="SHIBING">士兵证</option>
          <option value="JUNGUAN">军官证</option>
          <option value="HUKOUBO">户口薄</option>
          <option value="CHUSHENGZHENGMING">出生证明</option>
          <option value="TAIBAO">台湾通行证</option>
          <option value="TAIBAOZHENG">台胞证</option>
          <option value="OTHER">其他</option>
        </select>
      </div>

      <div class="col-12">
        <el-input v-model="bookerID" placeholder="证件号"></el-input>
      </div>
    </div>

    <div class="search-btn-wrap">
      <el-button type="primary" icon="search" @click="formSearch" :loading="searching">搜索</el-button>
    </div>

    <div v-loading="loading" class="table-wrap" ref="ttt">
      <div class="inner">
        <orderTable :tableData="searchResult.lists"></orderTable>
      </div>
    </div>

    <div class="u-page">
      <el-pagination layout="total, prev, pager, next" :pageSize="pageSize" :total="searchResult.totalCount"
                     @current-change="handleCurrentChange" :current-page="currentPage">
      </el-pagination>
    </div>

    <!--游客弹出-->
    <tourist-dialog></tourist-dialog>

    <!--退票弹出-->
    <refund-dialog></refund-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  import orderTable from './orderTable.vue'
  import touristDialog from '../../components/dialog/touristDialog.vue'
  import refundDialog from '../../components/dialog/refundDialog.vue'
  import {mapActions, mapState} from 'vuex'

  let initStartTime = moment(new Date()).format('YYYY-MM-DD')
  let initEndTime = moment(new Date()).add(30, 'days').format('YYYY-MM-DD')
  export default {
    data () {
      return {
        checkStatus: 'all',
        isExpired: 'all',
        bookMobile: '',
        bookPerson: '',
        orderTicketCode: '',
        parterOrderId: '',
        orderId: '',
        goodsName: '',
        bookerIDType: 'ID_CARD',
        bookerID: '',
        orderDateRange: [initStartTime, initEndTime],
        visitDateRange: [null, null],
        checkDateRange: [null, null],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        totalCount: null,
        currentPage: 1,
        pageSize: 10,
        loading: true,
        getData: [],
        pageNum: 0,
        searching: false
      }
    },
    computed: {
      ...mapState(['searchResult']),
      searchData: function () {
        return {
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          checkStatus: this.checkStatus,
          isExpired: this.isExpired,
          orderCreateDateStart: this.formateTime(this.orderDateRange[0]),
          orderCreateDateEnd: this.formateTime(this.orderDateRange[1]),
          visitDateStart: this.formateTime(this.visitDateRange[0]),
          visitDateEnd: this.formateTime(this.visitDateRange[1]),
          checkDateStart: this.formateTime(this.checkDateRange[0]),
          checkDateEnd: this.formateTime(this.checkDateRange[1]),
          bookMobile: this.bookMobile,
          bookPerson: this.bookPerson,
          orderTicketCode: this.orderTicketCode,
          parterOrderId: this.parterOrderId,
          orderId: this.orderId,
          goodsName: this.goodsName,
          bookerIDType: this.bookerIDType,
          bookerID: this.bookerID
        }
      }
    },
    created () {
      this.search(this.searchData).then(() => {
        this.pageNum = Math.ceil(this.searchResult.totalCount / this.pageSize)
        this.loading = false
      })
      this.$bus.$off('refund')
    },
    mounted () {
      this.$bus.$on('refund', () => {
        this.handleCurrentChange(this.currentPage)
      })
    },
    methods: {
      ...mapActions(['search']),
      handleCurrentChange (val) {
        this.currentPage = val
        this.loading = true
        this.search(this.searchData).then(() => {
          this.loading = false
        })
      },
      formSearch () {
        this.currentPage = 1
        this.searching = true
        this.search(this.searchData).then(() => {
          this.searching = false
          let ele = this.$refs.ttt
          this.$scrollTo(ele)
        })
      },
      clearDate (val) {
        if (val === undefined) {  // date清空后bug fix
          this.orderDateRange = [null, null]
        }
      },
      formateTime (val) {
        return val ? new Date(val).getTime() : ''
      }
    },
    components: {
      orderTable,
      touristDialog,
      refundDialog
    }
  }
</script>

<style lang="less">

</style>
