<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="退票">
      <h3>可退票数：{{waitingCheck}}</h3>
      <el-form>
        <el-form-item label="退票数量">
          <el-input-number v-model="cancelCount" :min="1" :max="waitingCheck"></el-input-number>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" :disabled="refunding" @click="refund">退票</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {cancelOrder} from '../../http/api'
  export default {
    data () {
      return {
        waitingCheck: 0,
        dialogVisible: false,
        orderId: 0,
        cancelCount: 1,
        refunding: false
      }
    },
    created () {
      this.$bus.$on('showRefundDialog', data => {
        this.waitingCheck = data.checkStatus === 'refund' ? 0 : data.totalTickets - data.checkedTickets
        this.orderId = data.orderId
        this.init()
      })
    },
    methods: {
      init () {
        this.dialogVisible = true
        this.cancelCount = 1
      },
      refund () {
        this.$confirm('确定退票吗?').then(() => {
          this.refunding = true
          let params = {
            orderId: this.orderId - 0,
            cancelSerial: new Date().getTime() + '' + Math.floor(Math.random(100) * 100),
            cancelCount: this.cancelCount
          }
          cancelOrder(params)
            .then((data) => {
              if (data.rescode === 200) {
                this.$message({
                  type: 'success',
                  message: '退票成功!'
                })
                this.dialogVisible = false
                this.$bus.$emit('refund')
              }
              this.refunding = false
            })
            .catch((error) => {
              console.log(error)
              this.refunding = false
            })
        }).catch(() => {
        })
      }
    }
  }
</script>

<style lang="css" scoped>
  h3 {
    margin-bottom: 20px;
  }
</style>
