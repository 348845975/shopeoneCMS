<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="container">
      <div class="form">
        <div class="item">
          <span class="label">SKU:</span>
          <div class="cont">{{proDetail.skuCode}}</div>
        </div>
        <div class="item">
          <span class="label">所属SPU:</span>
          <div class="cont">{{proDetail.spuCode}}</div>
        </div>
        <div class="item">
          <span class="label">所属类别:</span>
          <div class="cont">{{proDetail.cate1Name}}--{{proDetail.cate2Name}}</div>
        </div>
        <div class="item">
          <span class="label">所属品牌:</span>
          <div class="cont">{{proDetail.brandName}}</div>
        </div>
        <div class="item">
          <span class="label">适用性别:</span>
          <div class="cont">{{proDetail.fixSex}}</div>
        </div>
      </div>
      <div class="form">
        <div class="item">
          <span class="label">商品名称:</span>
          <div class="cont">{{proDetail.name}}</div>
        </div>
        <div class="item">
          <span class="label">国内仓库存:</span>
          <div class="cont">{{proDetail.sumChanlStock}}</div>
        </div>
        <div class="item">
          <span class="label">自有库存:</span>
          <div class="cont">{{proDetail.sumSelStock}}</div>
        </div>
        <div class="item">
          <span class="label">国外仓库存:</span>
          <div class="cont">{{proDetail.sumForeignStock}}</div>
        </div>

        <div class="item">
          <span class="label">更新时间:</span>
          <div class="cont">{{proDetail.updateDateStr}}</div>
        </div>
      </div>
      <div class="form">
        <div class="item">
          <span class="label">吊牌价:</span>
          <div class="cont">{{proDetail.tagPrice}}元</div>
        </div>
        <div class="item">
          <span class="label">你的供货价:</span>
          <div class="cont">{{proDetail.supplyPrice}}元</div>
        </div>
        <div class="item">
          <span class="label">供应商条码:</span>
          <div class="cont">{{proDetail.barCode}}</div>
        </div>
        <div class="item">
          <span class="label">状态:</span>
          <div class="cont">{{proDetail.statusStr}}</div>
        </div>
      </div>
      <div class="form"></div>
      <div class="form"></div>
    </div>
    <div class="container">
      <div class="titt">图片</div>
      <div class="pic-container">
        <div
          style="height:200px;margin-left:30px;"
          v-for="(item,index) in proDetail.skuImgList"
          :key="index"
        >
          <img style="height:100%;width:auto;" :src="item.skuImgUrl" alt="图片加载失败">
        </div>
      </div>
    </div>
    <div class="container" v-if="sale.length">
      <div class="titt">销售属性</div>
      <p class="p-span" v-for="(item,index) in sale" :key="index">
        <span>{{item.attrName}}</span> :
        <span>{{item.optName}}</span>
      </p>
    </div>
    <div class="container" v-if="second.length">
      <div class="titt">分类属性</div>
      <p class="p-span" v-for="(item,index) in second" :key="index">
        <span>{{item.attrName}}</span> :
        <span>{{item.optName}}</span>
      </p>
    </div>
    <div class="container">
      <div class="titt">商品相关描述</div>
      <p class="p-span">{{proDetail.description}}</p>
    </div>
    <div class="container">
      <div class="titt">商品详情</div>
      <p class="p-span">{{proDetail.details}}</p>
    </div>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
import {
  getProductList,
  getProductDetail,
  updateSkuMerForStatus
} from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
export default {
  data() {
    return {
      initSku: "",
      proDetail: {},
      sale: [],
      second: [],
      reason: "", //上架或下架原因
      dialogFormVisible: false,
      status: "",
      skuMerId: ""
    };
  },
  components: {
    headTop
  },
  created() {
    this.initSku = this.$route.query.sku;
  },
  mounted() {},
  watch: {
    $route: {
      handler(val, oldval) {
        console.log(val, oldval);
        this.initSku = this.$route.query.sku;
      },
      deep: true
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      const res = await getProductDetail({
        token: this.$store.state.token,
        skuCode: this.initSku
      });
      if (res && res.code == "0") {
        this.proDetail = res.result.proDetail;
        this.sale = res.result.sale;
        this.second = res.result.second;
      }
    },
    async updatePut() {
      const res = await updateSkuMerForStatus({
        token: this.$store.state.token,
        skuMerId: this.proDetail.id,
        reason: this.reason,
        status: this.status
      });
      console.log("res---0>", res);
      if (res.code == "0") {
        this.$message({
          message: res.message,
          type: "success"
        });
      } else {
        this.$message.error(res.message);
      }
      this.reason = "";
    },
    toGoods() {
      this.$router.push({ path: "/mygoods" });
    },
    goback() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.fillcontain {
  height: auto;
}
.container {
  background: #fff;
  margin: 20px 50px;
  padding: 20px;
  overflow: hidden;
  .form {
    text-align: left;
    float: left;
    .item {
      margin-right: 20px;
      padding: 10px 0;

      .label {
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
        text-align: right;
        color: #999;
        width: 100px;
      }
      .cont {
        display: inline-block;
        vertical-align: middle;
        color: #666;
        max-width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

}
.titt {
  padding: 20px 0;
  text-align: left;
  font-size:14px;
  font-weight: bold;
}
.p-span {
  display: inline-block;
  margin-right: 40px;
  font-size: 12px;
}
</style>
