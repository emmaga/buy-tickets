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
      <el-table-column prop="id" label="ID">
      </el-table-column>
      <el-table-column prop="name" label="用户名">
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template scope="scope">
          <el-button type="primary" size="small" @click="showEidtUser(scope.row)">编辑</el-button>
          <el-button type="primary" size="small" @click="showResetUser(scope.row)">重置密码</el-button>
          <el-button type="danger" size="small" @click="deleteUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增用户-->
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
        <el-button @click="submitNewUserForm('userForm')" type="primary">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑用户-->
    <el-dialog :visible.sync="editUserVisible" title="修改用户" size="tiny">
      <el-form :model="editForm" :rules="rules2" ref="editForm" label-width="95px" label-position="left">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitEditUserForm('editForm')" type="primary">提交</el-button>
      </div>
    </el-dialog>


    <!--重置密码-->
    <el-dialog :visible.sync="resetPassVisible" title="重置密码" size="tiny">
      <el-form :model="passForm" :rules="rules3" ref="passForm" label-width="95px" label-position="left">
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passForm.newPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input type="password" v-model="passForm.confirmPassword" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitPassForm('passForm')" type="primary">提交</el-button>
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
      let validatePass3 = (rule, value, callback) => {
        if (this.passForm.newPassword !== '') {
          this.$refs.passForm.validateField('confirmPassword')
        }
        callback()
      }
      let validatePass4 = (rule, value, callback) => {
        if (value !== this.passForm.newPassword) {
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
        editUserVisible: false,
        resetPassVisible: false,
        user: Users,
        userForm: {
          username: '',
          newPassword: '',
          confirmPassword: ''
        },
        editForm: {
          id: '',
          name: ''
        },
        passForm: {
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
        },
        rules2: {
          name: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ]
        },
        rules3: {
          newPassword: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {validator: validatePass3, trigger: 'blur'}
          ],
          confirmPassword: [
            {required: true, message: '请输入确认新原密码', trigger: 'blur'},
            {validator: validatePass4, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      showNewUser () {
        this.newUserVisible = true
        this.$nextTick(() => {
          this.resetForm('userForm')
        })
      },
      showEidtUser (obj) {
        this.editUserVisible = true
        this.editForm = Object.assign({}, obj)
        this.$nextTick(() => {
          this.resetForm('editForm')
        })
      },
      showResetUser (obj) {
        this.resetPassVisible = true
        this.$nextTick(() => {
          this.resetForm('passForm')
        })
      },
      submitNewUserForm (formName) {
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
      submitEditUserForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let para = Object.assign({}, this.editForm)
            this.user.some(u => {
              if (u.id === para.id) {
                u.name = para.name
                return true
              }
            })
            this.editUserVisible = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      submitPassForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.resetPassVisible = false
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
            this.user = this.user.filter(u => u.id !== val.id)
          })
          .catch(() => {
          })
      }
    }
  }
</script>

<style lang="css" scoped>
</style>
