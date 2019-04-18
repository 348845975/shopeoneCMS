<template>
  <el-dialog title="提示" :visible.sync="alert" width="30%" :before-close="handleClose">
    <span>您确定要离开当前页吗？确定离开则此页面数据将不会保存</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="alert= false">取 消</el-button>
      <el-button type="primary" @click="alert = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
 export default {
    data() {
      return {
        alert: false
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    }
  };
</script>
<style>
</style>