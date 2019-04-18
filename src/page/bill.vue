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
          <span class="s-tit">账单时间范围：</span>
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
          <span class="s-tit">账单状态：</span>
          <el-radio-group v-model="billStatus" class="tol" @change="refresh($event)" size="mini">
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="1">已结算</el-radio-button>
            <el-radio-button label="0">待结算</el-radio-button>
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
        v-loading="false"
        :header-cell-style="{background:'#fafafa',color:'#606266'}"
      >
        <el-table-column width="50" align="center" type="index"></el-table-column>
        <el-table-column prop="billStatusStr" label="账单状态"  align="center" width="120"></el-table-column>
        <el-table-column prop="billNo" label="账单号"  align="center" width="180"></el-table-column>

        <el-table-column prop="createDateStr" label="账单生成时间"  align="center"></el-table-column>
        <el-table-column prop="productTotalAmount" label="商品金额（元）"  align="center" ></el-table-column>
        <el-table-column
          label="账单总金额"
          align="center"
          width="150"
          prop="billTotalAmount"
        ></el-table-column>

        <el-table-column label="操作" align="center" >
          <template slot-scope="scope">
            <a v-if="scope.row.billStatus==1 && scope.row.billVoucher != '' && scope.row.billVoucher != null"
                style="color:blue;"
                :href="scope.row.billVoucher"
              >查看凭证</a>
              &nbsp; &nbsp;
                <router-link
                style="color:blue;"
                :to="'billDetail?billNo='+scope.row.billNo"
              >账单详情</router-link>

          </template>

        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import {
  billList,
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
      orderList:[], // 获取row的key值
      // 要展开的行，数值的元素是row的key值
      currentRow: null,
      billStatus: "", //状态
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
          value: "billNo",
          label: "账单号"
        },
        {
          value: "orderNo",
          label: "订单号"
        }
      ],
      inputValue: "",
      selectValue: "",
      currentPage: 1, //当前页数
      pageSize: 10,
      totalCount: 100,
      orderWay: "", //排序方式,
      orderBy: "", //排序高低倒序还是正序
      orderNo: "",
      billNo: "",
      loading: true,
      timeRange: "0" //判断筛选时间类型 0全部 1...
    };
  },
  components: {
    headTop
  },
  created() {
    if(this.$route.query.t){// t是从首页跳过来带的参数
      if(this.$route.query.t == 'total_wait'){// 全部待结算
        this.billStatus = 0;
      }else if(this.$route.query.t == 'this_month'){// 本月已结算
        this.billStatus = 1;
      }else if(this.$route.query.t == 'total_amount'){// 全部已结算
        this.billStatus = 1;
      }
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
    $route: {
      handler(val, oldval) {
        if(this.$route.query.t){// t是从首页跳过来带的参数
          if(this.$route.query.t == 'total_wait'){// 全部待结算
            this.billStatus = 0;
          }else if(this.$route.query.t == 'this_month'){// 本月已结算
            this.billStatus = 1;
          }else if(this.$route.query.t == 'total_amount'){// 全部已结算
            this.billStatus = 1;
          }
        }
      },
      deep: true
    }
  },
  methods: {
    exportExcel(){
        var url = `${baseUrl}/bill/exportBillOrderExcel?token=${
        this.$store.state.token
      }&orderBy=${this.orderBy}&orderWay=${this.orderWay}&orderNo=${this.orderNo}&billStatus=${this.billStatus}&billNo=${this.billNo}&startDate=${
        this.startDate
      }&endDate=${this.endDate}&currentPage=${this.currentPage}`;
      window.location.href = url;
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
      this.orderNo = this.billNo ="";
      switch (this.selectValue) {
        case "orderNo":
          this.orderNo = this.inputValue;
          break;
        case "billNo":
          this.billNo = this.inputValue;
          break;
        default:
          break;
      }
      this.loading =true;
      const orderList = await billList({
        token: this.$store.state.token,
        orderBy: this.orderBy,
        orderWay: this.orderWay,
        orderNo: this.orderNo,
        billStatus: this.billStatus,
        billNo: this.billNo,
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
      this.currentPage = e;
      this.initData();
    },

    handleCurrentChange(val) {// 选中行高亮
      this.currentRow = val;
    },
    setCurrent(row) {// 取消高亮
      this.$refs.singleTable.setCurrentRow(row);
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

</style>
