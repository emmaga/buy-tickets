<template>
  <div class="bg-gray full-screen login-wrap">
    <!-- header -->
    <div id="top-nav" class="navbar navbar-inverse navbar-static-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand">清鹤购票平台</a>
        </div>
      </div>
    </div>
    <!-- /header -->

    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">登录</h3>
      </div>
      <div class="panel-body">
        <!--登录表单-->
        <el-form :model="loginForm" :rules="rules" ref="loginForm" class="loginForm">
          <el-form-item prop="account">
            <el-input v-model="loginForm.account" name="account" auto-complete="on" placeholder="用户名">
              <i class="glyphicon glyphicon-user" slot="prepend"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" name="password" placeholder="密码">
              <i class="glyphicon glyphicon-lock" slot="prepend"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="OTACode">
            <el-input v-model="loginForm.OTACode" name="OTACode" auto-complete="on" placeholder="分销商code">
              <i class="glyphicon glyphicon-briefcase" slot="prepend"></i>
            </el-input>
          </el-form-item>
          <div class="control-group btn-wrap">
            <button :disabled="logining" @click.stop.prevent="submitForm('loginForm')"
                    class="btn btn-primary btn-block">
              登录
            </button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import md5 from 'js-md5'
  import {login} from '@/http/api'
  export default {
    name: 'login',
    data () {
      return {
        logining: false,
        loginForm: {
          account: '',
          password: '',
          OTACode: ''
        },
        rules: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          OTACode: [
            {required: true, message: '请输入分销商code', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.logining = true
            this.loginForm.password = md5(this.loginForm.password)
            login(this.loginForm).then(() => {
              this.$message({
                showClose: true,
                message: '登录成功！',
                type: 'success'
              })
              this.$router.push('home/ticketList')
              this.logining = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .panel {
    width: 320px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -160px;
    margin-top: -180px;
  }

  .btn-wrap {
    padding-top: 10px;
  }
</style>
