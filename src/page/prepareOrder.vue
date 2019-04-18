<template>
  <div class="bigBox">
    <div class="smlBox">
      <p class="tit">第一步：请核对商品数量及信息</p>
      <div class="block">
        <div style="margin:0 20px;">
          请选择备货仓库：
          <el-radio v-model="warehouseType" label="1" checked>国内仓</el-radio>
          <el-radio v-model="warehouseType" label="2">国外仓</el-radio>
        </div>
        <el-table
          :data="prelist"
          border
          style="width: 100%; margin-top: 20px"
          element-loading-text="拼命加载中"
          v-loading="loading"
        >
          <el-table-column label="商品信息" width="350" align="center">
            <template slot-scope="scope">
              <div style="overflow:hidden;" v-for="(item,index) in scope.row.goodList" :key="index">
                <div style="float:left;width:30%;height:100%">
                  <img :src="item.imgUrl" alt style="width:100%;height:auto">
                </div>
                <div style="float:left;width:65%;margin-top:10px;text-align:left;margin-left:3%">
                  <p  style="width:100%;">名称:{{item.name}}</p>
                  <p>SKU:{{item.skuCode}}</p>
                  <p>
                    <span>商品规格:{{item.str}}</span>
                  </p>
                  <p>
                    <span>商品供货码:{{item.barCode}}</span>&nbsp;&nbsp;
                  </p>
                  <p>
                    <span>自有库存量:{{item.selfStock}}</span>&nbsp;&nbsp;
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
            <el-table-column  label="备货数量" align="center">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.stock" controls-position="right" @blur="handleFocus(scope.row.stock)"  style="width:100px;" size="mini"  :min="1" ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="supplyPrice" label="供货单价" align="center"></el-table-column>
            <el-table-column label="总金额" align="center"  width="100" >
                 <template slot-scope="scope">{{parseFloat(scope.row.stock*scope.row.supplyPrice).toFixed(2)}} </template>
           </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handledel(scope.$index)"
                type="primary"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="smlBox">
      <p class="tit">第二步：打印发货单(请将发货单放于快递包裹中)</p>
      <div style="margin:15px 20px;">
        <el-button type="primary" size="mini" plain>打印发货单</el-button>
        <el-button type="primary"  size="mini" plain>打印供货码</el-button>
        <!-- <el-button type="primary">下载打印插件</el-button> -->
      </div>
    </div>
    <div class="smlBox">
      <p class="tit">第三步：快递信息</p>
      <div style="margin:15px 20px;" class="forP">
        <p>
          <span style="display:inline-block;width:100px;">收货地址：</span>
          <span v-if="warehouseType=='1'">{{inLandList.address}}</span>
          <span v-if="warehouseType=='2'">{{forEignList.address}}</span>
        </p>
        <p>
          <span style="display:inline-block;width:100px;">收货人：</span>
          <span v-if="warehouseType=='1'">{{inLandList.receiverName}}</span>
          <span v-if="warehouseType=='2'">{{forEignList.receiverName}}</span>
        </p>
        <p>
          <span style="display:inline-block;width:100px;">手机号码：</span>
          <span v-if="warehouseType=='1'">{{inLandList.receiverTel}}</span>
          <span v-if="warehouseType=='2'">{{forEignList.receiverTel}}</span>
        </p>
        <p>
          <span style="display:inline-block;width:100px;">快递名称：</span>
          <el-select v-model="expressCode" placeholder="请选择" style="width:300px;" size="mini">
            <el-option
              v-for="item in expressCompanyList"
              :key="item.expressCode"
              :label="item.expressName"
              :value="item.expressCode"
            ></el-option>
          </el-select>
          <span></span>
        </p>
        <p>
          <span style="display:inline-block;width:100px;">快递单号：</span>
          <el-input placeholder="请输入内容" v-model="expressNo" clearable style="width:300px;" size="mini"></el-input>
        </p>
        <p>
          <span style="display:inline-block;width:100px;">重量（KG）:</span>
          <el-input placeholder="请输入内容" v-model="weight" clearable style="width:300px;" size="mini"></el-input>
        </p>
        <el-button type="primary" style="margin-top:20px;" @click="handleGetDelivery" size="mini" plain>确认发货</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { baseUrl } from "../config/env";
import {
  getPrepareList,
  createPrepareOrder
} from "@/api/getData";
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
export default {
  data() {
    return {
      prelist: [], //第一步的 商品列表
      isIndeterminate: true,
      warehouseType: "1", //所选仓库 1国内 2国外
      inLandList: {}, //国内仓库
      forEignList: {}, //国外仓库
      expressCompanyList: [], //可选择的快递列表
      expressNo: "", //快递单号
      carriage: "", //运费 元
      weight: "", //重量
      cubage: "", //体积
      expressCode: "", //物流公司编码
      stock: "", //数量
      supplyPrice: "", //单价
      loading: true,
      dialogFormVisible: false
    };
  },
  beforeCreate() {
  },
  created() {
    this.initSku = this.$route.query.skuCode;
    console.log("come in-->", this.$route.query.skuCode);
  },
  mounted() {
    this.initData();
  },
  methods: {
    handleFocus(value){
        if(!isNaN(value)&&value%1===0){
            return
        }else{
          this.$message.error('请输入整数！')
        }

    },
    async initData() {
      const res = await getPrepareList({
        token: this.$store.state.token,
        skuCode: this.initSku
      });
      console.log("ressssss-->", res);
      if (res && res.code == "0") {
        this.loading = false;
        this.prelist = res.result.prelist;
        this.inLandList = Object.assign({}, res.result.warehouseInfos[0]); //国内仓库地址
        this.forEignList = Object.assign({}, res.result.warehouseInfos[1]); //国外仓库地址
        this.expressCompanyList = res.result.expressCompanyList;

        console.log("wwlist", this.expressCompanyList);
      }
    },
    handledel(index){
      this.prelist.splice(index, 1);
    },
    async handleGetDelivery(){
      var conaddress = "";
      var conname = "";
      var contel = "";
      if(this.warehouseType=="1"){
        conaddress = this.inLandList.address;
        conname = this.inLandList.receiverName;
        contel = this.inLandList.receiverTel;
      }else if(this.warehouseType=="2"){
        conaddress = this.forEignList.address;
        conname = this.forEignList.receiverName;
        contel = this.forEignList.receiverTel;
      }else{
         console.log("地址信息不明！")
      }
      //定义一个数组
      var listArr = [];
      var json={};
      for(let i in this.prelist){
        var skuCode=this.prelist[i].goodList[0].skuCode;
        var stock=this.prelist[i].stock;
        json = {skuCode,stock}
        listArr.push(json);
      }
      console.log("json",JSON.stringify(listArr));
      const res = await createPrepareOrder({
        token: this.$store.state.token,
        expressNo:this.expressNo,
        expressCode:this.expressCode,
        weight:this.weight,
        warehouseType:this.warehouseType,
        addressDetail:conaddress,
        receiverName:conname,
        receiverTel:contel,
        list:JSON.stringify(listArr)
      });
      if (res.code == "0") {
        this.$message({
          message: res.message,
          type: "success"
        });
      } else {
        this.$message.error(res.message);
      }
    }
  }
};
</script>
<style lang="less" scoped>
a {
  color: #409eff;
}
.bigBox {
  margin: 40px;
  .smlBox {
    padding: 20px;
    background-color: #fff;
    margin: 20px 0;
    .tit {
      color: #666;
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

</style>