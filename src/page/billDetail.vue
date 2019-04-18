<template>
  <div>
    <head-top></head-top>
    <div class="container">
      <p class="msg">账单号：{{BillInfo.billNo}}</p>
      <div class="conts">
        <div class="line">
          <div class="l-left">账单生成时间 ：</div>
          <div class="l-right">{{BillInfo.createDateStr}}</div>
        </div>
        <div class="line">
          <div class="l-left">账单总金额(元) ：</div>
          <div class="l-right">{{BillInfo.billTotalAmount}}</div>
        </div>
        <div class="line">
          <div class="l-left">供应商名称 ：</div>
          <div class="l-right">{{BillInfo.billTotalAmount}}</div>
        </div>
        <div class="line">
          <div class="l-left">账单状态 ：</div>
          <div class="l-right">{{BillInfo.billStatusStr}}</div>
        </div>
        <div class="line">
          <div class="l-left">打印凭证 ：</div>
          <div class="l-right">
            <a
               v-if="BillInfo.billStatus=='1'"
              :href="BillInfo.billVoucher"
              style="text-decoration:underline;color:blue"
              target="_blank"
            >查看凭证</a>
            <span v-else>暂无</span>
          </div>
        </div>
        <div class="line">
          <div class="l-left">持卡人姓名 ：</div>
          <div class="l-right">{{BillInfo.userName}}</div>
        </div>
        <div class="line">
          <div class="l-left">银行卡号 ：</div>
          <div class="l-right">{{BillInfo.bankCardNum}}</div>
        </div>
        <div class="line">
          <div class="l-left">开户行 ：</div>
          <div class="l-right">{{BillInfo.depositBank}}</div>
        </div>
      </div>
    </div>

    <div class="container">
      <p class="msg">账单商品</p>
      <div class="conts">
        <el-table
          :data="orderProdect"
          border
          show-summary
          :summary-method="getSummaries"
          style="width: 100%; margin-top: 20px"
          highlight-current-row
          element-loading-text="拼命加载中"
          v-loading="false"
          :header-cell-style="{background:'#fafafa',color:'#606266'}"
        >
          <el-table-column prop="orderNo" label="订单号/退货单号" align="center"></el-table-column>
          <el-table-column label="商品信息" width="350" align="center">
            <template slot-scope="scope">
              <div
                class="dashed"
                style="display:flex;padding:5px 0px 5px 3px;"
                v-for="(item,index) in scope.row.detailList"
                :key="index"
              >
                <div style="flex:1;">
                  <img :src="item.productMainImage" alt="图片加载失败" style="width:100%;height:90%;">
                </div>
                <div style="flex:3;text-align:left;margin-left:8px;">
                  <p>
                    <span style="color:#99a9bf;">名称：</span>
                    {{item.productName}}
                  </p>
                  <p>
                    <span style="color:#99a9bf;">SKU码：</span>
                    <router-link
                      style="color:blue;"
                      :to="'goodDetail?sku='+item.skuCode"
                    >{{item.skuCode}}</router-link>
                  </p>
                  <p>
                    <span>
                      <span style="color:#99a9bf;">供货码：</span>
                      {{item.barCode}}
                    </span>&nbsp;&nbsp;
                    <span style="color:#99a9bf;">供货单价：</span>
                    {{item.supplyPrice}}
                  </p>
                  <p>
                    <span>
                      <span style="color:#99a9bf;">供货价：</span>
                      {{item.supplyPrice}}
                    </span>
                    &nbsp;&nbsp;
                    <span style="color:#99a9bf;">数量：</span>
                    {{item.productQuantity}}
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="barCode" label="供货条码" align="center"></el-table-column>
          <el-table-column label="供货规格" align="center"></el-table-column>-->
          <el-table-column prop="expressNo" label="物流单号" align="center"></el-table-column>
          <!-- <el-table-column prop="supplyPrice" label="供货单价" align="center"></el-table-column> -->
          <el-table-column prop="productQuantity" label="发货数量" align="center"></el-table-column>
          <el-table-column prop="deliveryDeadlineStr" label="完结时间" align="center"></el-table-column>
          <el-table-column prop="totalAmount" label="总金额" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="container">
      <p class="msg">应结账款&nbsp;&nbsp;{{BillInfo.billTotalAmount}}元</p>
      <div class="conts"></div>
    </div>
  </div>
</template>


<script>
import headTop from "../components/headTop";
import bill from "./bill.json";
import { mapState } from "vuex";
import { baseUrl, baseImgPath } from "@/config/env";
import { getbillDetails } from "@/api/getData";
export default {
  data() {
    return {
      baseUrl,
      baseImgPath,
      multipleSelection: [],
      BillInfo: [],
      orderProdect: [],
      billNo: ""
    };
  },
  components: {
    headTop
  },
  created() {
    console.log("this.$route.query", this.$route.query);
    this.billNo = this.$route.query.billNo;
  },
  watch: {
    $route: {
      handler(val, oldval) {
        this.billNo = this.$route.query.billNo;
      },
      deep: true
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    getSummaries(param) {
      console.log("params", param);
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 4) {
          sums[index] = "总价";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (index === 5) {
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += " 元";
          } else {
            sums[index] = "N/A";
            // return false;
          }
        }
      });

      return sums;
    },
    async initData() {
      const res = await getbillDetails({
        token: this.$store.state.token,
        billNo: this.billNo
      });
      console.log("billdetails", res);
      if (res.simpleJsonResult.code == "0") {
        this.BillInfo = JSON.parse(
          JSON.stringify(res.simpleJsonResult.result.BillInfo)
        );
        this.orderProdect = JSON.parse(
          JSON.stringify(res.simpleJsonResult.result.orderProdect)
        );
        console.log("--->", this.orderProdect);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.container {
  background: #fff;
  margin: 10px 20px;
  padding: 10px 20px;
  .msg {
    font-size: 16px;
    font-weight: bold;
    margin: 10px 0;
  }
  .conts {
    overflow: hidden;
    .line {
      width: 50%;
      float: left;
      margin-bottom: 10px;
      .l-left {
        float: left;
        width: 40%;
        text-align: right;
        font-size: 14px;
      }
      .l-right {
        float: left;
        width: 60%;
        font-size: 14px;
      }
    }
  }
}
</style>
