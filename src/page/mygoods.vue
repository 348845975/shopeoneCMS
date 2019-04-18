<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="container" style="background:#fff;margin:10px 20px;">
      <div style="margin-top: 10px;">
        <el-input placeholder="请输入内容" v-model="inputValue" class="input-with-select">
          <el-select v-model="selectValue" slot="prepend" placeholder="全部">
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
          <span class="s-tit">供货状态：</span>
          <el-radio-group v-model="status" class="tol" @change="refresh($event)" size="mini">
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="1">供货中</el-radio-button>
            <el-radio-button label="3">未供货</el-radio-button>
            <el-radio-button label="0">审核中</el-radio-button>
            <el-radio-button label="2">已拒绝</el-radio-button>
            <!-- <el-radio-button label="4">失效</el-radio-button> -->
          </el-radio-group>
        </div>
      </div>
      <div class="our">
        <div style="margin-top: 10px">
          <span class="s-tit">按仓库：</span>
          <el-radio-group v-model="type" class="tol" @change="refresh($event)" size="mini">
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="2">国内仓</el-radio-button>
            <el-radio-button label="3">海外仓</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div style="margin:0 20px;">
      <div style="background:#fff;padding:20px;">
        <span class="btn" style="display:none;" >
          <el-button type="primary" plain size="mini">打印供货码</el-button>
          <el-popover
            placement="bottom"
            title="标题"
            width="200"
            trigger="click"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
          >
            <i class="el-icon-question" slot="reference" style=" cursor:pointer"></i>
          </el-popover>
        </span>
        <span class="btn">
          <el-button type="primary" @click="createprepare()" size="mini" plain>生成备货单</el-button>
          <!-- <el-popover
            placement="bottom"
            title="标题"
            width="200"
            trigger="click"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
          >
            <i class="el-icon-question" slot="reference" style=" cursor:pointer"></i>
          </el-popover> -->

          <el-button type="primary" @click="toAddGood()" size="mini" plain>添加商品</el-button>
          <el-button type="danger" @click="isPitch()" size="mini" plain>删除商品</el-button>
          <el-button type="primary" @click="expor()" size="mini" plain>商品导出</el-button>
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
          :header-cell-style="{background:'#fafafa'}"
          empty-text="暂无数据"
        >
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column label="商品信息" align="center" width="400">
            <template slot-scope="scope">
              <div style="display:flex;align-items:center;">
                <div style="flex:5;width:100%;height:100%;vertical-align: middle;">
                  <img
                    :src="scope.row.imageUrl"
                    alt="图片加载失败"
                    style="width:100px;height:auto;vertical-align: middle;"
                  >
                </div>
                <div style="flex:5;text-align:left;">
                  <p>
                    <span class="p-span">商品名称：</span>
                    {{scope.row.name}}
                  </p>
                  <p>
                    <span class="p-span">商品SKU：</span>
                    {{scope.row.skuCode}}
                  </p>
                  <p>
                    <span class="p-span">商品规格:</span>

                    <span
                      v-for="(item,index) in scope.row.attrOptList"
                      :key="index"
                    >{{item.optName}}</span>
                  </p>
                  <p>
                    <span class="p-span">供货码:</span>
                    {{scope.row.barCode}}
                    <i
                      class="el-icon-edit-outline"
                      style="color:#4571da;cursor:pointer"
                      data-a="22"
                      @click="dialogFormVisible1 = true,edit($event,scope.row.skuMerId,scope.row.barCode) "
                    ></i>
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="updateDateStr" label="更新时间" align="center" sortable="custom"></el-table-column>
          <el-table-column prop="status" label="状态" align="center" width="100" sortable="custom">
            <template slot-scope="scope">
              <span v-if="scope.row.status=='0'">审核中</span>
              <span v-if="scope.row.status=='1'">供货中</span>
              <span v-if="scope.row.status=='2'">已拒绝</span>
              <span v-if="scope.row.status=='3'">未供货</span>
              <div style="color:red" v-if="scope.row.reason">{{scope.row.reason}}</div>
            </template>
          </el-table-column>
          <el-table-column label="库存" align="center" width="200">
            <template slot-scope="scope">
              <p>
                海外仓库存：
                <span style="color:blue">{{ scope.row.stock3}}</span>
                <el-popover placement="right" width="200" trigger="click">
                  <div :data="gridData">
                    <p
                      v-for="(item,index) in gridData"
                      :key="index"
                    >{{item.warehouseName}}:{{item.stock}}</p>
                  </div>

                  <i
                    class="el-icon-question"
                    slot="reference"
                    style=" cursor:pointer"
                    @click="getstockDetailList(scope.row.skuCode)"
                  ></i>
                </el-popover>
              </p>
              <p>
                国内仓库存：
                <span>{{ scope.row.stock2}}</span>
              </p>
              <p>
                供应商仓库存：
                <span>{{ scope.row.stock1}}</span>
                <i
                  class="el-icon-edit-outline"
                  style="color:#4571da; cursor:pointer"
                  data-a="22"
                  @click="dialogFormVisible3 = true,editStock(scope.row.stock1,scope.row.skuMerId,scope.row.skuCode) "
                ></i>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="avgSupplyPrice"
            label="商城供货均价"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column prop="supplyPrice" label="你的供货价" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              {{scope.row.supplyPrice}}
              <i
                class="el-icon-edit-outline"
                style="color:#4571da; cursor:pointer"
                data-a="22"
                @click="dialogFormVisible2 = true,editPrice($event,scope.row.skuMerId,scope.row.supplyPrice) "
              ></i>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="toOrderList(scope.$index, scope.row)"
                style="display:block;margin:10px auto;"
                v-if="scope.row.status != '2'"
              >销售记录</el-button>
              <el-button
                size="mini"
                x
                type="primary"
                @click="dialogUp1=true,updateUp(scope.row.skuCode)"
                style="display:block;margin:10px auto;"
                v-if="scope.row.status=='3'"
              >&nbsp;供&nbsp;&nbsp;&nbsp;&nbsp;货&nbsp;</el-button>
              <el-button
                size="mini"
                x
                type="primary"
                @click="toEditProduct(scope.$index, scope.row)"
                style="display:block;margin:10px auto;"
                v-if="scope.row.status=='2'"
              >&nbsp;编&nbsp;&nbsp;&nbsp;&nbsp;辑&nbsp;</el-button>
              <el-button
                size="mini"
                x
                type="primary"
                @click="dialogUp=true,updateDown(scope.$index, scope.row)"
                style="display:block;margin:10px auto;"
                v-if="scope.row.status=='1'"
              >取消供货</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleDetail(scope.$index, scope.row)"
                style="display:block;margin:10px auto;"
              >&nbsp;查&nbsp;&nbsp;&nbsp;&nbsp;看&nbsp;</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog width="30%" title="新的商品供货码:" :visible.sync="dialogFormVisible1">
      <el-input v-model="newBarCode" autocomplete="off" id="newinp"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel(),dialogFormVisible1 = false">关 闭</el-button>
        <el-button type="primary" @click="onOk(),dialogFormVisible1 = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="30%" title="新的商品供货价:" :visible.sync="dialogFormVisible2">
      <el-input v-model="supplyPrice" autocomplete="off" id="newinp"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel(),dialogFormVisible2 = false">关 闭</el-button>
        <el-button type="primary" @click="onPriceOk(),dialogFormVisible2 = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="30%" title="新的自有库存量:" :visible.sync="dialogFormVisible3">
      <el-input v-model="stock" autocomplete="off" id="newinp"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel(),dialogFormVisible3 = false">关 闭</el-button>
        <el-button type="primary" @click="onStockOk(),dialogFormVisible3 = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="填写供货信息" :visible.sync="dialogUp1">
      <p style="color:black;margin-bottom:10px;">已勾选的代表供货中的sku，未勾选代表该sku未供货！</p>
      <el-table
        ref="multipleTable1"
        :data="asklist"
        border
        tooltip-effect="dark"
        style="width: 100%"
        row-key="skuCode"
        @selection-change="handleSelectionChangeForSup">
      >
        <el-table-column type="selection" width="55" ></el-table-column>
        <el-table-column property="skuCode" label="SKU码" width="130"></el-table-column>
        <el-table-column label="自有库存">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.stock"
              controls-position="right"
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
              style="max-width: 150px;"
              size="mini"
              :min="1"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUp1 = false">关 闭</el-button>
        <el-button type="primary" @click="updatePutUp()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogUp" title="请选择：">
      <div>
        <el-radio-group v-model="putawayDown">
          <el-radio :label="1">仅此SKU取消供货</el-radio>
          <el-radio :label="2">整款取消供货</el-radio>
        </el-radio-group>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUp = false">关 闭</el-button>
        <el-button type="primary" @click="dialogUp = false,updatePutDown()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title :visible.sync="flag" width="30%">
      <span>是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="flag = false">关 闭</el-button>
        <el-button type="primary" @click="flag = false,handleDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
