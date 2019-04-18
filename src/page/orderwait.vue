<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="container" style="background:#fff;margin:10px 20px;">
      <div style="margin-top: 10px;">

        <el-input
          placeholder="请输入内容"
          v-model="inputValue"
          class="input-with-select"
        >
          <el-select
            v-model="selectValue"
            slot="prepend"
            style="color:#666!important;"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in selStyle"
              :key="item.value"
              style="color:#666!important;"
            ></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="initData" ></el-button>
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
          <span class="s-tit">订单状态：</span>
          <el-radio-group v-model="orderStatus" class="tol" @change="refresh($event)" size="mini">
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="102">待发货</el-radio-button>
            <el-radio-button label="103">运输中</el-radio-button>
            <el-radio-button label="104">已签收</el-radio-button>
            <el-radio-button label="202">已取消</el-radio-button>
          </el-radio-group>
        </div>
        <div style="margin-top: 10px;margin-left:20px;">
          <span class="s-tit">发货仓库：</span>
          <el-radio-group v-model="storeValue" class="tol" @change="refresh($event)" size="mini">
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="0">供应商发货</el-radio-button>
            <el-radio-button label="2">国外仓</el-radio-button>
            <el-radio-button label="1">国内仓</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div style="margin:0 20px;margin-bottom:-10px;">
      <div style="background:#fff;padding:20px;">
        <el-button size="mini" @click="goSendout()" type="primary" plain>发货</el-button>
        <el-button size="mini" type="primary" plain @click="exportExcel()">导出数据</el-button>
        <el-button style="display:none;" size="mini" type="primary" plain>打印拣货单</el-button>
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
        empty-text="暂无数据"
      >
        <el-table-column width="50" align="center" type="index"></el-table-column>
        <el-table-column type="selection" align="center"></el-table-column>

        <el-table-column prop="orderNo" label="订单号"  align="center"></el-table-column>
        <el-table-column prop="orderStatusStr" label="订单状态" align="center" ></el-table-column>
        <el-table-column label="商品信息" width="350"  align="center" >
          <template slot-scope="scope">
            <div  class="dashed" style="display:flex;padding:5px 0px 5px 3px;" v-for="(item,index) in scope.row.detailList" :key="index">
              <div style="flex:1;">
                <img :src="item.productMainImage" alt="图片加载失败" style="width:100%;height:90%;">
              </div>
              <div style="flex:3;text-align:left;margin-left:8px;">
                <p><span style="color:#99a9bf;">名称：</span>{{item.productName}}</p>
                <p><span style="color:#99a9bf;">SKU码：</span><router-link style="color:blue;" :to="'goodDetail?sku='+item.skuCode">{{item.skuCode}}</router-link></p>
                <p>
                  <span><span style="color:#99a9bf;">供货码：</span>{{item.barCode}}</span>&nbsp;&nbsp;
                </p>
                <p>
                  <span><span style="color:#99a9bf;">供货价：</span>{{item.supplyPrice}}</span>
                  &nbsp;&nbsp;<span style="color:#99a9bf;">数量：</span>{{item.productQuantity}}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="warehouseName" label="发货仓库" align="center" ></el-table-column>
        <el-table-column prop="productQuantity" label="总数量" align="center" ></el-table-column>
        <el-table-column
          label="总金额"
          align="center"
          sortable="custom"
          width="100"
          prop="totalAmount"
        ></el-table-column>
        <el-table-column prop="createDate" label="时间" align="center" sortable="custom" width="180">
          <template slot-scope="scope">
            <p>
              <span style="color:#99a9bf;">下单时间：</span>
              <br>
              {{scope.row.timeInfo.createDateStr}}
            </p>
            <p v-if="scope.row.warehouseType=='0' && scope.row.orderStatus=='102'">
              <span style="color:#99a9bf;">发货截止时间：</span>
              <br>
              <span style="color:red">{{scope.row.timeInfo.deliveryDeadlineStr}}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.warehouseType=='0' && scope.row.orderStatus=='102'"
              size="mini"
              @click="outOfStockDialogUp=true,outOfStockGetOrderGoodList($event,scope.row.orderNo)"
              type="primary"
            >缺货</el-button>
            <div v-else style="text-align:center">--</div>
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

      <el-dialog :visible.sync="outOfStockDialogUp" title="请勾选缺货商品，确定后将取消订单、并下架缺货的商品！">


          <el-table
            ref="multipleTable"
            :data="goodList"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChangeForGoodList">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="商品名称"
               prop="productName">
            </el-table-column>
            <el-table-column
              label="sku编号"
             prop="skuCode">
            </el-table-column>
          </el-table>


        <div slot="footer" class="dialog-footer">
          <el-button @click="outOfStockDialogUp = false">取 消</el-button>
          <el-button type="primary" @click="outOfStock()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import {
  getOrderList,
  updateBarCode,
  selectedOrderValide,
  getOrderGoodList,
  outOfStock
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
          value: "barCode",
          label: "供货码"
        },
        {
          value: "productName",
          label: "商品名称"
        }
      ],
      inputValue: "",
      selectValue: "",
      currentPage: 1, //当前页数
      pageSize: 10,
      totalCount: 100,
      orderWay: "", //排序方式,
      orderBy: "", //排序高低倒序还是正序
      orderNoForQuehuo: "",//用于缺货的订单号
      orderNo: "",
      skuCode: "",
      skuCode: "",
      barCode: "",
      productName: "",
      newBarCode: "",
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
  mounted() {
    this.initData();
  },
  computed: {
    getToken() {
      return this.$store.state.token;
    }
  },
  watch: {
    $route: "getparams"
  },
  methods: {
    exportExcel(){
        var url = `${baseUrl}/order/exportOrderExcel?token=${
        this.$store.state.token
      }&orderBy=${this.orderBy}&orderWay=${this.orderWay}&orderNo=${this.orderNo}
        &skuCode=${this.skuCode}&barCode=${
        this.barCode
      }&productName=${this.productName}&startDate=${
        this.startDate
      }&endDate=${this.endDate}&currentPage=${this.currentPage}`;
      window.location.href = url;
    },
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
      this.orderNo = this.skuCode =this.barCode =this.productName ="";
      switch (this.selectValue) {
        case "orderNo":
          this.orderNo = this.inputValue;
          break;
        case "skuCode":
          this.skuCode = this.inputValue;
          break;
        case "barCode":
          this.barCode = this.inputValue;
          break;
        case "productName":
          this.productName = this.inputValue;
          break;
        default:
          break;
      }
      this.loading =true;
      const orderList = await getOrderList({
        token: this.$store.state.token,
        orderBy: this.orderBy,
        orderWay: this.orderWay,
        orderNo: this.orderNo,
        skuCode: this.skuCode,
        barCode: this.barCode,
        productName: this.productName,
        orderStatus: this.orderStatus,
        warehouseType: this.storeValue,
        startDate: this.startDate,
        endDate: this.endDate,
        currentPage: this.currentPage
      });

      if (orderList) {
        console.log("orderList=", orderList);
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
    async goSendout() {

      if(!this.transOrderList){
        this.$message.error('请选择自发货订单！');
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
        this.$router.push({path:"/sendout",query:{orderNos:list}});
      } else if (res.code == "1") {
        this.$message({
          message:res.message,
          type: "error"
        });
      }
    },
    handleSelectionChange(val) {
      this.transOrderList=[];
      this.multipleSelection = val;
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach(ele => {
          this.transOrderList.push(ele.orderNo);
        });
      }
    },

    handleCurrentChange(val) {// 选中行高亮
      this.currentRow = val;
    },
    setCurrent(row) {// 取消高亮
      this.$refs.singleTable.setCurrentRow(row);
    },

    // 获取订单下的商品
    async outOfStockGetOrderGoodList(e, orderNoForQuehuo) {
      const orderGoodList = await getOrderGoodList({
        token: this.$store.state.token,
        orderNo: orderNoForQuehuo
      });
      this.orderNoForQuehuo = orderNoForQuehuo;
      console.log("orderGoodList=", orderGoodList);
      this.goodList = orderGoodList.result.list;
    },
    //
    handleSelectionChangeForGoodList(val) {
       this.skuCodeList=[];
       this.multipleSelectionForGoodList = val;
       if (this.multipleSelectionForGoodList.length > 0) {
        this.multipleSelectionForGoodList.forEach(ele => {
        this.skuCodeList.push(ele.skuCode);
      });

      }

    },
    async outOfStock() {

      var skuCodeStr = this.skuCodeList.join(",");
      console.log(skuCodeStr);

      if (!skuCodeStr) {
        this.$message({
          message: "请勾选商品！",
          type: "error"
        });
        return;
      }

      this.outOfStockDialogUp = false;
      const res = await outOfStock({
        token: this.$store.state.token,
        orderNo: this.orderNoForQuehuo,
        skuCodes: skuCodeStr
      });
      console.log("缺货返回结果:"+res);
      if (res.code == "0") {
        this.initData();
        this.$message({
          message: "操作成功！",
          type: "success"
        });
      } else {
        this.$message({
          message: res.message,
          type: "error"
        });
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
  padding:10px 20px;
  & > div {
    // text-align: center;
    .el-input-group {
      width:700px;
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
.cell>.dashed:not(:first-child){
  border-top:1px dashed rgb(153, 169, 191);
}

</style>
