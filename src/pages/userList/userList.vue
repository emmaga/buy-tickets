<template>
  <div><!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="用户名">
            <el-button type="primary" icon="search" slot="append">搜索
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showNewUser">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-table :data="user" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="name" label="用户名">
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template scope="scope">
          <el-button type="primary" size="small">编辑</el-button>
          <el-button type="primary" size="small">重置密码</el-button>
          <el-button type="danger" size="small" @click="deleteUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :visible.sync="newUserVisible" title="新增用户" size="tiny">
      <el-form :model="userForm" :rules="rules" ref="userForm" label-width="95px" label-position="left">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="userForm.newPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input type="password" v-model="userForm.confirmPassword" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('userForm')">重置</el-button>
        <el-button @click="submitForm('userForm')" type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {Users} from '@/mock/data/user'
  // import md5 from 'js-md5'

  export default {
    data () {
      let validatePass = (rule, value, callback) => {
        if (this.userForm.newPassword !== '') {
          this.$refs.userForm.validateField('confirmPassword')
        }
        callback()
      }
      let validatePass2 = (rule, value, callback) => {
        if (value !== this.userForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        filters: {
          name: ''
        },
        newUserVisible: false,
        user: Users,
        userForm: {
          username: '',
          newPassword: '',
          confirmPassword: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
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
    methods: {
      showNewUser () {
        this.newUserVisible = true
        this.resetForm()
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.user.push({name: this.userForm.username})
            this.newUserVisible = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      deleteUser (val) {
        this.$confirm('确定删除吗?')
          .then(() => {
            this.user = this.user.filter(u => u.name !== val.name)
          })
          .catch(() => {
          })
      }
    }
  }
</script>

<style lang="css" scoped>
</style>
