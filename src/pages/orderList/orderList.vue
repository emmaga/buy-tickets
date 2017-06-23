<template>
  <div class="order-list">
    <div class="form-box form-box-5">
      <div class="col-20">
        <label>检票状态</label>
        <select v-model="searchData.checkStatus" class="form-control">
          <option value="all">全部检票状态</option>
          <option value="checked">已检票</option>
          <option value="checking">检票中</option>
          <option value="waiting">待检票</option>
          <option value="refund">已退票</option>
        </select>
      </div>

      <div class="col-20">
        <label>过期状态</label>
        <select v-model="searchData.isExpired" class="form-control">
          <option value="all">已过期及未过期</option>
          <option value="yes">已过期</option>
          <option value="no">未过期</option>
        </select>
      </div>

      <div class="col-20">
        <label>成交时间范围</label>
        <el-date-picker v-model="orderDateRange" type="daterange" align="right" placeholder="选择日期范围"
                        :picker-options="pickerOptions" @change="changeOrderDate">
        </el-date-picker>
      </div>

      <div class="col-20">
        <label>游玩时间范围</label>
        <el-date-picker v-model="visitDateRange" type="daterange" align="right" placeholder="选择日期范围"
                        :picker-options="pickerOptions" @change="changeVisitDate">
        </el-date-picker>
      </div>

      <div class="col-20">
        <label>检票时间范围</label>
        <el-date-picker v-model="checkDateRange" type="daterange" align="right" placeholder="选择日期范围"
                        :picker-options="pickerOptions" @change="changeCheckDate">
        </el-date-picker>
      </div>

    </div>

    <div class="form-box form-box-8">

      <div class="col-12">
        <el-input v-model="searchData.bookPerson" placeholder="预订人姓名"></el-input>
      </div>

      <div class="col-12">
        <el-input v-model="searchData.bookMobile" placeholder="预订人手机号"></el-input>
      </div>

      <div class="col-12">
        <el-input v-model="searchData.orderTicketCode" placeholder="辅助码"></el-input>
      </div>

      <div class="col-12">
        <el-input v-model="searchData.parterOrderId" placeholder="分销商订单号"></el-input>
      </div>

      <div class="col-12">
        <el-input v-model="searchData.orderId" placeholder="景区订单号"></el-input>
      </div>

      <div class="col-12">
        <el-input v-model="searchData.goodsName" placeholder="商品名"></el-input>
      </div>

      <div class="col-12">
        <select class="flex-item form-control" v-model="searchData.bookerIDType">
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
        <el-input v-model="searchData.bookerID" placeholder="证件号"></el-input>
      </div>
    </div>

    <div class="search-btn-wrap">
      <el-button type="primary" icon="search" @click="formSearch" :loading="searching">搜索</el-button>
    </div>

    <div v-loading="loading" class="table-wrap" ref="searchTable">
      <div class="inner">
        <orderTable :tableData="searchResult.lists"></orderTable>
      </div>
    </div>

    <div class="u-page">
      <el-pagination layout="total, prev, pager, next" :pageSize="searchData.pageSize" :total="searchResult.totalCount"
                     @current-change="handleCurrentChange" :current-page="searchData.currentPage">
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

  let initStartTime = new Date(moment(new Date()).format('YYYY-MM-DD')).getTime()
  let initEndTime = initStartTime + 30 * 24 * 60 * 60 * 1000
  export default {
    data () {
      return {
        searchData: {
          pageSize: 10,
          currentPage: 1,
          checkStatus: 'all',
          isExpired: 'all',
          orderCreateDateStart: initStartTime,
          orderCreateDateEnd: initEndTime,
          visitDateStart: '',
          visitDateEnd: '',
          checkDateStart: '',
          checkDateEnd: '',
          bookMobile: '',
          bookPerson: '',
          orderTicketCode: '',
          parterOrderId: '',
          orderId: '',
          goodsName: '',
          bookerIDType: 'ID_CARD',
          bookerID: ''
        },
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
        loading: true,
        searching: false
      }
    },
    computed: {
      ...mapState(['searchResult'])
    },
    created () {
      this.search(this.searchData).then(() => {
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
        this.searchData.currentPage = val
        this.loading = true
        this.search(this.searchData).then(() => {
          this.loading = false
        })
      },
      formSearch () {
        this.searchData.currentPage = 1
        this.searching = true
        this.search(this.searchData).then(() => {
          this.searching = false
          let ele = this.$refs.searchTable
          this.$scrollTo(ele)
        })
      },
      changeOrderDate (val) {
        if (val === undefined) {  // date清空后bug fix
          this.orderDateRange = [null, null]
        }
        this.searchData.orderCreateDateStart = this.formateTime(this.orderDateRange[0])
        this.searchData.orderCreateDateEnd = this.formateTime(this.orderDateRange[1])
      },
      changeVisitDate (val) {
        if (val === undefined) {  // date清空后bug fix
          this.visitDateRange = [null, null]
        }
        this.searchData.visitDateStart = this.formateTime(this.visitDateRange[0])
        this.searchData.visitDateEnd = this.formateTime(this.visitDateRange[1])
      },
      changeCheckDate (val) {
        if (val === undefined) {  // date清空后bug fix
          this.checkDateRange = [null, null]
        }
        this.searchData.checkDateStart = this.formateTime(this.checkDateRange[0])
        this.searchData.checkDateEnd = this.formateTime(this.checkDateRange[1])
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
