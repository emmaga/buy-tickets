<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="修改密码" size="tiny">
      <el-form :model="passwordForm" :rules="rules" ref="passwordForm" label-width="95px" label-position="left">
        <el-form-item label="原始密码" prop="oldPassword">
          <el-input type="password" v-model="passwordForm.oldPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input type="password" v-model="passwordForm.confirmPassword" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('passwordForm')">重置</el-button>
        <el-button @click="submitForm('passwordForm')" :disabled="changing" type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {resetOTAUserPassword} from '../../http/api'
  import md5 from 'js-md5'
  export default {
    data () {
      let validatePass = (rule, value, callback) => {
        if (this.passwordForm.newPassword !== '') {
          this.$refs.passwordForm.validateField('confirmPassword')
        }
        callback()
      }
      let validatePass2 = (rule, value, callback) => {
        if (value !== this.passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        dialogVisible: false,
        changing: false,
        passwordForm: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        rules: {
          oldPassword: [
            {required: true, message: '请输入原密码', trigger: 'blur,change'}
          ],
          newPassword: [
            {required: true, message: '请输入新密码', trigger: 'blur,change'},
            {validator: validatePass, trigger: 'blur,change'}
          ],
          confirmPassword: [
            {required: true, message: '请输入确认新原密码', trigger: 'blur,change'},
            {validator: validatePass2, trigger: 'blur,change'}
          ]
        }
      }
    },
    created () {
      this.$bus.$on('showPasswordDialog', () => {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.resetForm('passwordForm')
        })
      })
    },
    computed: {
      passwordData: function () {
        return {
          oldPassword: md5(this.passwordForm.oldPassword),
          confirmPassword: md5(this.passwordForm.confirmPassword),
          newPassword: md5(this.passwordForm.newPassword)
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.changing = true
            resetOTAUserPassword(this.passwordData).then(data => {
              if (data.rescode === 200) {
                this.$message({
                  type: 'success',
                  message: '密码修改成功!'
                })
                this.dialogVisible = false
              }
              this.changing = false
            }).catch((error) => {
              console.log(error)
              this.changing = false
            })
          } else {
            console.log('error submit!!')
            this.changing = false
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang="less" scoped>
  .btn-wrap {
    text-align: right;
  }

  .dialog-footer {
    button {
      margin-left: 10px;
    }
  }
</style>
