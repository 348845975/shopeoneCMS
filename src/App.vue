<template>
  <div id="app" style="height:100%;">
    <router-view></router-view>
  </div>
</template>

<script>
      import AddHead from './components/addHead'
      import {setStore,getStore} from './config/mUtils'
      export default {
        name: "App",
        data(){
          return {token:getStore('token')}
        },
        components: {
          AddHead
        },
        created(){
          console.log('local存储的token',getStore('token'));
        }

      };
</script>

<style lang="less">
@import "./style/common";
.container > div .el-input-group .el-select {
    width: 200px!important;
}
.container > div .el-input-group .el-input {
    width: 200px;
}
</style>
