<template>
  <div class="order-list">
    <!--当前位置-->
    <div class="sub-nav">
      <a><i class="glyphicon glyphicon-barcode"></i>
        订单中心
        <i class="glyphicon glyphicon-chevron-right"></i>
        订单列表</a>
    </div>
    <hr>
    <div class="form-box form-box-5">

      <div class="col-20">
        <label>检票状态</label>
        <el-select v-model="checkStatus" placeholder="请选择">
          <el-option v-for="item in selectOption1" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </div>

      <div class="col-20">
        <label>过期状态</label>
        <el-select v-model="isExpired" placeholder="请选择">
          <el-option v-for="item in selectOption2" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </div>

      <div class="col-20">
        <label>成交时间范围</label>
        <el-date-picker v-model="orderDateRange" type="daterange" align="right" placeholder="选择日期范围"
                        :picker-options="pickerOptions" @change="show">
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
        <el-select v-model="bookerIDType" placeholder="请选择">
          <el-option v-for="item in selectOption" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </div>

      <div class="col-12">
        <el-input v-model="bookerID" placeholder="证件号"></el-input>
      </div>
    </div>

    <div class="search-btn-wrap">
      <el-button type="primary" icon="search" @click="search(searchData)">搜索</el-button>
    </div>

    <div v-loading="loading" class="table-wrap">
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
  import touristDialog from './touristDialog.vue'
  import refundDialog from './refundDialog.vue'
  import {mapActions, mapState} from 'vuex'

  let initStartTime = new Date(moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00')
  let initEndTime = new Date(initStartTime.getTime() + 30 * 24 * 60 * 60 * 1000)
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
        selectOption1: options1,
        selectOption2: options2,
        selectOption: options,
        totalCount: null,
        currentPage: 1,
        pageSize: 10,
        loading: true,
        getData: [],
        pageNum: 0,
        tourist: {}
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
      showTouristDialog (data) {
        this.tourist = data
      },
      show (val) {
        if (val === undefined) {  // date清空后bug fix
          this.orderDateRange = [null, null]
        }
      },
      formateTime (val) {
        return val ? val.getTime() : ''
      }
    },
    components: {
      orderTable,
      touristDialog,
      refundDialog
    }
  }

  let options = [{
    value: 'ID_CARD',
    label: '身份证'
  }, {
    value: 'ERTONG',
    label: '儿童无证件'
  }, {
    value: 'GANGAO',
    label: '港澳通行证'
  }, {
    value: 'HUZHAO',
    label: '护照'
  }, {
    value: 'SHIBING',
    label: '士兵证'
  }, {
    value: 'JUNGUAN',
    label: '军官证'
  }, {
    value: 'HUKOUBO',
    label: '户口薄'
  }, {
    value: 'CHUSHENGZHENGMING',
    label: '出生证明'
  }, {
    value: 'TAIBAO',
    label: '台湾通行证'
  }, {
    value: 'TAIBAOZHENG',
    label: '台胞证'
  }, {
    value: 'OTHER',
    label: '其他'
  }]
  let options1 = [{
    value: 'all',
    label: '全部检票状态'
  }, {
    value: 'checked',
    label: '已检票'
  }, {
    value: 'checking',
    label: '检票中'
  }, {
    value: 'waiting',
    label: '待检票'
  }, {
    value: 'refund',
    label: '已退票'
  }]
  let options2 = [{
    value: 'all',
    label: '已过期及未过期'
  }, {
    value: 'yes',
    label: '已过期'
  }, {
    value: 'no',
    label: '未过期'
  }]
</script>

<style lang="less">
  .order-list {
    .el-select {
      width: 100%;
      .el-input {
        width: 100%;
      }
    }
    .el-date-editor--daterange.el-input {
      width: 100%;
    }
    .search-btn-wrap {
      text-align: right;
      padding-right: 10px;
    }
    .table-wrap {
      padding: 20px 10px 10px;
    }
    .table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }

    .box-inline {
      font-size: 0;
      border-top: 1px solid #eee;
    }

    .box-inline label {
      width: 120px;
      color: #99a9bf;
      font-weight: normal;
    }

    .box-inline .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }

  .form-box {
    padding-bottom: 10px;
  }

  .form-box-5 {
    font-size: 0;
    .col-20 {
      display: inline-block;
      box-sizing: border-box;
      width: 20%;
      font-size: 14px;
      padding: 0 10px;
    }
  }

  .form-box-8 {
    font-size: 0;
    margin: 0 3px 0 10px;
    .col-12 {
      display: inline-block;
      box-sizing: border-box;
      width: 12.5%;
      font-size: 14px;
      margin-left: -1px;
    }
    .col-12:first-child {
      .el-input__inner {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
    }
    .col-12:last-child {
      .el-input__inner {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
    .el-input {
      float: left;
    }
    .el-input__inner {
      border-radius: 0;
      position: relative;
      &:focus {
        z-index: 3;
        top: 0;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
      }
    }
    .el-select .el-input .el-input__icon {
      z-index: 5;
    }

  }
</style>
