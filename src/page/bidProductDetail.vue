<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="container">
      <div class="form">
        <div class="item">
          <span class="label">SPU:</span>
          <div class="cont">{{proDetail.spuCode}}</div>
        </div>
        <div class="item">
          <span class="label">商品名称:</span>
          <div class="cont">{{proDetail.name}}</div>
        </div>
        <div class="item">
          <span class="label">热销类型:</span>
          <div class="cont">{{proDetail.salesType}}</div>
        </div>
        <div class="item">
          <span class="label">所属类别:</span>
          <div class="cont">{{proDetail.cate1Name}}--{{proDetail.cate2Name}}</div>
        </div>
        <div class="item">
          <span class="label">所属品牌:</span>
          <div class="cont">{{proDetail.brandName}}</div>
        </div>
      </div>
      <div class="form">
        <div class="item" v-if="skus.length">
          <div class="label">拥有SKU:</div>
          <p class="p-span" v-for="(item,index) in skus" :key="index">
            <span>{{item.skuCode}}</span>
          </p>
        </div>
        <div class="item">
          <span class="label">海关HS码:</span>
          <div class="cont">{{proDetail.hsCode}}</div>
        </div>
        <div class="item">
          <span class="label">适用性别:</span>
          <div class="cont">{{proDetail.fixSexStr}}</div>
        </div>
        <div class="item">
          <span class="label">创建时间:</span>
          <div class="cont">{{proDetail.createDateStr}}</div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="titt">商品图片</div>
      <div class="pic-container">
        <div class="item">
          <img style="height:35%;width:20%;" :src="proDetail.spuMainImage" alt="图片加载失败">
        </div>
      </div>
    </div>
    <div class="container" v-if="sale.length">
      <div class="titt">销售属性</div>
      <span class="p-span" v-for="(item,index) in sale" :key="index">
        <span>{{item[0].skuCode}}</span> :
        <div class="p-span" v-for="(it,i) in item" :key="i">
          <span>{{it.attrName}}</span> :
          <span>{{it.optName}}</span>
        </div>
      </span>
    </div>
    <div class="container" v-if="second.length">
      <div class="titt">分类属性</div>
      <p class="p-span" v-for="(item,index) in second" :key="index">
        <span>{{item.attrName}}</span> :
        <span>{{item.attributeValue}}</span>
      </p>
    </div>
    <div class="container" v-if="second.length">
      <div class="item">
        <div class="titt">商品简述:</div>
        <div class="cont">{{proDetail.description}}</div>
      </div>
    </div>
    <div class="container" v-if="second.length">
      <div class="item">
        <div class="titt">商品详情:</div>
        <div class="cont">{{proDetail.details}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import headTop from "@/components/headTop";
import { spuProDetail } from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
export default {
  data() {
    return {
      initSpuCode: "",
      proDetail: {},
      skus: [],
      sale: [],
      second: [],
      dialogFormVisible: false
    };
  },
  components: {
    headTop
  },
  created() {
    this.initSpuCode = this.$route.query.spuCode;
  },
  mounted() {},
  watch: {
    $route: {
      handler(val, oldval) {
        console.log(val, oldval);
        this.initSpuCode = this.$route.query.spuCode;
        console.log("spuCode", this.initSpuCode);
      },
      deep: true
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      const res = await spuProDetail({
        token: this.$store.state.token,
        spuCode: this.initSpuCode
      });
      if (res && res.code == "0") {
        this.proDetail = res.result.spuDetail;
        this.skus = res.result.spuDetail.skuLists;
        this.sale = res.result.saleAttrList;
        this.second = res.result.secondAttrList;
        console.log("proDetail", this.proDetail);
        console.log("sale", this.sale);
        console.log("second", this.second);
      }
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
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
      }
    }
  }
}
.titt {
  padding: 20px 0;
  text-align: left;
  font-size: 14px;
  font-weight: bold;
}
.p-span {
  display: inline-block;
  margin-right: 40px;
  font-size: 12px;
}
</style>
