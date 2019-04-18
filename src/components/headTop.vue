<template>
  <div class="header_container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index'}"></el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="(item, index) in $route.meta"
				v-if="index+1<$route.meta.length"
        :key="index"
        :to="{name:item}"
      >{{item}}</el-breadcrumb-item>
			<el-breadcrumb-item v-else>{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { baseImgPath } from "@/config/env";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      baseImgPath
    };
  },
  created() {},
  computed: {},
  methods: {}
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.header_container {
  background-color: rgb(244, 244, 244);
  height: 40px;
  line-height: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  margin-bottom: -10px;
}
.avator {
  .wh(36px, 36px);
  border-radius: 50%;
  margin-right: 37px;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
