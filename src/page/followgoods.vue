<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="container" style="background:#fff;margin:10px 20px;">
      <div style="margin-top: 10px;">
        <el-input placeholder="请输入内容" v-model="inputValue" class="input-with-select">
          <el-select v-model="selectValue" slot="prepend">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in selStyle"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="initData"></el-button>
        </el-input>
      </div>
      <div class="our">
        <div style="margin-top: 10px">
          <span class="s-tit">商品热销类型：</span>
          <el-radio-group v-model="salesType" class="tol" @change="refresh($event)" size="mini">
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="0">潜力爆款</el-radio-button>
            <el-radio-button label="1">稀缺</el-radio-button>
            <el-radio-button label="2">热销爆款</el-radio-button>
          </el-radio-group>
        </div>
        <div style="margin-top: 10px">
          <span class="s-tit">商品类别：</span>
          <el-cascader
            expand-trigger="hover"
            :options="cateOptions"
            v-model="selectedCate"
            @change="handleChange"
            size="mini"
          ></el-cascader>
        </div>
      </div>
      <!-- <div class="our">
        <div style="margin-top: 10px">
          <span class="s-tit">投标状态：</span>
          <el-radio-group v-model="status" class="tol" @change="refresh($event)" size="mini">
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="1">供货中</el-radio-button>
            <el-radio-button label="3">未供货</el-radio-button>
          </el-radio-group>
        </div>
      </div>-->
    </div>
    <div style="margin:0 20px;">
      <div style="background:#fff;padding:20px;">
        <span class="btn">
          <span>没有找到可以供货的商品？您还可以上传商品：</span>
          <el-button type="primary" @click="toAddGood()" size="mini" plain>添加商品</el-button>
        </span>
        <el-pagination
          :page-size="10"
          layout="total,prev, pager, next, jumper"
          style="float:right"
          @current-change="changePage($event)"
          :current-page="currentPage"
          background
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
    <div class="container">
      <div style="text-align:left;">
        <el-table
          ref="multipleTable"
          border
          :data="productList"
          element-loading-text="拼命加载中"
          @sort-change="sortChange"
          v-loading="loading"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          empty-text="暂无数据"
        >
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column label="SPU" align="center" prop="spuCode"></el-table-column>
          <el-table-column label="商品名称" align="center" prop="name"></el-table-column>
          <el-table-column label="图片" align="center">
            <template slot-scope="scope">
              <div>
                <img :src="scope.row.spuMainImage" style="height:100px;" alt>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品类型" align="center" prop="salesType"></el-table-column>
          <el-table-column label="供货状态" align="center" prop="statusStr"></el-table-column>
          <el-table-column label="过去七天需求量" align="center" prop="salesVolume"></el-table-column>
          <el-table-column label="供货均价（元）" align="center" prop="price"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="toOrderList(scope.$index, scope.row)"
                style="display:block;margin:10px auto;"
              >商品详情</el-button>
              <el-button
                size="mini"
                x
                type="primary"
                @click="dialogTableVisible=true,getBidSkuData(scope.$index, scope.row)"
                style="display:block;margin:10px auto;"
              >&nbsp;供&nbsp;&nbsp;&nbsp;&nbsp;货&nbsp;</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog title="投标商品" :visible.sync="dialogTableVisible">
      <span class="s-tit">统一价格（元）：</span>
      <div class="set-form">
        <el-input v-model="input" placeholder="请输入价格"></el-input>
        <i class="set-btn blue el-icon-check" @click="setBatch"></i>
        <i class="set-btn red el-icon-close" @click="cancelBatch"></i>
      </div>
      <span class="s-tit">价格应为大于0的数字，最多可保留小数点后两位</span>
      <el-table
        ref="multipleTable"
        :data="skusList"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChangeForGoodList"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column property="skuCode" label="SKU码" width="130"></el-table-column>
        <el-table-column property="optName" label="规格" width="100"></el-table-column>
        <!-- <el-table-column label="是否上架" width="50">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.ifStatus"></el-checkbox>
          </template>
        </el-table-column>-->
        <el-table-column label="自有库存">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.selfStock"
              controls-position="right"
              @blur="handleFocus(scope.row.selfStock)"
              style="width:100px;"
              size="mini"
              :min="1"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="供货价">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.supplyPrice"
              controls-position="right"
              style="width:100px;"
              size="mini"
              :min="1"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="供货码">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.barCode"
              controls-position="right"
              style="max-width: 250px;"
              size="mini"
              :min="1"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="bidGoods()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
