<template>
  <div>
    <v-header></v-header>

    <div class="col-sm-3 col-left">
        <v-nav></v-nav>
    </div>
    <div class="col-sm-9 col-right page">
          <router-view></router-view>
    </div>

    <!--密码弹框-->
    <password-dialog></password-dialog>
  </div>
</template>

<script>
  import header from '@/components/header/header'
  import nav from '@/components/nav/nav'
  import passwordDialog from './passwordDialog'
  export default {
    data () {
      return {}
    },
    components: {
      'v-header': header,
      'v-nav': nav,
      passwordDialog
    }
  }
</script>

<style lang="less">
  #app {
    font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "MicrosoftYaHei", "WenQuanYi Micro Hei", sans-serif;
  }

  .u-page {
    padding: 10px 0 50px;
    text-align: right;
  }

  .sub-nav {
    font-weight: bold
  }
</style>
