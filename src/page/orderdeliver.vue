<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="container" style="background:#fff;margin:10px 20px;">
      <div style="margin-top: 10px;">
        <el-input placeholder="请输入内容" v-model="inputValue" class="input-with-select">
          <el-select v-model="selectValue" slot="prepend" style="color:#666!important;">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in selStyle"
              :key="item.value"
              style="color:#666!important;"
            ></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="initData"></el-button>
        </el-input>
      </div>
      <div class="our">
        <div style="margin-top:10px;">
          <span class="s-tit">发货单时间：</span>
          <el-radio-group v-model="timeRange" class="tol" @change="refreshTime($event)" size="mini">
            <el-radio-button label="0">全部</el-radio-button>
            <el-radio-button label="1">今日</el-radio-button>
            <el-radio-button label="2">7日</el-radio-button>
            <el-radio-button label="3">30日</el-radio-button>
            <el-radio-button label="4">三个月</el-radio-button>
            <el-radio-button label="5">1年</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-model="time"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2"
            class="tol"
            @change="timeChange($event)"
            size="mini"
          ></el-date-picker>
        </div>
      </div>
      <div class="our">
        <div style="margin-top: 10px">
          <span class="s-tit">发货单状态：</span>
          <el-radio-group
            v-model="deliveryOrderStatus"
            class="tol"
            @change="refresh($event)"
            size="mini"
          >
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="DELIVERED">运输中</el-radio-button>
            <el-radio-button label="QS_NOT_PASS">质检未通过</el-radio-button>
            <el-radio-button label="IN_STORAGE">已入库</el-radio-button>
          </el-radio-group>

          <span class="s-tit">发货原因：</span>
          <el-radio-group
            v-model="deliveryOrderType"
            class="tol"
            @change="typeRefresh($event)"
            size="mini"
          >
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="backup">备货单</el-radio-button>
            <el-radio-button label="delivery">商城订单</el-radio-button>
            <el-radio-button label="replenishment">补货单</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div style="margin:0 20px;margin-bottom:-10px;">
      <div style="background:#fff;padding:20px;">
        <el-button size="mini" type="primary" plain @click="exportExcel()">导出数据</el-button>

        <el-pagination
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          style="float:right"
          :total="totalCount"
          :current-page="currentPage"
          @current-change="changePage($event)"
          :disabled="disabled"
          background
        ></el-pagination>
      </div>
    </div>
    <div style="margin:0 20px">
      <el-table
        :data="orderList"
        border
        style="width: 100%; margin-top: 20px"
        @sort-change="sortChange"
        highlight-current-row
        @current-change="handleCurrentChange"
        element-loading-text="拼命加载中"
        v-loading="loading"
        :header-cell-style="{background:'#fafafa',color:'#606266'}"
      >
        <el-table-column width="50" align="center" type="index"></el-table-column>

        <el-table-column prop="deliveryOrderNo" label="发货单号" align="center"></el-table-column>
        <el-table-column prop="statusStr" label="状态" align="center" ></el-table-column>
        <el-table-column prop="productQuantity" label="商品件数" align="center" width="80"></el-table-column>
        <el-table-column prop="totalPrice" label="商品总价" align="center" ></el-table-column>
        <el-table-column prop="typeStr" label="发货原因" align="center"></el-table-column>
        <el-table-column label="快递信息" align="center" width="250">
          <template slot-scope="scope">
            <span>{{scope.row.expressName}}</span>
            <br>
            <br>
            <p>
              <span style="color:#99a9bf;">单号：</span>
              <a>{{scope.row.expressNo}}</a>
              <!-- <router-link
                style="color:blue;"
                :to="'xxx?expressNo='+scope.row.expressNo"
              >{{scope.row.expressNo}}</router-link> -->
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="toDeliverydetailPage(scope.row.deliveryOrderNo)"
              type="primary"
            >查看</el-button>
            <br>
            <el-button
              style="margin-top:10px;"
              v-if="scope.row.type=='delivery' && scope.row.status=='QS_NOT_PASS'"
              size="mini"
              @click="toDeliveryOrderLackPage(scope.row.deliveryOrderNo)"
              type="primary"
            >缺/补处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import {
  deliveryOrderList,
  selectedOrderValide,
  getOrderGoodList,
  outOfStock,
  exportDeliveryOrderExcel
} from "@/api/getData";
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
  import { baseUrl } from "../config/env";