import {
  getProductList,
  updateSkuMerForBarCode,
  updateSkuMerForSupplyPrice,
  updateSkuMerForSelfStock,
  updateSkuMerForStatus,
  bidGoodsForSup,
  getStockDetailList,
  deleteSkuMerForStatus,
  exportProducts,
  askProductSkuListForSup
} from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
import { error } from "util";
export default {
  data() {
    return {
      putawayDown: "", //在选择下架时，是选择sku下架，还是整款下架
      selectValue: "",
      productList: [],
      multipleSelection: [],
      inputValue: "",
      selStyle: [
        {
          value: "skuCode",
          label: "SKU号"
        },
        {
          value: "barCode",
          label: "供货码"
        },
        {
          value: "name",
          label: "商品货号"
        }
      ],
      name: "", //商品名称：
      barCode: "", //供货码
      skuCode: "", //sku码
      status: "", //状态
      skuMerId1: "", //要更换前供货码对应的ID
      skuMerId2: "", //要更换前供货价对应的ID
      skuMerId3: "", //要更换前自有库存量对应的ID
      newBarCode: "", //要更换后的码
      stock: "", //要更换后库存量的码
      skuStockCode: "", //要更换库存量所对应的skucode
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogUp: false, //取消供货的对话框
      dialogUp1: false, //供货的对话框
      loading: true,
      supplyPrice: "", //修改后的供货价
      gridData: [], //库存详情
      currentPage: 1, //当前页数
      orderWay: "", //排序方式,
      orderBy: "", //排序高低倒序还是正序
      type: "", //2国内仓 3国外仓
      updateskuMerId: "",
      updateStatus: "", //供货状态
      reason: "", //理由
      flag: false,
      totalCount: 100,
      //asklist:[],
      skuCodeList: [], //勾选的商品
      asklist: [],
      multipleSelection: [],
    };
  },
  components: {
    headTop
  },
  created() {
    if(this.$route.query.s){
      this.status = this.$route.query.s;// s是状态条件
    }

  },
  mounted() {
    this.initData();
  },
  watch: {
    $route: {
      handler(val, oldval) {
        this.status = this.$route.query.s;
      },
      deep: true
    }
  },
  methods: {
    refresh() {
      this.initData();
    },
    async initData() {
      this.skuCode = this.barCode = this.name = "";
      switch (this.selectValue) {
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
      const orderList = await getProductList({
        token: this.$store.state.token,
        name: this.name,
        barCode: this.barCode,
        skuCode: this.skuCode,
        status: this.status,
        orderBy: this.orderBy,
        orderWay: this.orderWay,
        currentPage: this.currentPage,
        type: this.type
      });

      if (orderList) {
        console.log("xzss", orderList);
        this.loading = false;
        var reslut = orderList.result.page;
        this.productList = reslut.resultList;
        this.totalCount = reslut.totalCount;
      }
    },
    createprepare() {
      var skuCodeArr = [];
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请勾选商品",
          type: "error"
        });
        return;
      }
      for (var i in this.multipleSelection) {
        skuCodeArr.push(this.multipleSelection[i].skuCode);
      }
      this.$router.push({
        path: "/prepareOrder",
        query: { skuCode: skuCodeArr.toString() }
      });
    },
    async getstockDetailList(num) {
      var skuCode = num;
      const res = await getStockDetailList({
        token: this.$store.state.token,
        warehouseType: "2",
        skuCode: skuCode
      });
      if (res && res.code == "0") {
        this.gridData = res.result.page;
      }
    },
    
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDetail(n1, n2) {
      console.log("n1,n2", n1, n2);
      const sku = n2.skuCode;
      this.$router.push({ path: "/goodDetail", query: { sku: sku } });
    },
    edit(e, num1, num2) {
      console.log("new", e);
      this.skuMerId1 = num1;
      this.newBarCode = num2;
    },
    editPrice(e, num1, num2) {
      this.skuMerId2 = num1;
      this.supplyPrice = num2;
    },
    editStock(num, num1, num2) {
      console.log(num, num1, num2);
      this.stock = num;
      this.skuMerId3 = num1;
      this.skuStockCode = num2;
    },
    changePage(e) {
      this.currentPage = e;
      this.initData();
    },

    async onOk() {
      const res = await updateSkuMerForBarCode({
        token: this.$store.state.token,
        skuMerId: this.skuMerId1,
        barCode: this.newBarCode
      });

      if (res.code == "0") {
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
    async onPriceOk() {
      const res = await updateSkuMerForSupplyPrice({
        token: this.$store.state.token,
        skuMerId: this.skuMerId2,
        supplyPrice: this.supplyPrice
      });

      if (res.code == "0") {
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
    async onStockOk() {
      const res = await updateSkuMerForSelfStock({
        token: this.$store.state.token,
        skuMerId: this.skuMerId3,
        stock: this.stock,
        skuCode: this.skuStockCode
      });
      console.log("修改自有库存接口", res);
      if (res.code == "0") {
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
      this.$message({
        message: "已取消！",
        type: "success"
      });
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
    async updateUp(skuCode) {
      console.log("供货的skuCode", skuCode);
      const asklistRe = await askProductSkuListForSup({                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        token: this.$store.state.token,
        skuCode: skuCode
      });
      if (asklistRe) {
        this.asklist = asklistRe.result.resultList;
        // $nextTick 是在下次 DOM 更新循环结束之后执行延迟回调
        for(let i in this.asklist){
          if(this.asklist[i].status=='1'){
            this.$nextTick(function () {
              this.$refs.multipleTable1.toggleRowSelection(this.asklist[i]);
            })
          }else{
          }
       }
        
      }
    },
    
    handleSelectionChangeForSup(val) {
      this.skuCodeList = [];
      var json = {};
      this.multipleSelectionForSup = val;
      if (this.multipleSelectionForSup.length > 0) {
        this.multipleSelectionForSup.forEach(ele => {
          var skuCode = ele.skuCode;
          var selfStock = ele.stock;
          var supplyPrice = ele.supplyPrice;
          var barCode = ele.barCode;
          var status = 1;
          json = { skuCode, selfStock, supplyPrice, barCode, status };
          console.log("json", json);
          this.skuCodeList.push(json);
        });
      }

    },
    updateDown(n1, n2) {
      console.log("n1n2", n1, n2.status);
      this.updateskuMerId = n2.skuMerId;
      this.updateStatus = "3";
    },
    async updatePutUp() {
      var skuCodeStr = this.skuCodeList.join(",");
      console.log("skuCodeStr", skuCodeStr);

      if (!skuCodeStr) {
        this.$message({
          message: "请勾选商品！",
          type: "error"
        });
        return;
      }
      this.handleSelectionChangeForSup(this.multipleSelectionForSup);
      var skuCodeStr = JSON.stringify(this.skuCodeList);
      console.log("skuCodeStr", skuCodeStr);
      const res = await bidGoodsForSup({
        token: this.$store.state.token,
        list: skuCodeStr
      });
      if (res.code == "0") {
        this.$message({
          message: res.message,
          type: "success"
        });
      } else {
        this.$message.error(res.message);
      }
      this.initData();
      this.dialogUp1=false;
    },
    async updatePutDown() {
      if (this.putawayDown < 1) {
        this.$message({
          message: "请勾选取消供货类型",
          type: "error"
        });
        return;
      }
      const res = await updateSkuMerForStatus({
        token: this.$store.state.token,
        skuMerId: this.updateskuMerId,
        flag: this.putawayDown,
        status: this.updateStatus
      });
      if (res.code == "0") {
        this.$message({
          message: res.message,
          type: "success"
        });
      } else {
        this.$message.error(res.message);
      }
      this.reason = "";
      this.initData();
    },
    isPitch() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "未勾选商品",
          type: "error"
        });
      } else {
        this.flag = true;
      }
    },
    async handleDelete() {
      var delProductArray = [];

      for (var i in this.multipleSelection) {
        delProductArray.push(this.multipleSelection[i].skuCode);
      }
      const res = await deleteSkuMerForStatus({
        token: this.$store.state.token,
        skuCode: delProductArray.toString()
      });
      if (res.code == "0") {
        this.initData();
        this.$message({
          message: "删除成功！",
          type: "success"
        });
      } else {
        this.$message({
          message: res.message,
          type: "error"
        });
      }
    },
    toOrderList(n1, n2) {
      console.log("n1n2", n1, n2);
      var skuCode = n2.skuCode;
      this.$router.push({ path: "/orderwait", query: { skuCode: skuCode } });
    },
    toEditProduct(n1, n2) {
      //跳转至编辑商品
      console.log("n1n2", n1, n2);
      var skuCode = n2.skuCode;
      this.$router.push({ path: "/editgoods", query: { skuCode: skuCode } });
    },
    toAddGood() {
      //跳转至添加商品
      this.$router.push("/newgoods");
    },
    // 下载文件
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "excel.xlsx");

      document.body.appendChild(link);
      link.click();
    },
    async expor() {
      var url =
        baseUrl +
        "/product/exportProducts?" +
        "token=" +
        this.$store.state.token +
        "&name=" +
        this.name +
        "&barCode=" +
        this.barCode +
        "&skuCode=" +
        this.skuCode +
        "&status=" +
        this.status +
        " &type=" +
        this.type;
      window.location.href = url;
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
.p-span {
  color: rgb(153, 169, 191);
}
</style>