import {
  getCategory,
  bidProduceList,
  askProduceSkuList,
  bidGoods
} from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
import { error } from "util";
export default {
  data() {
    return {
      cateOptions: [],
      selectedCate: [],
      productList: [],
      skuCodeList: [], //勾选的sku
      status: "", //投标状态标识
      input: "",
      currentType: "", // 要批量设置的类型
      dialogSpu: "",
      salesType: "",
      inputValue: "",
      selectValue: "",
      selStyle: [
        {
          value: "name",
          label: "商品名称"
        },
        {
          value: "spuCode",
          label: "SPU号"
        },
        {
          value: "skuCode",
          label: "SKU号"
        },
        {
          value: "barCode",
          label: "供货码"
        }
      ],
      ruleForm: {
        category1Id: "",
        category2Id: ""
      },
      currentPage: 1, //当前页数
      orderWay: "", //排序方式,
      orderBy: "", //排序高低倒序还是正序
      loading: true,
      totalCount: 100,
      dialogTableVisible: false,
      skusList: [
        {
          skuCode: "",
          optName: "",
          status: "",
          selfStock: "",
          supplyPrice: "",
          barCode: ""
          /*  distinct: "",
          ifStatus: "" */
        }
      ],
      formLabelWidth: "120px"
    };
  },
  components: {
    headTop
  },
  created() {
    console.log("query", this.$route.query);
  },
  watch: {
    $route: {
      handler(val, oldval) {
        console.log("query", this.$route.query);

      },
      deep: true
    }
  },
  mounted() {
    this.firinitData()
  },
  methods: {
    refresh() {
      this.initData();
    },
    async firinitData() {
      this.name = this.$route.query.name;
      switch (this.selectValue) {
        case "spuCode":
          this.spuCode = this.inputValue;
          break;
        case "skuCode":
          this.skuCode = this.inputValue;
          break;
        case "barCode":
          this.barCode = this.inputValue;
          break;
        case "name":
          this.name = this.inputValue;
          break;
        default:
          break;
      }
      this.loading = true;
      //商品分类
      const category = await getCategory({ token: this.$store.state.token });
      this.cateOptions = category.simpleJsonResult.result.data;
      console.log("this.selectedCate", this.selectedCate);
      //获取spu列表数据
      const orderList = await bidProduceList({
        token: this.$store.state.token,
        name: this.name,
        barCode: this.barCode,
        skuCode: this.skuCode,
        spuCode: this.spuCode,
        status: this.status,
        salesType: this.salesType,
        category1Id: this.ruleForm.category1Id,
        category2Id: this.ruleForm.category2Id,
        currentPage: this.currentPage
      });
      if (orderList) {
        console.log("输出结果", orderList);
        this.loading = false;
        var reslut = orderList.result.page;
        this.productList = reslut.resultList;
        this.totalCount = reslut.totalCount;
      }
    },
    async initData() {
      this.spuCode = this.skuCode = this.barCode = this.name = "";
      switch (this.selectValue) {
        case "spuCode":
          this.spuCode = this.inputValue;
          break;
        case "skuCode":
          this.skuCode = this.inputValue;
          break;
        case "barCode":
          this.barCode = this.inputValue;
          break;
        case "name":
          this.name = this.inputValue;
          break;
        default:
          break;
      }
      this.loading = true;
      //商品分类
      const category = await getCategory({ token: this.$store.state.token });
      this.cateOptions = category.simpleJsonResult.result.data;
      console.log("this.selectedCate", this.selectedCate);
      //获取spu列表数据
      const orderList = await bidProduceList({
        token: this.$store.state.token,
        name: this.name,
        barCode: this.barCode,
        skuCode: this.skuCode,
        spuCode: this.spuCode,
        status: this.status,
        salesType: this.salesType,
        category1Id: this.ruleForm.category1Id,
        category2Id: this.ruleForm.category2Id,
        currentPage: this.currentPage
      });
      if (orderList) {
        console.log("输出结果", orderList);
        this.loading = false;
        var reslut = orderList.result.page;
        this.productList = reslut.resultList;
        this.totalCount = reslut.totalCount;
      }
    },
    handleFocus(value) {
      if (!isNaN(value) && value % 1 === 0) {
        return;
      } else {
        this.$message.error("请输入整数！");
      }
    },
    async handleChange(value) {
      this.ruleForm.category1Id = value[0];
      this.ruleForm.category2Id = value[1];
      const orderList = await bidProduceList({
        token: this.$store.state.token,
        name: this.name,
        barCode: this.barCode,
        skuCode: this.skuCode,
        spuCode: this.spuCode,
        status: this.status,
        salesType: this.salesType,
        category1Id: this.ruleForm.category1Id,
        category2Id: this.ruleForm.category2Id,
        currentPage: this.currentPage
      });
      if (orderList) {
        console.log("xzss", orderList);
        this.loading = false;
        var reslut = orderList.result.page;
        this.productList = reslut.resultList;
        this.totalCount = reslut.totalCount;
      }
    },
    toAddGood() {
      //跳转至添加商品
      this.$router.push("/newgoods");
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    sortChange(column, prop, order) {
      console.log("column-->", column, "prop->", prop, "order", order);
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
    toOrderList(n1, n2) {
      console.log("n1n2", n1, n2);
      var spuCode = n2.spuCode;
      this.$router.push({
        path: "/bidProductDetail",
        query: { spuCode: spuCode }
      });
    },
    changePage(e) {
      this.currentPage = e;
      this.initData();
    },
    async getBidSkuData(n1, n2) {
      console.log("n1n2", n1, n2);
      var spuCode = n2.spuCode;
      token: this.$store.state.token;
      const asklist = await askProduceSkuList({
        token: this.$store.state.token,
        spuCode: spuCode
      });
      if (asklist) {
        console.log("asklist", asklist);
        this.dialogSpu = asklist.result.spuList[0].spuCode;
        this.skusList = asklist.result.spuList[0].skus;
        console.log("skus", this.skusList);
        /*  for(let i in this.skusList){
          if(this.skusList[i].status===1){
            this.skusList[i].ifStatus = true;
          }else{
            this.skusList[i].ifStatus = false;
          }
        } */
      }
    },
    handleSelectionChangeForGoodList(val) {
      this.skuCodeList = [];
      var json = {};
      this.multipleSelectionForGoodList = val;
      if (this.multipleSelectionForGoodList.length > 0) {
        this.multipleSelectionForGoodList.forEach(ele => {
          var skuCode = ele.skuCode;
          var selfStock = ele.selfStock;
          var supplyPrice = ele.supplyPrice;
          var barCode = ele.barCode;
          var status = 1;
          /*  var flag = ele.ifStatus;
          if (flag == true) {
            var status = 1;
          } else {
            var status = 3;
          } */
          json = { skuCode, selfStock, supplyPrice, barCode, status };
          console.log("json", json);
          this.skuCodeList.push(json);
        });
      }
    },
    async bidGoods() {
      if (!this.multipleSelectionForGoodList) {
        this.$message({
          message: "请勾选需要供货的SKU商品！",
          type: "error"
        });
        return;
      }
      this.handleSelectionChangeForGoodList(this.multipleSelectionForGoodList);
      var skuCodeStr = JSON.stringify(this.skuCodeList);
      console.log("skuCodeStr", skuCodeStr);
      console.log("spuCode", this.dialogSpu);
      this.dialogTableVisible = false;
      const res = await bidGoods({
        token: this.$store.state.token,
        spuCode: this.dialogSpu,
        list: skuCodeStr
      });
      console.log("供货返回结果:", res);
      if (res.code == "0") {
        this.initData();
        this.input = "";
        this.$message({
          message: "操作成功！",
          type: "success"
        });
      } else {
        this.initData();
        this.$message({
          message: res.message,
          type: "error"
        });
      }
    },
    // 批量设置
    setBatch() {
      console.log("this.input:", this.input);
      //验证数字
      if (this.input) {
        this.input.match(/^\d*(\.?\d{0,1})/g)[0] || null;
      }
      this.skusList.forEach(item => {
        if (item.supplyPrice) {
          item.supplyPrice = this.input;
        }
      });
    },
    // 取消批量设置
    cancelBatch() {
      this.input = "";
      this.isSetListShow = true;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.fillcontain {
  height: auto;
}
.input-with-select .el-input-group__prepend {
  width: 25%;
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
.container {
  padding: 10px 20px;
  & > div {
    .el-input-group {
      width: 700px;
      margin-left: 150px;
      .el-select {
        width: 100%;
      }
    }
  }
  .btn {
    display: inline-block;
    position: relative;
    .hint {
      padding: 10px;
      width: 200px;
      height: 100px;
      background-color: #fff;
      border-radius: 5px;
      position: absolute;
      top: 50px;
      font-size: 14px;
      z-index: 999;
      border: 1px solid skyblue;
    }
  }
}
.button_submit {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.el-table .info-row {
  background: #c9e5f5;
}

.el-table .positive-row {
  background: #e2f0e4;
}
.hide {
  display: none;
}
.set-form {
  display: inline-block;
  margin-left: 10px;
  .el-input {
    display: inline-block;
    width: 120px;
  }
  .set-btn {
    display: inline-block;
    padding: 0 2px;
    font-size: 15px;
    cursor: pointer;
    &.blue {
      color: #0088ee;
    }
    &.red {
      color: #cc0000;
    }
  }
}
</style>
