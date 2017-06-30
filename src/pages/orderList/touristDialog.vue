<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="游客">
      <div v-show="tourists.length==0" class="text-muted">暂无同游人信息</div>
      <el-form :inline="true" class="box-inline" v-for="(item, index) in tourists" :key="index">
        <h5>游客{{ index + 1 }}</h5>
        <el-form-item label="姓名">
          {{ item.TravellerName }}
        </el-form-item>
        <el-form-item label="手机">
          {{ item.TravellerMobile }}
        </el-form-item>
        <el-form-item label="证件类型">
          {{ item.CardType | cardType }}
        </el-form-item>
        <el-form-item label="证件号">
          {{ item.CardID}}
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {getOrderUserList} from '../../http/api'
  export default {
    data () {
      return {
        tourists: [],
        dialogVisible: false,
        orderId: ''
      }
    },
    created () {
      this.$bus.$on('showTouristDialog', data => {
        this.tourists = []
        this.dialogVisible = true
        this.orderId = data.orderId + ''
        getOrderUserList(this.orderId)
          .then((data) => {
            this.tourists = data.users.lists
          })
          .catch(function (error) {
            console.log(error)
          })
      })
    },
    methods: {}
  }
</script>

<style lang="css" scoped>
  .loading-wrap {
    min-height: 200px;
  }
</style>
