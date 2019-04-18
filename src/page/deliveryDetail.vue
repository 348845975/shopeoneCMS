<template>
  <div class="bigBox">
     <head-top></head-top>
     <div class="smlBox">
      <p class="tit">发货单基本信息</p>
      <div class="container">

        <div class="form">
          <div class="item">
            <span class="label">发货单号:</span>
            <div class="cont">{{deliveryOrderNo}}</div>
          </div>
          <div class="item">
            <span class="label">发货单状态:</span>
            <div class="cont">{{statusStr}}</div>
          </div>
          <div class="item">
            <span class="label">发货原因:</span>
            <div class="cont">{{type}}</div>
          </div>
        </div>

      </div>
    </div>
    <div class="smlBox">
      <div class="block">
        <p class="tit">商品信息</p>
        <el-table
          :data="deliveryProductList"
          border
          style="width: 100%; margin-top: 20px"
          element-loading-text="拼命加载中"
          v-loading="loading"
        >
          <el-table-column prop="skuCode" label="sku号" align="center"></el-table-column>
          <el-table-column label="商品图片">
            <template slot-scope="scope">
              <div style="flex:1;width:50px;height:auto;">
                <img :src="scope.row.productMainImage" alt="图片加载失败" style="width:100%;height:90%;">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="deliveryType" label="发货单类型" align="center"></el-table-column>
          <el-table-column prop="optName" label="规格" align="center"></el-table-column>
          <el-table-column prop="supplyPrice" label="供货价(元)" align="center"></el-table-column>
          <el-table-column prop="productQuantity" label="数量" align="center"></el-table-column>
          <el-table-column prop="inStatus" label="发货单入库结果" align="center"></el-table-column>
          <el-table-column prop="inReason" label="备注" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="item">
          <el-button
          style=""
          v-if="type=='delivery' && status=='QS_NOT_PASS'"
          size="mini"
          @click="toDeliveryOrderLackPage(deliveryOrderNo)"
          type="primary"
        >缺/补处理</el-button>
        <span style="margin-left: 30%;font-size:16px">合计:{{totalPrice}}元   共{{productQuantity}}件</span>
        <div class="cont"></div>
      </div>
    </div>

    <div class="smlBox">
      <p class="tit">物流基本信息</p>
      <div class="container">

        <div class="form">
          <div class="item">
            <span class="label">物流单号:</span>
            <div class="cont">{{expressNo}}</div>
          </div>
        </div>
        <div class="form">
          <div class="item">
            <span class="label">包裹总重(kg):</span>
            <div class="cont">{{weight}}</div>
          </div>
          <div class="item">
            <span class="label">包裹体积(m³):</span>
            <div class="cont">{{cubage}}</div>
          </div>
          <div class="item">
            <span class="label">是否妥投:</span>
            <div class="cont"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="smlBox">
      <p class="tit">揽件与配送地址信息</p>
      <div class="container">

        <div class="form">
          <div class="item">
            <span class="label item-span">发货信息</span>
          </div>
          <div class="item">
            <span class="label" >发货人:</span>
            <div class="cont">{{contactName}}</div>
          </div>
          <div class="item">
            <span class="label">发货详细地址:{{sendAddress}}</span>
          </div>
          <div class="item">
            <span class="label">发货联系手机:</span>
            <div class="cont">{{tel}}</div>
          </div>
          <div class="item">
            <span class="label">类型:</span>
            <div class="cont">{{host}}</div>
          </div>
        </div>
        <div class="form">
          <div class="item">
            <span class="label item-span">收货信息</span>
          </div>
          <div class="item">
            <span class="label">收货人:</span>
            <div class="cont">{{receiverName}}</div>
          </div>
          <div class="item">
            <span class="label">收货详细地址: {{addressDetail}}</span>
          </div>
          <div class="item">
            <span class="label">收货联系手机:</span>
            <div class="cont">{{receiverTel}}</div>
          </div>
          <div class="item">
            <span class="label">类型:</span>
            <div class="cont">{{warehouseName}}</div>
          </div>
        </div>
      </div>
    </div>


    <div class="smlBox">
      <p class="tit">物流轨迹信息</p>
      <div class="container" v-if="expressInfo.length">
        <div style="height: 220px;">
          <el-steps direction="vertical" :active="1" :key="index">
            <el-step v-for="(item,index) in expressInfo" :title="item.msg" :description="item.time"></el-step>
          </el-steps>
        </div>
      </div>
      <div style="margin-top:10px;" v-else>暂无物流信息</div>
    </div>

    <div class="smlBox">
      <p class="tit">物流公司</p>
      <div class="container">

        <div class="forP">
          <p>
            <span style="width:100px;">名称：{{expressName}}</span>
          </p>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { baseUrl } from "../config/env";
