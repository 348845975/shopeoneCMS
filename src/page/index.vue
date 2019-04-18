<template>
  <div class="manage_page fillcontain" style="overflow:hidden;height:100%">
    <div class="addhead">
      <div class="left">
        <a href>
          <img src="../assets/img/logo.png" alt="图片加载失败">
        </a>
      </div>
      <div class="right">
        <span class="father">
          <img src="../assets/img/msg.png" alt="图片加载失败">
          <i>0</i>
        </span>

        <div class="brand">
          <el-dropdown class="avatar-container" style=" cursor: pointer;">
            <div class="avatar-wrapper" style="color:#fff;margin-top:5px;font-size:16px">{{merchantName}}</div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
              <router-link class="inlineBlock" to="/data">
                <el-dropdown-item>修改资料</el-dropdown-item>
              </router-link>
              <router-link class="inlineBlock" to="/editPwd">
                <el-dropdown-item>修改密码</el-dropdown-item>
              </router-link>
              <el-dropdown-item>
                <span style="display:block;" @click="dialogVisible = true">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- <button class="btn" @click="dialogVisible = true">退出</button> -->
      </div>
    </div>
    <el-row style="background:#333744;height:100%;">
      <el-col :span="3">
        <div class="people" style="display:none;">
          <img src="../assets/img/peo.png" alt="图片加载失败">
          <div>品牌名字</div>
        </div>
        <el-menu :default-active="defaultActive" router>
          <el-menu-item index="home">
            <i class="iconfont icon-shouye"></i>&nbsp;&nbsp;首页
          </el-menu-item>
          <el-submenu index="2">
            <div slot="title" class="tit">
              <i class="iconfont icon-dingdan"></i>&nbsp;&nbsp;订单中心
            </div>
            <el-menu-item index="orderwait">
              <i class="iconfont icon-daifahuo"></i>&nbsp;&nbsp;待发货
            </el-menu-item>
            <el-menu-item index="orderdeliver">
              <i class="iconfont icon-yifahuo"></i>&nbsp;&nbsp;发货单
            </el-menu-item>
            <el-menu-item index="orderreturn">
              <i class="iconfont icon-tuihuodan"></i>&nbsp;&nbsp;退货单
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <div slot="title" class="tit">
              <i class="iconfont icon-shangpin"></i>&nbsp;&nbsp;商品中心
            </div>
            <el-menu-item index="mygoods">
              <i class="iconfont icon-shangpin"></i>&nbsp;&nbsp;我的商品
            </el-menu-item>
            <el-menu-item index="followgoods">
              <i class="iconfont icon-shangpin1"></i>&nbsp;&nbsp;跟卖商品上架
            </el-menu-item>
            <el-menu-item index="newgoods">
              <i class="iconfont icon-fabu"></i>&nbsp;&nbsp;发布新商品上架
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="bill">
            <i class="iconfont icon-zhangdan"></i>&nbsp;&nbsp;账单中心
          </el-menu-item>
          <el-menu-item index="data">
            <i class="iconfont icon-ziliao"></i>&nbsp;&nbsp;供应商资料
          </el-menu-item>
          <!-- <el-submenu index="4">
            <div slot="title" class="tit">
              <i class="iconfont icon-bangzhuzhongxin"></i>&nbsp;&nbsp;帮助中心
            </div>
            <el-menu-item index="helpcenter">
              <i class="iconfont icon-wenti"></i>&nbsp;&nbsp;常见问题
            </el-menu-item>
            <el-menu-item index="rule">
              <i class="iconfont icon-guizeshuoming"></i>&nbsp;&nbsp;规则中心
            </el-menu-item>
            <el-menu-item index="connect">
              <i class="iconfont icon-lianxiwomen"></i>&nbsp;&nbsp;联系我们
            </el-menu-item>

          </el-submenu>-->
          <!-- <el-submenu index="7">
						<template slot="title"><i class="el-icon-warning"></i>说明</template>
						<el-menu-item index="explain">说明</el-menu-item>
          </el-submenu>-->
        </el-menu>
      </el-col>
      <el-col :span="21" style="background-color:#f4f4f4;height:100%">
        <el-scrollbar style="height:100%;">
          <div>
            <!-- <keep-alive>
              <router-view v-if="$route.meta.keepAlive" style="padding:0 0 100px 0;"></router-view>
            </keep-alive> -->
            <router-view  style="padding:0 0 100px 0;"></router-view>
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>你确定退出吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false,exit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeadTop from "@/components/headTop";
import AddHead from "@/components/addHead";
import { setStore, removeStore, getStore } from "@/config/mUtils";
export default {
  data() {
    return {
      dialogVisible: false,
      merchantName: "欢迎您"
    };
  },
  components: {
    AddHead,
    HeadTop
  },
  created() {
    // this.getDevHeight()
    this.showLoginInfo();
  },
  computed: {
    defaultActive: function() {
      return this.$route.path.replace("/", "");
    }
  },
  methods: {
    exit() {
      this.$router.replace("/");
      removeStore("token");
    },
    showLoginInfo() {
      this.merchantName = getStore("loginName");
    }
  }
};
</script>


<style lang="less">
@import "../style/mixin";
@fontColor: #fff;
.addhead {
  background: rgb(51, 55, 68);
  overflow: hidden;
  padding: 10px 30px;
  // height: 10%;
  // line-height: 10%;
  .left {
    float: left;
    //   height: 100%;
  }
  .right {
    float: right;
    // line-height: 100%;
    overflow: hidden;
    .father {
      position: relative;
      margin-top: 10px;
      float: left;
      i {
        position: absolute;
        border-radius: 50%;
        width: 19px;
        height: 19px;
        line-height: 19px;
        text-align: center;
        background: #e33946;
        color: #fff;
        display: inline-block;
        top: -10px;
        right: -6px;
        font-size: 10px;
      }
      img {
        vertical-align: middle;
      }
    }
    .brand {
      margin: 0 30px;
      height: 35px;
      line-height: 35px;
      float: left;
      color: #fff;
      li{
        // color:#fff;
      }
    }
    .btn {
      width: 62px;
      height: 30px;
      line-height: 30px;
      background-color: #4775e4;
      border-radius: 5px;
      color: #fff;
      float: left;
      margin-top: 5px;
      cursor: pointer;
    }
  }
}
.el-menu-item {
  background-color: #333744 !important;
  color: @fontColor;
  min-width: 0 !important;
  font-size: 12px;
}

.el-menu-item.is-active {
  color: @fontColor !important;
  background: #3c60ce !important;
}
.el-menu-item.is-active .el-submenu__title {
  background-color: #42485b !important;
  color: @fontColor!important;
}
.el-menu {
  background-color: #42485b !important;
  color: @fontColor!important;
  outline: 0 !important;
  border: none !important;
}
.el-submenu__title {
  color: @fontColor!important;
}
.el-submenu__title > i {
  color: @fontColor!important;
}
.el-menu-item:hover {
  outline: 0 !important;
  background-color: #3c60ce !important;
  .iconfont {
    color: @fontColor;
  }
}
.el-submenu__title:focus,
.el-submenu__title:hover {
  outline: 0 !important;
  background: #3c60ce !important;
  .iconfont {
    color: @fontColor;
  }
}

.people {
  text-align: center;
  color: @fontColor;
  img {
    vertical-align: middle;
    width: 50px;
    height: 50px;
    margin: 10px 0;
  }
  & > div {
    color: @fontColor;
    margin: 10px 0;
  }
}
.tit {
  color: @fontColor;
}
</style>
