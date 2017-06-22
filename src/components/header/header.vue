<template>
  <div class="navbar navbar-inverse navbar-static-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand">清鹤购票平台</a>
      </div>
      <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a> {{ userName }} </a>
          </li>
          <li>
            <a @click="changePW" class="a-btn">修改密码</a>
          </li>
          <li>
            <a @click="exit" class="a-btn">
              <i class="glyphicon glyphicon-lock"></i> 退出
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {clearLocal} from '@/common/js/store'
  import {mapMutations, mapState} from 'vuex'
  export default {
    name: 'm-header',
    data () {
      return {}
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
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .a-btn {
    cursor: pointer;
  }
</style>
