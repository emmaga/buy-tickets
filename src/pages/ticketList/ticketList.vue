<template>
  <div>
    <!--账户余额-->
    <div class="row">
      <div class="col-xs-4">
        <div class="panel panel-warning scoreboard">
          <div class="panel-heading">当前账户余额</div>
          <div class="panel-body">¥ {{ paymentAmount | money }}</div>
        </div>
      </div>
    </div>

    <!--商品列表-->
    <el-table :data="productList" style="width: 100%" stripe>
      <el-table-column prop="GoodsName" label="商品名"></el-table-column>
      <el-table-column prop="SalePrice" label="单价"></el-table-column>
      <el-table-column prop="VisitDateStart" label="游玩开始时间" width="180"></el-table-column>
      <el-table-column prop="VisitDateEnd" label="游玩结束时间" width="180"></el-table-column>
      <el-table-column prop="OTACode" label="分销商码"></el-table-column>
      <el-table-column prop="GoodsID" label="商品码"></el-table-column>
      <el-table-column prop="SaleID" label="销售码"></el-table-column>
      <el-table-column label="启用二维码" width="120">
        <template scope="scope">
          {{scope.row.TwoDBarCodeOn | isNot}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <button @click="initOrder(scope.row)" class="btn btn-sm btn-primary">下单</button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="u-page" v-if="pageNum>1">
      <el-pagination layout="total, prev, pager, next" :pageSize="pageSize" :total="otaList.length"
                     @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <order-dialog ref="dialog" :tInfo="tInfo"></order-dialog>
  </div>
</template>

<script>
  import orderDialog from './orderDialog.vue'
  import {mapState, mapActions} from 'vuex'

  export default {
    data () {
      return {
        loading: true,
        otaList: [],
        pageSize: 15, // 每页显示条目数
        newData: [],
        pageNum: 0,
        tInfo: {},
        ajaxNum: 0
      }
    },
    computed: {
      ...mapState(['prePayment', 'paymentAmount', 'productList'])
    },
    created () {
      this.getAccount()
      this.getProduct()
//      分页处理
//      .then(() => {
//        this.handleCurrentChange(1)
//        this.pageNum = Math.ceil(this.otaList.length / this.pageSize)
//      })
    },
    methods: {
      initOrder (obj) {
        this.tInfo = obj
        this.$refs.dialog.init()
      },
      ...mapActions(['getAccount', 'getProduct'])
//      分页处理
//      handleCurrentChange (val) {
//        this.newData = []
//        let len = this.pageSize
//        let pageNum = val - 1
//        for (let i = pageNum * len; i < (pageNum * len + len); i++) {
//          this.productList[i] !== undefined ? this.newData.push(this.productList[i]) : ''
//        }
//      }
    },
    components: {
      orderDialog
    }
  }
</script>

<style lang="css">

</style>
