<template>
  <!--弹出-->
  <el-dialog :visible.sync="dialogFormVisible" title="下单">
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <div class="row">
        <div class="col-xs-12">
          <!--价格码，产品名称，可游玩时间，售价-->
          <h3>{{ tInfo.GoodsName }}：{{ tInfo.SalePrice }}元／张</h3>
          <h5>价格码 {{ tInfo.SaleID }} </h5>
        </div>
      </div>
      <hr>
      <el-collapse>
        <el-collapse-item>
          <template slot="title">
            购票须知 &nbsp; <i class="header-icon el-icon-information"></i>
          </template>
          <div>可游玩日期: &nbsp; <b>{{productDetail.visitDateStart | date}}</b> 至 <b>{{productDetail.visitDateEnd | date}}</b></div>
          <div>可销售日期: &nbsp; <b>{{saleDateStart | date}}</b> 至 <b>{{saleDateEnd | date}}</b></div>
          <div>每日售票时间: &nbsp; <b>{{orderTimeStart}}</b> 至 <b>{{orderTimeEnd}}</b>，当日下单截止时间: &nbsp; <b>{{productDetail.validTimeEnd}}</b></div>
          <div>
            <span v-show='productDetail.MinPreOrderDays != 0'>
              购票需提前 <b>{{productDetail.MinPreOrderDays}}</b> 天&emsp;
            </span>
            <span v-show='productDetail.MaxPreOrderDays != 0'>
              最远可订 <b>{{productDetail.MaxPreOrderDays}}</b> 天内的票
            </span>
          </div>
          <div>
            <span v-show='productDetail.MinOrderNumber > 1'>
              最小起订数 <b>{{productDetail.MinOrderNumber}}</b> 张&emsp;
            </span>
            <span v-show='productDetail.MaxOrderNumber != 0'>
              最大限订数 <b>{{productDetail.MaxOrderNumber}}</b> 张
            </span>
          </div>
          <div v-show='phoneDays != 0'>
            每个手机号码 <b>{{phoneDays}}</b> 天内可购买 <b>{{phoneNumber}}</b> 张
          </div>
          <!-- 身份证部分的限购信息 -->
          <div v-show='idDays != 0'>
            每个身份证 <b>{{idDays}}</b> 天内可购买 <b>{{idNumber}}</b> 张
          </div>
          <div v-show='productDetail.SexLimit != -1'>
            预订人性别限定: <b>{{sexLimit}}</b>
          </div>
          <div v-show='!(minAge === 0 && maxAge === "不限")'>
            年龄限定: <b>{{ minAge }}</b> 至 <b>{{ maxAge }}</b> 
          </div>
          <div v-show='realIdDays != 0'>
            每个实名游客 <b>{{realIdDays}}</b> 天内可购买 <b>{{realIdNumber}}</b> 张
          </div>
          <div v-show='productDetail.RealSexLimit != -1'>
            实名游客性别限定: <b>{{realSexLimit}}</b>
          </div>
          <div v-show='!(realMinAge === 0 && realMaxAge === "不限")'>
            实名游客年龄限定: <b>{{ realMinAge }}</b> 至 <b>{{ realMaxAge }}</b> 
          </div>
        </el-collapse-item>    
      </el-collapse>
      <hr>
      <el-form-item label="游玩日期">
        <el-date-picker v-model="form.date" type="date" placeholder="选择日期"
                        :picker-options="form.pickerOptions" :clearable="false"></el-date-picker>
      </el-form-item>

      <el-form-item label="购票数量">
        <el-input-number v-model="form.ticketCount" @change="handleChange" :min="minOrder" :max="maxOrder"></el-input-number>
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

            <el-form-item :label="'同游人'+(index + 1)+'手机号'" :key="index" :prop="'travelerList.'+index+'.mobile'"
                          :rules="rules2.mobile">
              <el-input v-model="item.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>

            <el-form-item :label="'同游人'+(index + 1)+'证件号'" :key="index" :prop="'travelerList.'+index+'.idNum'"
                          :rules="rules2.idType">
              <el-input placeholder="请输入证件号" v-model="item.idNum">
                <el-select v-model="item.idType" placeholder="请选择" slot="prepend" @change="selectChange2(index)">
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
      <p v-show="outOfTime"><i class="header-icon el-icon-information"></i> 不在售票时间</p>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button :disabled="disabled || outOfTime" @click.stop.prevent="submitForm('form')" type="primary">下单</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import moment from 'moment'
  import {placeOrder, getProductDetail} from '../../http/api'
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

      var validateMobile2 = (rule, value, callback) => {
        if (value === '') {
          callback()
        }
        if (!(/^1[34578]\d{9}$/.test(value))) {
          callback(new Error('请输入正确的手机号码!'))
        } else {
          callback()
        }
      }
      var validateId2 = (rule, value, callback) => {
        let sels = rule.field.split('.')
        let sel = sels[1]  // 获取当前索引
        if (value === '') {
          callback()
        }
        if (this.form.travelerList[sel].idType === 'ID_CARD') {
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
        productDetail: {},
        minOrder: 1,
        maxOrder: Infinity,
        orderTimeStart: '',
        orderTimeEnd: '',
        phoneDays: 0,
        phoneNumber: 0,
        idDays: 0,
        idNumber: 0,
        realIdDays: 0,
        realIdNumber: 0,
        minAge: 0,
        maxAge: 0,
        realMinAge: 0,
        realMaxAge: 0,
        dialogFormVisible: false,
        disabled: false,
        form: {
          date: new Date(),
          ticketCount: '1',
          contactsIdNum: '',
          contactsName: '',
          contactsMobile: '',
          travelerList: [],
          contactsIdType: 'ID_CARD',
          selectOption: options,
          pickerOptions: {
            disabledDate: (time) => {
              let d = new Date().getDate()
              let min = this.productDetail.MinPreOrderDays
              let max = this.productDetail.MaxPreOrderDays
              let s = new Date(this.productDetail.visitDateStart)
              let e = new Date(this.productDetail.visitDateEnd)
              if (time.getTime() < s.getTime()) {
                return true
              } else if (time.getTime() > e.getTime()) {
                return true
              } else if (time.getTime() < new Date().setDate(d + min - 1)) {
                return true
              } else if (max !== 0 && time.getTime() > new Date().setDate(d + max - 1)) {
                return true
              }
              // return time.getTime() < Date.now() - 8.64e7
            }
          }
        },
        rules: {
          contactsName: [
            {required: true, message: '请输入姓名', trigger: 'blur,change'}
          ],
          contactsMobile: [
            {required: true, message: '请输入手机', trigger: 'blur,change'},
            {validator: validateMobile, trigger: 'blur,change'}
          ],
          contactsIdNum: [
            {required: true, message: '请输入证件号', trigger: 'blur,change'},
            {validator: validateId, trigger: 'blur,change'}
          ]
        },
        rules2: {
          idType: {validator: validateId2, trigger: 'blur,change'},
          mobile: {validator: validateMobile2, trigger: 'blur,change'}
        }
      }
    },
    computed: {
      // IDRequired () {
      //   if (this.productDetail.IDCardNeeded === 1) {
      //     return true
      //   } else {
      //     return false
      //   }
      // },
      outOfTime () {
        let d = new Date()
        let time = moment(d).format('HH:mm')
        if (time < this.orderTimeStart || time > this.orderTimeEnd || d.getTime() < this.saleDateStart || d.getTime() > this.saleDateEnd) {
          return true
        }
      },
      saleDateStart () {
        return new Date(Number(this.productDetail.saleDateStart))
      },
      saleDateEnd () {
        return new Date(Number(this.productDetail.saleDateEnd))
      },
      sexLimit () {
        if (this.productDetail.SexLimit === 1) {
          return '男士'
        } else if (this.productDetail.SexLimit === 0) {
          return '女士'
        }
      },
      realSexLimit () {
        if (this.productDetail.RealSexLimit === 1) {
          return '男士'
        } else if (this.productDetail.RealSexLimit === 0) {
          return '女士'
        }
      },
      placeData () {
        return {
          SaleID: this.tInfo.SaleID,
          VisitTime: moment(this.form.date).format('YYYYMMDD') + '000000',
          TicketCount: this.form.ticketCount + '',
          contacts: {
            idNum: this.form.contactsIdNum,
            idType: this.form.contactsIdType,
            mobile: this.form.contactsMobile,
            name: this.form.contactsName
          },
          TravelerList: this.form.travelerList
        }
      }
    },
    methods: {
      init () {
        this.dialogFormVisible = true
        this.form.contactsIdType = 'ID_CARD'
        this.form.contactsIdNum = ''
        this.form.contactsName = ''
        this.form.contactsMobile = ''
        this.form.travelerList = []
        this.$nextTick(() => {
          this.$refs.form.resetFields('contactsIdNum')
          getProductDetail(this.tInfo.SaleID).then((data) => {
            this.productDetail = data.sale
            // 初始化数据
            this.orderTimeStart = this.productDetail.OrderTimeLimit.StartTime
            this.orderTimeEnd = this.productDetail.OrderTimeLimit.EndTime
            this.phoneDays = this.productDetail.PerPhoneLimit.Days
            this.phoneNumber = this.productDetail.PerPhoneLimit.Number
            this.idDays = this.productDetail.PerIDLimit.Days
            this.idNumber = this.productDetail.PerIDLimit.Number
            this.realIdDays = this.productDetail.RealPerIDLimit.Days
            this.realIdNumber = this.productDetail.RealPerIDLimit.Number
            this.minAge = this.productDetail.AgeLimit.min
            this.maxAge = this.productDetail.AgeLimit.max === 0 ? '不限' : this.productDetail.AgeLimit.max
            this.realMinAge = this.productDetail.RealAgeLimit.min
            this.realMaxAge = this.productDetail.RealAgeLimit.max === 0 ? '不限' : this.productDetail.RealAgeLimit.max
            this.minOrder = this.productDetail.MinOrderNumber === 0 ? 1 : this.productDetail.MinOrderNumber
            this.maxOrder = this.productDetail.MaxOrderNumber === 0 ? Infinity : this.productDetail.MaxOrderNumber
            this.form.ticketCount = this.minOrder
            this.form.date = Math.max(new Date(this.productDetail.visitDateStart).getTime(), new Date().setDate(new Date().getDate() + this.productDetail.MinPreOrderDays))
            this.handleChange(this.form.ticketCount)
          })
        })
      },
      filterTourist () {
        this.form.travelerList = this.form.travelerList.filter((item) => {
          let flag = false
          for (let key in item) {
            if (key !== 'idType') {
              if (item.hasOwnProperty(key)) {
                if (item[key]) flag = true
              }
            }
          }
          return flag
        })
      },
      handleChange (val) {
        console.log(this.form.date)
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
      selectChange2 (index) {
        this.$refs.form.validateField('travelerList.' + index + '.idNum')
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.disabled = true
            this.filterTourist()
            placeOrder(this.placeData)
              .then(() => {
                this.disabled = false
                this.getAccount().then(() => {
                  this.$message({
                    showClose: true,
                    message: '下单成功！',
                    type: 'success'
                  })
                  this.dialogFormVisible = false
                })
              })
              .catch((error) => {
                console.log(error)
                this.disabled = false
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
