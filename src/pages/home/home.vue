<template>
  <div v-scroll="onScroll" class="main">
    <v-header></v-header>
    <div class="col-sm-3 col-left" :class="{fixed:position.scrollTop>50}">
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
      return {
        position: {scrollTop: 0, scrollLeft: 0}
      }
    },
    methods: {
      onScroll: function (e, position) {
        this.position = position
      }
    },
    components: {
      'v-header': header,
      'v-nav': nav,
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

  .fixed {
    position: fixed;
    padding-top: 20px;
    top: 0;
  }
</style>
