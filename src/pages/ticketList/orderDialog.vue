<template>
  <!--弹出-->
  <el-dialog :visible.sync="dialogFormVisible">
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <div class="row">
        <div class="col-xs-12">
          <!--价格码，产品名称，可游玩时间，售价-->
          <h3>{{ tInfo.GoodsName }}：{{ tInfo.SalePrice }}元／张</h3>
          <h5>可游玩日期 {{ tInfo.VisitDateStart | date }} - {{ tInfo.VisitDateEnd | date }}</h5>
          <h5>价格码 {{ tInfo.SaleID }} </h5>
        </div>
      </div>
      <hr>
      <el-form-item label="游玩日期">
        <el-date-picker v-model="form.date" type="date" placeholder="选择日期"
                        :picker-options="form.pickerOptions0" :clearable="false"></el-date-picker>
      </el-form-item>

      <el-form-item label="购票数量">
        <el-input-number v-model="form.ticketCount" @change="handleChange" :min="1" :max="50"></el-input-number>
      </el-form-item>

      <el-form-item label="预订人姓名" prop="contactsName">
        <el-input v-model="form.contactsName" placeholder="请输入姓名"></el-input>
      </el-form-item>

      <el-form-item label="预订人手机" prop="contactsMobile">
        <el-input v-model="form.contactsMobile" placeholder="请输入手机"></el-input>
      </el-form-item>

      <el-form-item label="预订人证件号" prop="contactsIdNum">
        <el-input placeholder="请输入证件号" v-model="form.contactsIdNum">
          <el-select v-model="form.contactsIdType" placeholder="请选择" slot="prepend" @change="selectChange">
            <el-option v-for="item in form.selectOption" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            填写同游人信息
          </template>
          <div v-for="(item, index) in form.travelerList" :key="index">
            <hr>
            <el-form-item :label="'同游人'+(index + 1)+'姓名'">
              <el-input v-model="item.name" placeholder="请输入姓名"></el-input>
            </el-form-item>

            <el-form-item :label="'同游人'+(index + 1)+'手机号'">
              <el-input v-model="item.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>

            <el-form-item :label="'同游人'+(index + 1)+'证件号'">
              <el-input placeholder="请输入证件号" v-model="item.idNum">
                <el-select v-model="item.idType" placeholder="请选择" slot="prepend">
                  <el-option v-for="item in form.selectOption" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-input>
            </el-form-item>

          </div>
        </el-collapse-item>
      </el-collapse>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <button @click="dialogFormVisible = false" class="btn btn-default btn-sm">取 消</button>
      <button :disabled="saving" @click.stop.prevent="submitForm('form')" class="btn btn-primary btn-sm">下单</button>
    </div>

  </el-dialog>
</template>

<script>
  import moment from 'moment'
  import {mapActions} from 'vuex'

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

  export default {
    props: ['tInfo'],
    data () {
      var validateMobile = (rule, value, callback) => {
        if (!(/^1[34578]\d{9}$/.test(value))) {
          callback(new Error('请输入正确的手机号码!'))
        } else {
          callback()
        }
      }

      var validateId = (rule, value, callback) => {
        if (this.form.contactsIdType === 'ID_CARD') {
          if (!(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(value))) {
            callback(new Error('请输入正确的身份证号!'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        dialogFormVisible: false,
        saving: false,
        form: {
          date: new Date(),
          ticketCount: '1',
          contactsIdNum: '',
          contactsName: '',
          contactsMobile: '',
          travelerList: [],
          contactsIdType: 'ID_CARD',
          selectOption: options,
          pickerOptions0: {
            disabledDate (time) {
              return time.getTime() < Date.now() - 8.64e7
            }
          }
        },
        rules: {
          contactsName: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          contactsMobile: [
            {required: true, message: '请输入手机', trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'}
          ],
          contactsIdNum: [
            {required: true, message: '请输入证件号', trigger: 'blur'},
            {validator: validateId, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      visitTime: function () {
        return moment(this.form.date).format('YYYYMMDD') + '000000'
      }
    },
    methods: {
      init () {
        this.dialogFormVisible = true
        this.form.date = new Date()
        this.form.ticketCount = '1'
        this.form.contactsIdType = 'ID_CARD'
        this.form.contactsIdNum = ''
        this.form.contactsName = ''
        this.form.contactsMobile = ''
        this.form.travelerList = []
        this.handleChange(1)
        this.$nextTick(() => {
          this.$refs.form.resetFields('contactsIdNum')
        })
      },
      handleChange (val) {
        let addNum
        if (val > this.form.travelerList.length) {
          addNum = val - this.form.travelerList.length
          for (let i = 0; i < addNum; i++) {
            this.form.travelerList.push({
              name: '',
              mobile: '',
              idType: 'ID_CARD',
              idNum: ''
            })
          }
        } else {
          addNum = this.form.travelerList.length - val
          for (let i = 0; i < addNum; i++) {
            this.form.travelerList.pop()
          }
        }
      },
      selectChange () {
        this.$refs.form.validateField('contactsIdNum')
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saving = true
            this.axios.post('/otauser', {
              action: 'OTANewOrder',
              data: {
                SaleID: this.tInfo.SaleID,
                VisitTime: this.visitTime,
                TicketCount: this.form.ticketCount + '',
                contacts: {
                  idNum: this.form.contactsIdNum,
                  idType: this.form.contactsIdType,
                  mobile: this.form.contactsMobile,
                  name: this.form.contactsName
                },
                TravelerList: this.form.travelerList
              }
            })
              .then((response) => {
                let data = response.data
                this.saving = false
                if (data.rescode === 200) {
                  this.getAccount().then(() => {
                    this.$message({
                      showClose: true,
                      message: '下单成功！',
                      type: 'success'
                    })
                    this.dialogFormVisible = false
                  })
                }
              })
              .catch((error) => {
                console.log(error)
                this.saving = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      ...mapActions(['getAccount'])
    }
  }
</script>
<style lang="css">

</style>