Array.prototype.removeByValue = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) {
      this.splice(i, 1);
      break;
    }
  }
};
export default {
  data() {
    return {
      disabled: false,
      orderList: [], // 获取row的key值
      dialogFormVisible: false,
      spanArr: [],
      pos: "",
      getRowKeys(row) {
        return row.id;
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      currentRow: null,
      radio1: "全部",
      deliveryOrderStatus: "", //订单状态
      deliveryOrderType: "", //发货原因
      radio3: "全部",
      pickerOptions2: {
        shortcuts: [
          {
            text: "今日",
            onClick(picker) {
              const end = new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
              );
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
              );
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
              );
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
              );
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 89);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
              );
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 364);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      time: "", //时间范围
      startDate: "", //开始时间
      endDate: "", //结束时间
      selStyle: [
        {
          value: "deliveryOrderNo",
          label: "发货单号"
        },
        {
          value: "orderNo",
          label: "订单号"
        },
        {
          value: "skuCode",
          label: "SKU码"
        },
        {
          value: "expressNo",
          label: "物流单号"
        }
      ],
      inputValue: "",
      selectValue: "",
      currentPage: 1, //当前页数
      pageSize: 10,
      totalCount: 100,
      orderWay: "", //排序方式,
      orderBy: "", //排序高低倒序还是正序
      orderNoForQuehuo: "", //用于缺货的订单号
      orderNo: "",
      deliveryOrderNo: "",
      skuCode: "",
      expressNo: "",
      productName: "",
      nowCode: "",
      multipleSelection: [], //多选
      transOrderList: [], //勾选的订单号
      skuCodeList: [], //勾选的商品
      loading: true,
      timeRange: "0", //判断筛选时间类型 0全部 1...
      goodList: []
    };
  },
  components: {
    headTop
  },
  created() {
    if (this.$route.query) {
      this.skuCode = this.$route.query.skuCode;
    }
  },
  computed: {
    getToken() {
      return this.$store.state.token;
    }
  },
  watch: {
    $route: "getparams"
  },
  mounted() {
    this.initData();
  },
  methods: {
    getparams() {
      this.skuCode = this.$route.query.skuCode;
    },
    sortChange(column, prop, order) {
      if (column.prop) {
        this.orderBy = column.prop;
        console.log(column.order);
        if (column.order == "ascending") {
          this.orderWay = "asc";
        } else if (column.order == "descending") {
          this.orderWay = "desc";
        }
      }
      this.initData();
    },
    async initData() {
      this.orderNo = this.skuCode = this.expressNo = this.productName = this.refundOrderNo =
        "";
      switch (this.selectValue) {
        case "deliveryOrderNo":
          this.deliveryOrderNo = this.inputValue;
          break;
        case "orderNo":
          this.orderNo = this.inputValue;
          break;
        case "skuCode":
          this.skuCode = this.inputValue;
          break;
        case "expressNo":
          this.expressNo = this.inputValue;
          break;
        default:
          break;
      }
      this.loading = true;
      const orderList = await deliveryOrderList({
        token: this.$store.state.token,
        orderBy: this.orderBy,
        orderWay: this.orderWay,
        deliveryOrderNo: this.deliveryOrderNo,
        orderNo: this.orderNo,
        skuCode: this.skuCode,
        expressNo: this.expressNo,
        deliveryOrderStatus: this.deliveryOrderStatus,
        deliveryOrderType: this.deliveryOrderType,
        startDate: this.startDate,
        endDate: this.endDate,
        currentPage: this.currentPage
      });

      if (orderList) {
        console.log("deliveryOrderList=", orderList);
        this.loading = false;
        var reslut = orderList.result.page;
        this.orderList = reslut.resultList;

        this.totalCount = reslut.totalCount;
      }
    },
    timeChange(e) {
      var time = this.time;
      console.log("time", time);
      console.log("selectValue", this.selectValue);
      if (time == "" || time == null) {
        this.startDate = "";
        this.endDate = "";
        console.log("全部", this.startDate, this.endDate);
      } else {
        this.startDate = this.moment(time[0]).format("YYYY-MM-DD HH:mm:ss");
        this.endDate = this.moment(time[1]).format("YYYY-MM-DD HH:mm:ss");
        console.log("qq", this.startDate, this.endDate);
      }
      this.initData();
    },
    refresh() {
      this.initData();
    },
    typeRefresh() {
      this.refresh();
    },
    async exportExcel() {
      var url = `${baseUrl}/deliveryOrder/exportDeliveryOrderExcel?token=${
        this.$store.state.token
      }&orderBy=${this.orderBy}&orderWay=${this.orderWay}&deliveryOrderNo=${
        this.deliveryOrderNo
      }&orderNo=${this.orderNo}
        &expressNo=${this.expressNo}&deliveryOrderStatus=${
        this.deliveryOrderStatus
      }&deliveryOrderType= ${this.deliveryOrderType}&startDate=${
        this.startDate
      }&endDate=${this.endDate}&currentPage=${this.currentPage}`;
      window.location.href = url;
    },
    refreshTime() {
      if (this.timeRange && this.timeRange == "0") {
           this.startDate ="";
        this.endDate ="";
      } else if (this.timeRange && this.timeRange == "1") {
        //今天

        const end = new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            24 * 60 * 60 * 1000 -
            1
        );
        const start = new Date(
          new Date(new Date().toLocaleDateString()).getTime()
        );
        this.startDate = this.moment(start).format("YYYY-MM-DD HH:mm:ss");
        this.endDate = this.moment(end).format("YYYY-MM-DD HH:mm:ss");
        console.log(this.startDate, this.endDate);
      } else if (this.timeRange && this.timeRange == "2") {
        //7天

        const end = new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            24 * 60 * 60 * 1000 -
            1
        );
        const start = new Date(
          new Date(new Date().toLocaleDateString()).getTime()
        );
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
        this.startDate = this.moment(start).format("YYYY-MM-DD HH:mm:ss");
        this.endDate = this.moment(end).format("YYYY-MM-DD HH:mm:ss");
        console.log(this.startDate, this.endDate);
      } else if (this.timeRange && this.timeRange == "3") {
        //30天

        const end = new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            24 * 60 * 60 * 1000 -
            1
        );
        const start = new Date(
          new Date(new Date().toLocaleDateString()).getTime()
        );
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
        this.startDate = this.moment(start).format("YYYY-MM-DD HH:mm:ss");
        this.endDate = this.moment(end).format("YYYY-MM-DD HH:mm:ss");
        console.log(this.startDate, this.endDate);
      } else if (this.timeRange && this.timeRange == "4") {
        //3个月

        const end = new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            24 * 60 * 60 * 1000 -
            1
        );
        const start = new Date(
          new Date(new Date().toLocaleDateString()).getTime()
        );
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 89);
        this.startDate = this.moment(start).format("YYYY-MM-DD HH:mm:ss");
        this.endDate = this.moment(end).format("YYYY-MM-DD HH:mm:ss");
        console.log(this.startDate, this.endDate);
      } else if (this.timeRange && this.timeRange == "5") {
        //1年

        const end = new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            24 * 60 * 60 * 1000 -
            1
        );
        const start = new Date(
          new Date(new Date().toLocaleDateString()).getTime()
        );
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 364);
        this.startDate = this.moment(start).format("YYYY-MM-DD HH:mm:ss");
        this.endDate = this.moment(end).format("YYYY-MM-DD HH:mm:ss");
        console.log(this.startDate, this.endDate);
      }
      this.initData();
    },
    changePage(e) {
      console.log("eeeeeeee", e);
      this.currentPage = e;
      this.initData();
    },
    handleCurrentChange(val) {
      // 选中行高亮
      this.currentRow = val;
    },
    setCurrent(row) {
      // 取消高亮
      this.$refs.singleTable.setCurrentRow(row);
    },
    async goSendout() {
      if (!this.transOrderList) {
        this.$message.error("请选择自发货订单！");
        return null;
      }
      var list = this.transOrderList.join(",");

      const res = await selectedOrderValide({
        token: this.$store.state.token,
        orderNos: list
      });

      console.log("res", res);
      if (res.code == "0") {
        //进入发货详情
        this.$router.push({ path: "/sendout", query: { orderNos: list } });
      } else if (res.code == "1") {
        this.$message({
          message: res.message,
          type: "error"
        });
      }
    },
    toDeliverydetailPage(deliveryOrderNo) {
      this.$router.push({
        path: "/deliveryDetail",
        query: { deliveryOrderNo: deliveryOrderNo }
      });
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

<style lang="less" >
@import "../style/mixin.css";
@font: 14px;
.table_container {
  padding: 20px;
}
.container {
  padding: 10px 20px;
  & > div {
    // text-align: center;
    .el-input-group {
      width: 700px;
      margin-left: 150px;
    }
  }
}
.el-input__inner {
  text-align: center;
}
.our {
  display: flex;
  margin: 0 auto;
  & > div {
    text-align: left;
    .s-tit {
      display: inline-block;
      text-align: right;
      font-size: @font;
      width: 150px;
      color: #333;
      font-weight: bold;
    }
  }
}
a {
  color: blue;
  cursor: pointer;
}

</style>
