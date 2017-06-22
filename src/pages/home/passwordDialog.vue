<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="修改密码">
      <el-form :model="passwordForm" :rules="rules" ref="passwordForm" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
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
        <el-button type="primary" @click="submitForm('passwordForm')" :disabled="changing">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
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
            {required: true, message: '请输入原密码', trigger: 'blur'}
          ],
          newPassword: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          confirmPassword: [
            {required: true, message: '请输入确认新原密码', trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'}
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
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.changing = true
            this.axios.post('/otauser', {
              action: 'ResetOTAUserPassword',
              oldPassword: md5(this.passwordForm.oldPassword),
              confirmPassword: md5(this.passwordForm.confirmPassword),
              newPassword: md5(this.passwordForm.newPassword)
            })
              .then((response) => {
                let data = response.data
                if (data.rescode === 200) {
                  this.$message({
                    type: 'success',
                    message: '密码修改成功!'
                  })
                  this.dialogVisible = false
                }
                this.changing = false
              })
              .catch((error) => {
                console.log(error)
                this.changing = false
              })
          } else {
            console.log('error submit!!')
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

<style lang="css" scoped>
  .btn-wrap {
    text-align: right;
  }
</style>
