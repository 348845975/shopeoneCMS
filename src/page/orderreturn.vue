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
          <span class="s-tit">订单时间范围：</span>
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
          <span class="s-tit">退货状态：</span>
          <el-radio-group v-model="refundStatus" class="tol" @change="refresh($event)" size="mini">
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="305">待确认</el-radio-button>
            <el-radio-button label="306">仓库处理中</el-radio-button>
            <el-radio-button label="307">已报废</el-radio-button>
            <el-radio-button label="308">已存放</el-radio-button>
          </el-radio-group>
        </div>
        <div style="margin-top: 10px;margin-left:20px;">
          <span class="s-tit">退货原因:</span>
          <el-radio-group v-model="refundReason" class="tol" @change="refresh($event)" size="mini">
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="usable">不影响二次销售</el-radio-button>
            <el-radio-button label="scrap">影响二次销售</el-radio-button>
            <el-radio-button label="otherReason">其他</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div style="margin:0 20px;margin-bottom:-10px;">
      <div style="background:#fff;padding:20px;">
        <el-button size="mini" type="primary" @click="exportExcel()" plain>导出数据</el-button>

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
        @selection-change="handleSelectionChange"
        highlight-current-row
        @current-change="handleCurrentChange"
        element-loading-text="拼命加载中"
        v-loading="loading"
        :header-cell-style="{background:'#fafafa',color:'#606266'}"
      >
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="退货状态" align="center" width="80">
          <template slot-scope="scope">
            <p v-if="scope.row.refundStatus=='305'">待确认</p>
            <p v-if="scope.row.refundStatus=='306'">仓库处理中</p>
            <p v-if="scope.row.refundStatus=='307'">已报废</p>
            <p v-if="scope.row.refundStatus=='308'">已存放</p>
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="100" align="center"></el-table-column>
        <el-table-column prop="refundOrderNo" label="退货单号"  width="100" align="center"></el-table-column>
        <el-table-column label="商品信息" width="300" align="center">
          <template slot-scope="scope">
            <div style="display:flex;margin:5px 0px 5px 3px;">
              <div style="flex:1;width:50px;height:auto;">
                <img :src="scope.row.url" alt="图片加载失败" style="width:100%;height:90%;">
              </div>
              <div style="flex:3;text-align:left;margin-left:8px;">
                <p>
                  <span style="color:#99a9bf;">名称：</span>
                  {{scope.row.productDetails.productName}}
                </p>
                <p>
                  <span style="color:#99a9bf;">规格:</span>
                  {{scope.row.productDetails.specification}}
                </p>
                <p>
                  <span style="color:#99a9bf;">SKU码：</span>
                  <router-link
                    style="color:blue;"
                    :to="'goodDetail?sku='+scope.row.productDetails.skuCode"
                  >{{scope.row.productDetails.skuCode}}</router-link>
                </p>
                <p>
                  <span>
                    <span style="color:#99a9bf;">供货价：</span>
                    {{scope.row.productDetails.supplyPrice}}
                  </span>
                  &nbsp;&nbsp;
                  <!-- <span style="color:#99a9bf;">数量：</span>
                  {{scope.row.productDetails.productQuantity}} -->
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="退货详情" align="center">
          <template slot-scope="scope">
            <div>
              退货原因：
              <br>
              <div v-if="scope.row.refundDetails.refundReason=='1301'">质量问题</div>
              <div v-if="scope.row.refundDetails.refundReason=='1302'">产品与说明书不一样</div>
              <div v-if="scope.row.refundDetails.refundReason=='1303'">产品损坏</div>
              <div v-if="scope.row.refundDetails.refundReason=='1304'">缺少配件</div>
              <div v-if="scope.row.refundDetails.refundReason=='1305'">大小、颜色、模型等是不合适</div>
              <div v-if="scope.row.refundDetails.refundReason=='1306'">我只是不想要</div>
              <div v-if="scope.row.refundDetails.refundReason=='1307'">产品价格下降</div>
              <div v-if="scope.row.refundDetails.refundReason=='1308'">错误的产品</div>
              <div v-if="scope.row.refundDetails.refundReason=='1309'">其它原因</div>
              <div>
                分摊运费：
                <br>
                {{scope.row.refundDetails.carriage}}
              </div>
              <div v-if="scope.row.refundDetails.remark">
                备注
                <br>
                {{scope.row.refundDetails.remark}}
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="warehouseName" label="发货仓库" align="center" width="80"></el-table-column> -->
        <el-table-column prop="productQuantity" label="总数量" width="80" align="center"></el-table-column>
        <el-table-column label="金额" align="center" prop="amount"></el-table-column>

        <el-table-column prop="refundTime" label="时间" align="center" sortable="custom"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.refundStatus=='305'&& (scope.row.refundDetails.refundReason=='1301'||scope.row.refundDetails.refundReason=='1302'||scope.row.refundDetails.refundReason=='1303'||scope.row.refundDetails.refundReason=='1304'||scope.row.refundDetails.refundReason=='1309')"
              size="mini"
              @click="outOfStockDialogUp=true,updateRefundStatus($event,scope.row.refundOrderNo,0)"

              type="primary"
            >报废</el-button>
            <el-button
              v-if="scope.row.refundStatus=='305'&& (scope.row.refundDetails.refundReason=='1305'||scope.row.refundDetails.refundReason=='1306'||scope.row.refundDetails.refundReason=='1307'||scope.row.refundDetails.refundReason=='1308'||scope.row.refundDetails.refundReason=='1309')"
              size="mini"
              @click="outOfStockDialogUp=true,updateRefundStatus($event,scope.row.refundOrderNo,1)"
              type="primary"
            >存放仓库</el-button>
            <div v-if="scope.row.refundStatus!=='305'">--</div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog width="30%" title="新的商品供货码:" :visible.sync="dialogFormVisible">
        <el-input v-model="newBarCode" autocomplete="off" id="newinp"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onCancel(),dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="onOk(),dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="outOfStockDialogUp" title="提示">
        <span>你确定报废此商品吗？</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="outOfStockDialogUp = false">取 消</el-button>
          <el-button type="primary" @click="outOfStock(),outOfStockDialogUp = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import {
  updateBarCode,
  selectedOrderValide,
  getOrderGoodList,
  outOfStock,
  getRefundOrderList,
  exportRefundExcel,
  updateRefundStatus
} from "@/api/getData";
import { baseUrl } from "../config/env";
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";

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
      currefundOrderNo:'',
      curstatus:'',
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
      storeValue: "", //发货仓库
      orderStatus: "", //订单状态
      radio3: "全部",
      outOfStockDialogUp: false, //缺货的对话框
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
          value: "orderNo",
          label: "订单号"
        },
        {
          value: "skuCode",
          label: "SKU号"
        },
        {
          value: "productName",
          label: "商品名称"
        },
        {
          value: "expressNo",
          label: "物流单号"
        },
        {
          value: "refundOrderNo",
          label: "退货单"
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
      skuCode: "",
      barCode: "",
      productName: "",
      expressNo: "",
      refundOrderNo: "",
      refundStatus: "",
      refundReason: "",
      newBarCode: "",
      nowCode: "",
      multipleSelection: [], //多选
      transOrderList: [], //勾选的订单号
      skuCodeList: [], //勾选的商品
      loading: true,
      timeRange: "0", //判断筛选时间类型 0全部 1...
      goodList: [],
      loading: true
    };
  },
  components: {
    headTop
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
    async exportExcel() {
      var url = `${baseUrl}/refundOrder/exportRefundExcel?token=${
        this.$store.state.token
      }&orderBy=${this.orderBy}&orderWay=${this.orderWay}&orderNo=${
        this.orderNo
      }&skuCode=${this.skuCode}&expressNo=${this.expressNo}&productName=${
        this.productName
      }&refundOrderNo=${this.refundOrderNo}&refundStatus=${
        this.refundStatus
      }&startDate=${this.startDate}&endDate=${this.endDate}&currentPage=${
        this.currentPage
      }`;
      window.location.href = url;
    },
    sortChange(column, prop, order) {
      console.log('排序：',column,prop,order)
      if (column.prop) {
        this.orderBy = column.prop;
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
        case "orderNo":
          this.orderNo = this.inputValue;
          break;
        case "skuCode":
          this.skuCode = this.inputValue;
          break;
        case "expressNo":
          this.expressNo = this.inputValue;
          break;
        case "productName":
          this.productName = this.inputValue;
          break;
        case "refundOrderNo":
          this.refundOrderNo = this.inputValue;
          break;
        default:
          break;
      }
      this.loading = true;
      const orderList = await getRefundOrderList({
        token: this.$store.state.token,
        orderBy: this.orderBy,
        orderWay: this.orderWay,
        orderNo: this.orderNo,
        skuCode: this.skuCode,
        expressNo: this.expressNo,
        productName: this.productName,
        refundOrderNo: this.refundOrderNo,
        refundStatus: this.refundStatus,
        refundReason: this.refundReason,
        startDate: this.startDate,
        endDate: this.endDate,
        currentPage: this.currentPage
      });

      if (orderList) {
        this.loading = false;
        var reslut = orderList.result.page;
        this.orderList = reslut.resultList;
        this.totalCount = reslut.totalCount;
      }
    },
    timeChange(e) {
      var time = this.time;
      if (time == "" || time == null) {
        this.startDate = "";
        this.endDate = "";
      } else {
        this.startDate = this.moment(time[0]).format("YYYY-MM-DD HH:mm:ss");
        this.endDate = this.moment(time[1]).format("YYYY-MM-DD HH:mm:ss");
      }
      this.initData();
    },
    refresh() {
      this.initData();
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
      }
      this.initData();
    },
    changePage(e) {
      this.currentPage = e;
      this.initData();
    },
    async onOk() {
      const res = await updateBarCode({
        token: this.$store.state.token,
        skuCode: this.nowCode,
        newBarCode: this.newBarCode
      });

      if (res && res.code == "0") {
        this.initData();
        this.$message({
          message: "修改成功！",
          type: "success"
        });
      } else {
        this.$message({
          message: res.message,
          type: "error"
        });
      }
    },
    onCancel() {
      this.initData();
      this.$message({
        message: "已取消！",
        type: "success"
      });
    },
    handleSelectionChange(val) {
      this.transOrderList = [];
      this.multipleSelection = val;
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach(ele => {
          this.transOrderList.push(ele.orderNo);
        });
      }
    },

    handleCurrentChange(val) {
      // 选中行高亮
      this.currentRow = val;
    },
    setCurrent(row) {
      // 取消高亮
      this.$refs.singleTable.setCurrentRow(row);
    },

    // updateRefundStatus  进行报废或是存放仓库
    updateRefundStatus(e, orderNoForQuehuo,n) {
      this.currefundOrderNo=orderNoForQuehuo;
      this.curstatus=n;
    },
    //
    handleSelectionChangeForGoodList(val) {
      this.skuCodeList = [];
      this.multipleSelectionForGoodList = val;
      if (this.multipleSelectionForGoodList.length > 0) {
        this.multipleSelectionForGoodList.forEach(ele => {
          this.skuCodeList.push(ele.skuCode);
        });
      }
    },
    async outOfStock() {
        const orderGoodList = await updateRefundStatus({
        token: this.$store.state.token,
        refundOrderNo: this.currefundOrderNo,
        status:this.curstatus
      });
      // this.orderNoForQuehuo = orderNoForQuehuo;
      console.log("orderGoodList=", orderGoodList);
      if(orderGoodList){
        if(orderGoodList.code=="0"){
            this.$message.success(orderGoodList.message)
        }else if(orderGoodList.code=="1"){
             this.$message.error(orderGoodList.message)
        }
      }else{
        this.$message.error('系统异常');
      }

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
</style>
