<template>
  <div class="bigBox">
    <div class="smlBox">
      <p class="tit">第一步：请核对商品数量及信息</p>
      <div class="block">
        <div style="margin:0 20px;">
          请选择仓库：&nbsp;&nbsp;
          <el-radio v-model="warehouseType" label="1" checked>国内仓</el-radio>
          <el-radio v-model="warehouseType" label="2">国外仓</el-radio>
        </div>
        <el-table
          :data="orderList"
          border
          style="width: 100%; margin-top: 20px"
          element-loading-text="拼命加载中"
          v-loading="loading"
        >
          <el-table-column prop="orderNo" label="订单号" align="center"></el-table-column>
          <el-table-column label="商品信息" width="500" align="center">
            <template slot-scope="scope">
              <div style="display:flex;margin:5px 0px 5px 3px;" v-for="(item,index) in scope.row.detailList" :key="index">
                <div style="flex:1;width:50px;height:auto;">
                  <img :src="item.productMainImage" alt="图片加载失败" style="width:100%;height:90%;">
                </div>
                <div style="flex:3;text-align:left;margin-left:8px;">
                  <p><span style="color:#99a9bf;">名称：</span>{{item.productFullName}}</p>
                  <p><span style="color:#99a9bf;">SKU码：</span><router-link style="font-size:14px;color:blue;" :to="'goodDetail?sku='+item.skuCode" target='_blank'>{{item.skuCode}}</router-link></p>
                  <p>
                    <span><span style="color:#99a9bf;">供货码：</span>{{item.barCode}}</span>&nbsp;&nbsp;
                  </p>
                  <p>
                    <span><span style="color:#99a9bf;">供货单价：</span>{{item.supplyPrice}}</span>
                    &nbsp;&nbsp;<span style="color:#99a9bf;">供货数量：</span>{{item.productQuantity}}
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="productQuantity" label="发货总数量" align="center"></el-table-column>
          <el-table-column prop="totalAmount" label="供货总价" align="center"></el-table-column>

        </el-table>
      </div>
    </div>
    <div class="smlBox">
      <p class="tit">第二步：打印发货单(请将发货单放于快递包裹中)</p>
      <div style="margin:15px 20px;">
        <el-button type="primary" size="mini" plain>打印发货单</el-button>
      </div>
    </div>
    <div class="smlBox">
      <p class="tit">第三步：快递信息</p>
      <div style="margin:15px 20px;" class="forP">

          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

            <el-form-item label="收货地址：" >
              <span v-if="warehouseType=='1'">{{inLandList.addressDetail}}</span>
              <span v-if="warehouseType=='2'">{{forEignList.addressDetail}}</span>
            </el-form-item>
            <el-form-item label="收货人：" >
              <span v-if="warehouseType=='1'">{{inLandList.receiverName}}</span>
              <span v-if="warehouseType=='2'">{{forEignList.receiverName}}</span>
            </el-form-item>
            <el-form-item label="联系方式：" >
              <span v-if="warehouseType=='1'">{{inLandList.receiverTel}}</span>
              <span v-if="warehouseType=='2'">{{forEignList.receiverTel}}</span>
            </el-form-item>

            <el-form-item label="发货快递：" prop="expressCode">
              <el-select v-model="ruleForm.expressCode" placeholder="请选择" style="width:300px;" size="mini">
                <el-option
                  v-for="item in expressCompanyList"
                  :key="item.expressCode"
                  :label="item.expressName"
                  :value="item.expressCode"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="快递单号：" prop="expressNo">
              <el-input v-model="ruleForm.expressNo" style="width:300px;" size="mini"></el-input>
            </el-form-item>

            <el-form-item label="重量(KG)：" prop="weight">
              <el-input v-model.number="ruleForm.weight" style="width:300px;" size="mini"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleDelivery('ruleForm')" size="mini" plain>确认发货</el-button>

              <el-button @click="goback()" size="mini" plain>返回</el-button>
            </el-form-item>
          </el-form>

      </div>
    </div>
  </div>
</template>
<script>
import { baseUrl } from "../config/env";
import {
  getSelectedOrderList,
  postDelivery
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
      orderList: [], //第一步的 订单列表
      isIndeterminate: true,
      orderNos: "",
      warehouseType: "1", //所选仓库 1国内 2国外
      inLandList: {}, //国内仓库
      forEignList: {}, //国外仓库
      expressCompanyList: [], //可选择的快递列表
      loading: true,
      ruleForm: {
        expressCode: "", //物流公司编码
        expressNo: "", //快递单号
        weight: "" //重量
        },
        rules: {
          expressCode: [
            { required: true, message: '请选择发货快递', trigger: 'change' }
          ],
          expressNo: [
            {required: true, message: '请输入快递编号', trigger: 'blur' },
            { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
          ],
          weight: [
            { type: 'number', message: '必须为数字值', trigger: 'blur' }
          ]
        }
    };
  },
  // watch:{
  //   orderNos:'initData',
  //   orderList:'initData'
  // },

  created() {
    this.orderNos = this.$route.query.orderNos;
    console.log("come in-->", this.$route.query.orderNos);
  },
  mounted() {
    this.initData();
  },
  watch: {
    //防止用户返回上一级重新勾选，但是页面并未重新加载
      $route: {
      handler(val, oldval) {
        console.log(val, oldval);
        this.orderNos = this.$route.query.orderNos;
      },
      deep: true
    }
  },
  methods: {
    async initData() {
      const res = await getSelectedOrderList({
        token: this.$store.state.token,
        orderNos: this.orderNos
      });
      console.log("res-->", res);
      if (res && res.code == "0") {
        this.loading = false;
        this.orderList = res.result.orderList;
        this.inLandList = Object.assign({}, res.result.warehouseInfoList[0]); //国内仓库地址
        this.forEignList = Object.assign({}, res.result.warehouseInfoList[1]); //国外仓库地址
        this.expressCompanyList = res.result.expressCompanyList;

        console.log("wwlist", this.expressCompanyList);
      }
    },
    edit(e, num) {
      console.log("new", num);
      this.nowCode = num;
    },
    goback() {
      this.$router.go(-1);
    },

    async handleDelivery(formName) {

      var flag = false;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          flag = true;
        } else {
          console.log('error submit!!');
          return;
        }

      });
      if(flag){
        const data = await postDelivery({
          token: this.$store.state.token,
          orderNos: this.orderNos,
          warehouseType: this.warehouseType,
          expressCode: this.ruleForm.expressCode,
          expressNo: this.ruleForm.expressNo,
          weight: this.ruleForm.weight
        });

        console.log("发货返回结果:"+data);
        if (data.code == "0") {
          this.$message({
            message: "操作成功！",
            type: "success"
          });
          this.$router.go(-1);
        } else if (data.code == "1"){
          this.$message({
            message: data.message,
            type: "error"
          });
        }
      }
    },



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
    padding: 10px 20px;
    background-color: #fff;
    margin: 10px 0;
    .tit {
      color: #666;
      font-size:14px;
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