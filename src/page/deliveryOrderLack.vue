<template>
  <div class="bigBox">
    <div class="smlBox">
      <p class="tit">第一步：请核对商品数量及信息</p>
      <div class="block">

        <el-table
          :data="list"
          border
          style="width: 100%; margin-top: 20px"
          element-loading-text="拼命加载中"
          v-loading="loading"
        >
          <el-table-column prop="deliveryOrderNo" label="发货单号" align="center"></el-table-column>
          <el-table-column prop="orderNo" label="订单号" align="center"></el-table-column>
          <el-table-column label="商品信息" width="500" align="center">
            <template slot-scope="scope">
              <div style="display:flex;margin:5px 0px 5px 3px;">
                <div style="flex:1;width:50px;height:auto;">
                  <img :src="scope.row.productMainImage" alt="图片加载失败" style="width:100%;height:90%;">
                </div>
                <div style="flex:3;text-align:left;margin-left:8px;">
                  <p><span style="color:#99a9bf;">名称：</span>{{scope.row.productName}}</p>
                  <p><span style="color:#99a9bf;">SKU码：</span><router-link style="font-size:14px;color:blue;" :to="'goodDetail?sku='+scope.row.skuCode" target='_blank'>{{scope.row.skuCode}}</router-link></p>
                  <p>
                    <span><span style="color:#99a9bf;">供货码：</span>{{scope.row.barCode}}</span>&nbsp;&nbsp;
                  </p>
                  <p>
                    <span><span style="color:#99a9bf;">供货单价：</span>{{scope.row.supplyPrice}}</span>
                    &nbsp;&nbsp;<span style="color:#99a9bf;">数量：</span>{{scope.row.productQuantity}}
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="inStatusStr" label="入库状态" align="center"></el-table-column>
          <el-table-column prop="inReason" label="描述" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="outOfStockDialogUp=true,outOfStockDialogValue(scope.row.deliveryOrderNo, scope.row.orderNo, scope.row.skuCode)"
                type="primary"
              >缺货</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog :visible.sync="outOfStockDialogUp" title="确认操作">
          <el-form :inline="true" :model="outOfStockForm" class="demo-form-inline">
            <el-form-item label="缺货类型" prop="123">
              <el-radio-group v-model="outOfStockForm.type">
                <el-radio :label="1">仅此规格缺货</el-radio>
                <el-radio :label="2">整款缺货</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <p style="color:black;">您确定此商品缺货吗？缺货操作会影响您的评级，缺货后此商品将下架，您可以在有货后重新上架！</p>
          <div slot="footer" class="dialog-footer">
            <el-button @click="outOfStockDialogUp = false">关 闭</el-button>
            <el-button type="primary" @click="outOfStock()">确 定</el-button>
          </div>
        </el-dialog>

      </div>
    </div>
    <div class="smlBox">
      <p class="tit">第二步：打印发货单(请将发货单放于快递包裹中)</p>
      <div style="margin:15px 20px;">
        <el-button type="primary">打印发货单</el-button>
        <el-button type="primary" @click="createprepare()" plain>打印供货码</el-button>
        <el-popover
          placement="right"
          title="提示"
          width="380"
          trigger="hover"
          content="1. 供货码作为您商品的入库识别码，需在每个商品上进行贴标。
          2. 仓库扫描您的供货码，才能更快、更准确的进行货品入库。
          3. 供货码建议使用统一的69码。如果您的商品无69码，您可以编辑任何纯数字组合，作为该商品的唯一识别码。
          4. 商品无69码的，请勾选对应商品将供货码打印出来，并粘贴在您供应的每一个商品上。"
        >
          <i class="el-icon-question" slot="reference" style=" cursor:pointer"></i>
        </el-popover>
      </div>
    </div>
    <div class="smlBox">
      <p class="tit">第三步：快递信息</p>
      <div style="margin:15px 20px;" class="forP">

          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

            <el-form-item label="收货地址：" >
              <span>{{warehouseInfo.addressDetail}}</span>
            </el-form-item>
            <el-form-item label="收货人：" >
              <span>{{warehouseInfo.receiverName}}</span>
            </el-form-item>
            <el-form-item label="联系方式：" >
              <span>{{warehouseInfo.receiverTel}}</span>
            </el-form-item>

            <el-form-item label="发货快递：" prop="expressCode">
              <el-select v-model="ruleForm.expressCode" placeholder="请选择" style="width:300px;">
                <el-option
                  v-for="item in expressCompanyList"
                  :key="item.expressCode"
                  :label="item.expressName"
                  :value="item.expressCode"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="快递单号：" prop="expressNo">
              <el-input v-model="ruleForm.expressNo" style="width:300px;"></el-input>
            </el-form-item>

            <el-form-item label="重量(KG)：" prop="weight">
              <el-input v-model.number="ruleForm.weight" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleDelivery('ruleForm')">确认发货</el-button>

              <el-button @click="goback()">返回</el-button>
            </el-form-item>
          </el-form>

      </div>
    </div>
  </div>