import { deliveryOrderDetail } from "@/api/getData";
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["link", "image", "video"],
  ["clean"] // remove formatting button
];
import headTop from "@/components/headTop";
export default {
    components: {
    headTop
  },
  data() {
    return {
      deliveryProductList: [], //第一步的 商品列表
      loading: true,
      dialogFormVisible: false,
      expressInfo: {},
    };
  },
    watch: {
    //防止用户返回上一级重新勾选，但是页面并未重新加载
      $route: {
      handler(val, oldval) {
        console.log(val, oldval);
        this.deliveryOrderNo = this.$route.query.deliveryOrderNo;
      },
      deep: true
    }
  },
  created() {
    this.deliveryOrderNo = this.$route.query.deliveryOrderNo;
    console.log("come in-->", this.$route.query.deliveryOrderNo);
  },

  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      const res = await deliveryOrderDetail({
        token: this.$store.state.token,
        deliveryOrderNo: this.deliveryOrderNo
      });
      console.log("ressssss-->", res);
      if (res && res.code == "0") {
        this.loading = false;
        this.deliveryProductList = res.result.deliveryOrderInfo.deliveryProductList; //sku商品list
        this.totalPrice = res.result.deliveryOrderInfo.totalPrice; //付款总额
        this.productQuantity = res.result.deliveryOrderInfo.productQuantity; //订单商品总数
        this.expressNo = res.result.deliveryOrderInfo.expressNo; //物流单号
        this.deliveryOrderNo = res.result.deliveryOrderInfo.deliveryOrderNo; //发货单号
        this.weight = res.result.deliveryOrderInfo.weight; //包裹总重
        this.cubage = res.result.deliveryOrderInfo.cubage; //包裹体积
        this.carriage = res.result.deliveryOrderInfo.carriage; //物流金额
        this.contactName = res.result.merchantInfo.contactName; //发货人
        this.sendAddress = res.result.merchantInfo.sendAddress; //发货详细地址
        this.tel = res.result.merchantInfo.tel; //发货联系手机
        this.host = res.result.merchantInfo.host; //发货公司类型
        this.receiverName = res.result.deliveryOrderInfo.receiverName; //收货人
        this.addressDetail = res.result.deliveryOrderInfo.addressDetail; //收货详细地址
        this.receiverTel = res.result.deliveryOrderInfo.receiverTel; //收货联系手机
        this.warehouseName = res.result.deliveryOrderInfo.warehouseName; //收货公司类型
        this.expressName = res.result.deliveryOrderInfo.expressName; //物流公司

        this.type = res.result.deliveryOrderInfo.type;
        this.status = res.result.deliveryOrderInfo.status;
        this.statusStr = res.result.deliveryOrderInfo.statusStr;
        console.log("deliveryProductList", this.deliveryProductList);
        console.log("expressNo", this.expressNo);
        this.expressInfo = res.result.expressInfo;
        console.log("expressInfo=", this.expressInfo);
      }
    },
    handledel(index) {
      this.deliveryProductList.splice(index, 1);
    },
    toDeliveryOrderLackPage(deliveryOrderNo) {
      this.$router.push({
        path: "/deliveryOrderLack",
        query: { deliveryOrderNo: deliveryOrderNo }
      });
    }
  }
};
</script>
<style lang="less" scoped>
a {
  color: #409eff;
}
.bigBox {
  margin:0 40px;
  .smlBox {
    padding: 20px;
    background-color: #fff;
    margin: 20px 0;
    .tit {
      color: #666;
      font-size:14px;
      font-weight: bold;
    }
    .block {
      padding: 10px 0;
    }
    .el-button {
      margin: 0 20px;
    }
    .forP {
      & > p {
        margin-top: 20px;
      }
    }
  }
}
.el-upload-list {
  width: 150px !important;
  background-color: pink;
}
.container {
  background: #fff;
  // margin: 20px 50px;
  padding: 10px 0;
  .form {
    display: flex;
    text-align: left;
    .item {
      flex: 1/3;
      margin-right: 20px;
      padding: 10px 0;
      .label {
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
      }
      .cont {
        max-width: 250px;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
.item-span{
  font-weight: bold;
  font-size:14px;
}
</style>