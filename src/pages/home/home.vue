<template>
  <div class="main">
    <div class="navbar navbar-inverse navbar-static-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand">清鹤购票平台</a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a> {{ userName }} </a></li>
            <li><a @click="changePW" class="a-btn">修改密码</a></li>
            <li><a @click="exit" class="a-btn"><i class="glyphicon glyphicon-lock"></i> 退出</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col-sm-3 col-left">
      <el-menu :default-active="$route.path.slice(6)" unique-opened router>
        <el-submenu index="1">
          <template slot="title"><i class="glyphicon glyphicon-barcode"></i> 订单中心</template>
          <el-menu-item index="ticketList">手动下单</el-menu-item>
          <el-menu-item index="orderList">订单查询</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="glyphicon glyphicon-wrench"></i> 管理员工具</template>
          <el-menu-item index="userList">用户管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="col-right page">
      <!--当前位置-->
      <div class="sub-nav">
        <a v-for="(item,index) in $route.matched" :key="item.path">
          <i class="glyphicon" :class="{'glyphicon-barcode':item.name=='订单中心'}"></i>
          <i class="glyphicon" :class="{'glyphicon-wrench':item.name=='管理员工具'}"></i>
          {{ item.name }} <i class="glyphicon glyphicon-chevron-right" v-if="!index+1==$route.matched.length"></i>
        </a>
      </div>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>

    <!--密码弹框-->
    <password-dialog></password-dialog>
  </div>
</template>

<script>
  import {clearLocal} from '@/common/js/store'
  import {mapMutations, mapState} from 'vuex'
  import passwordDialog from './passwordDialog'
  export default {
    data () {
      return {
        position: {scrollTop: 0, scrollLeft: 0}
      }
    },
    computed: {
      ...mapState(['userName'])
    },
    created () {
      this.getUserName()
    },
    methods: {
      ...mapMutations(['getUserName']),
      exit () {
        this.$confirm('确定退出吗?')
          .then(() => {
            clearLocal('clearToken')
            this.$store.commit('delUserName')
            this.$router.push('/login')
            this.$message({
              type: 'success',
              message: '退出成功!'
            })
          })
          .catch(() => {
          })
      },
      changePW () {
        this.$bus.$emit('showPasswordDialog')
      }
    },
    components: {
      passwordDialog
    }
  }
</script>

<style lang="less" scoped>
  .main {
    height: 100%;
    overflow: auto;
    &:after {
      content: '';
      display: block;
      clear: both;
      height: 0;
      overflow: hidden;
    }
  }
  .a-btn {
    cursor: pointer;
  }
</style>