</template>
<script>
import { baseUrl } from "../config/env";
import {
  getDeliveryOrderLackList,
  postDeliveryRep,
  deliveryOutOfStock
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
      list: [], //第一步的 列表
      isIndeterminate: true,
      deliveryOrderNo: "",
      ids: "",
      warehouseInfo: {}, //仓库
      expressCompanyList: [], //可选择的快递列表
      loading: true,
      outOfStockDialogUp: false,
      outOfStockDeliveryOrderNo: "",
      orderNo: "",
      outOfStockSku: "",
      outOfStockForm: {
        type: ""
      },
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

  beforeCreate() {},
  created() {
    this.deliveryOrderNo = this.$route.query.deliveryOrderNo;
    console.log("come in deliveryOrderNo-->", this.$route.query.deliveryOrderNo);
  },
  mounted() {
       this.initData();
  },
  watch: {
    $route: {
      handler(val, oldval) {
        this.deliveryOrderNo = this.$route.query.deliveryOrderNo;
      },
      deep: true
    }
  },
  methods: {
    async initData() {
      const res = await getDeliveryOrderLackList({
        token: this.$store.state.token,
        deliveryOrderNo: this.deliveryOrderNo
      });
      console.log("res-->", res);
      if (res && res.code == "0") {
        this.loading = false;
        this.list = res.result.resultList;
        this.warehouseInfo = res.result.warehouseInfo; //仓库地址
        this.expressCompanyList = res.result.expressCompanyList;
        this.ids = res.result.ids;

        console.log("ids=", this.ids);
      }
    },
    edit(e, num) {
      this.nowCode = num;
    },
    goback() {
      this.$router.go(-1);
    },
    outOfStockDialogValue(deliveryOrderNo, orderNo, skuCode) {
      this.outOfStockDeliveryOrderNo = deliveryOrderNo;
      this.orderNo = orderNo;
      this.outOfStockSku = skuCode;
      console.log("outOfStockDeliveryOrderNo", this.outOfStockDeliveryOrderNo);
      console.log("outOfStockSku", this.outOfStockDeliveryOrderNo);
    },
    async outOfStock() {

      if (!this.outOfStockSku) {
        alert("操作失败，请刷新页面再试！");
        return;
      }
      console.log("outOfStockForm=", this.outOfStockForm.type);
      if (!this.outOfStockForm.type) {
        this.$message({
          message: "请选择缺货类型！",
          type: "error"
        });
        return;
      }

      const res = await deliveryOutOfStock({
        token: this.$store.state.token,
        deliveryOrderNo: this.outOfStockDeliveryOrderNo,
        orderNo: this.orderNo,
        skuCode: this.outOfStockSku,
        type: this.outOfStockForm.type
      });
      console.log("缺货返回结果:"+res);
      if (res.code == "0") {
        this.outOfStockDialogUp = false;
        this.$message({
            message: "操作成功！",
            type: "success"
        });
        setTimeout("window.location.reload()", 1500 );
      } else {
        this.$message({
          message: res.message,
          type: "error"
        });
      }

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
        const data = await postDeliveryRep({
          token: this.$store.state.token,
          ids: this.ids,
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