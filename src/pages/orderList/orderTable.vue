<template>
  <el-table :data="tableData" style="width: 100%" stripe>
    <el-table-column type="expand">
      <template scope="props">
        <el-form label-position="left" inline class="table-expand">
          <el-form-item label="票名">
            <span>{{ props.row.goodsName }}</span>
          </el-form-item>
          <el-form-item label="单价">
            <span>{{ props.row.price }}</span>
          </el-form-item>
          <el-form-item label="已检">
            <span>{{ props.row.checkedTickets}}</span>
          </el-form-item>
          <el-form-item label="已退">
            <span>{{ props.row.returnedTickets}}</span>
          </el-form-item>
          <el-form-item label="过期">
            <span>{{ props.row.isExpired | isExpired }}</span>
          </el-form-item>
          <el-form-item label="下单时间">
            <span>{{ props.row.orderCreateTime | dateTime}}</span>
          </el-form-item>
          <el-form-item label="游玩开始日期">
            <span>{{ props.row.visitDateStart | dateTime}}</span>
          </el-form-item>
          <el-form-item label="游玩结束日期">
            <span>{{ props.row.visitDateEnd | dateTime}}</span>
          </el-form-item>
          <el-form-item label="分销商订单号">
            <span>{{ props.row.parterOrderId }}</span>
          </el-form-item>
          <el-form-item label="分销商">
            <span>{{ props.row.partnerName }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>

    <el-table-column prop="orderId" label="订单号"></el-table-column>

    <el-table-column prop="userOrderId" label="用户订单号" width="120"></el-table-column>

    <el-table-column prop="bookPerson" label="预订人"></el-table-column>

    <el-table-column prop="bookMobile" label="手机号" width="130"></el-table-column>

    <el-table-column label="证件类型" width="120">
      <template scope="scope">
        {{ scope.row.bookerIDType | cardType }}
      </template>
    </el-table-column>

    <el-table-column label="预订人证件号" width="180">
      <template scope="scope">
        {{ scope.row.bookerID }}
      </template>
    </el-table-column>

    <el-table-column prop="totalTickets" label="数量"></el-table-column>

    <el-table-column label="状态">
      <template scope="scope">
        {{ scope.row.checkStatus | checkStatus }}
      </template>
    </el-table-column>

    <el-table-column label="游客">
      <template scope="scope">
        <el-button @click="showTourist(scope.row)" type="primary" size="small">游客</el-button>
      </template>
    </el-table-column>

    <el-table-column label="退票">
      <template scope="scope">
        <el-button @click="showRefund(scope.row)" type="danger" size="small"
                   :disabled="(scope.row.totalTickets - scope.row.checkedTickets) === 0 || scope.row.checkStatus === 'refund'">
          退票
        </el-button>
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
  export default {
    props: ['tableData'],
    data () {
      return {}
    },
    computed: {},
    methods: {
      showTourist (data) {
        this.$bus.$emit('showTouristDialog', data)
      },
      showRefund (data) {
        this.$bus.$emit('showRefundDialog', data)
      }
    }
  }
</script>

<style lang="css" scoped>
  .table-expand {
    font-size: 0;
  }

  .table-expand label {
    width: 120px;
    color: #99a9bf;
    font-weight: normal;
  }
</style>
