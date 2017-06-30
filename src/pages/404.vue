<template>
  <div class="main not-found">
    <div class="navbar navbar-inverse navbar-static-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand">清鹤购票平台</a>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="title">
        <h1>404</h1>
        <h4>您访问的页面走丢了...</h4>
        <router-link to="home/ticketList">返回首页>></router-link>
      </div>
      <img src="../common/img/404.jpg" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
  .box {
    width: 600px;
    margin: 0 auto;
    position: relative;
    padding-top:100px;
    h1 {
      color: #bcc1cc
    }
    .title {
      position: absolute;
      left: 50px;
      top: 50px;
    }
  }

  .box a {
    font-size: 14px;
    cursor: pointer;
  }
</style>
