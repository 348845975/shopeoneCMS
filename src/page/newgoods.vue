<template>

    <div style=" margin: 0 40px;">
       <head-top></head-top>
      <el-steps :active="0" style="width:50%;margin:50px auto;">
        <el-step title="第一步：" description="选择发布方式"></el-step>
        <el-step title="第二步：" description="填写商品信息"></el-step>
        <el-step title="第三步：" description="提交等待审核"></el-step>
      </el-steps>
      <div class="choose" style="margin:150px auto;width:40%">
         <span style="font-size:14px;display:inline-block;line-height:1.8;">请选择发布方式&nbsp;:&nbsp;</span><el-button style="vertical-align: middle;" type="primary" @click="multy" size="mini" plain>批量发布商品</el-button>
          <el-button type="primary" @click="onlyone" size="mini" plain style="vertical-align: middle;">单件发布商品</el-button>
      </div>
    </div>

</template>
<script>
import headTop from "@/components/headTop";
export default {
   components: {
    headTop
  },
  methods: {
    multy() {
      this.$router.push({name:'multy'});
    },
    onlyone() {
      this.$router.push({name:'onlyone'});
    }
  }
};
</script>
<style lang="less" scoped>
.choose {
  display: flex;
  margin: 0 auto;
  .left {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .right {
    flex: 1;
    text-align: left;
    margin: 0 40px;
    button {
      display: block;
      margin: 0;
      margin-top: 20px;
    }
  }
}
</style>