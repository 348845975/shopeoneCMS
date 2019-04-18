<template>
  <div id="edit">
    <head-top></head-top>
    <div class="container">
      <p class="msg">公司信息</p>
      <div class="conts">
        <div class="line">
          <div class="l-left">统一社会信用代码：</div>
          <div class="l-right">
            <span v-if="flag1=='0'">{{resList.socialCreditCode}}</span>
            <el-input
              v-if="flag1=='1'"
              v-model="resList.socialCreditCode"
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </div>
        </div>
        <div class="line">
          <div class="l-left">公司名称：</div>
          <div class="l-right">
            <span v-if="flag1=='0'">{{resList.name}}</span>
            <el-input v-if="flag1=='1'" v-model="resList.name" placeholder="请输入内容" size="mini"></el-input>
          </div>
        </div>
        <div class="line">
          <div class="l-left">公司英文简称：</div>
          <div class="l-right">
            <span v-if="flag1=='0'">{{resList.englishName}}</span>
            <el-input
              v-if="flag1=='1'"
              v-model="resList.englishName"
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </div>
        </div>
        <div class="line">
          <div class="l-left">公司地址：</div>
          <div class="l-right" style="display:flex;">
            <span v-if="flag1=='0'">
              <span v-if="resList.companyAddressList">{{resList.companyAddressList.join(',')}}</span>
              <span v-if="resList.addressDetail">{{resList.addressDetail}}</span>
            </span>
            <area-select
              v-if="flag1=='1'"
              type="text"
              v-model="resList.companyAddressList"
              :data="pcaa"
              :level="2"
              style="flex:2;"
            ></area-select>
            <el-input
              v-if="flag1=='1'"
              v-model="resList.addressDetail"
              placeholder="请输入内容"
              size="mini"
              style="flex:2;"
            ></el-input>
          </div>
        </div>
        <div class="line" style="width:100%;margin:0 auto;text-align:center">
          <el-button
            type="primary"
            v-if="flag1=='0'"
            plain
            size="mini"
            style="margin:0 auto"
            @click="flag1='1'"
          >编辑</el-button>
          <div v-if="flag1=='1'" style="margin:0 auto">
            <el-button type="primary" plain size="mini" @click="save1()">保存</el-button>
            <el-button type="primary" plain size="mini" @click="flag1='0'">取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <p class="msg">银行信息</p>
      <div class="conts">
        <div class="line">
          <div class="l-left">银行名称：</div>
          <div class="l-right">
            <span v-if="flag2=='0'">{{resList.bankName}}</span>
            <el-input v-if="flag2=='1'" v-model="resList.bankName" placeholder="请输入内容" size="mini"></el-input>
          </div>
        </div>
        <div class="line">
          <div class="l-left">银行卡号：</div>
          <div class="l-right">
            <span v-if="flag2=='0'">{{resList.bankCardNum}}</span>
            <el-input
              v-if="flag2=='1'"
              v-model="resList.bankCardNum"
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </div>
        </div>
        <div class="line">
          <div class="l-left">再次银行卡号：</div>
          <div class="l-right">
            <span v-if="flag2=='0'">{{resList.bankCardNum}}</span>
            <el-input
              v-if="flag2=='1'"
              v-model="surePwd"
              placeholder="请输入内容"
              size="mini"
              @change="handlesurePwd"
            ></el-input>
            <span v-if="flag&&flag2=='1'" style="color:red">两次输入密码不一致!</span>
          </div>
        </div>
        <div class="line">
          <div class="l-left">持卡人姓名：</div>
          <div class="l-right">
            <span v-if="flag2=='0'">{{resList.userName}}</span>
            <el-input v-if="flag2=='1'" v-model="resList.userName" placeholder="请输入内容" size="mini"></el-input>
          </div>
        </div>
        <div class="line">
          <div class="l-left">持卡人身份证号：</div>
          <div class="l-right">
            <span v-if="flag2=='0'">{{resList.userIdCard}}</span>
            <el-input
              v-if="flag2=='1'"
              v-model="resList.userIdCard"
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </div>
        </div>
        <div class="line">
          <div class="l-left">开户行：</div>
          <div class="l-right">
            <span v-if="flag2=='0'">{{resList.depositBank}}</span>
            <el-input
              v-if="flag2=='1'"
              v-model="resList.depositBank"
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </div>
        </div>
        <div class="line">
          <div class="l-left">银联号：</div>
          <div class="l-right">
            <span v-if="flag2=='0'">{{resList.unionpayNum}}</span>
            <el-input
              v-if="flag2=='1'"
              v-model="resList.unionpayNum"
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </div>
        </div>
        <!-- <div class="line">
          <div class="l-left">此系统登录密码:</div>
          <div class="l-right">******</div>
        </div>-->
        <div class="line" style="width:100%;margin:0 auto;text-align:center">
          <el-button
            type="primary"
            v-if="flag2=='0'"
            plain
            size="mini"
            style="margin:0 auto"
            @click="flag2='1'"
          >编辑</el-button>
          <div v-if="flag2=='1'" style="margin:0 auto">
            <el-button type="primary" plain size="mini" @click="save2()">保存</el-button>
            <el-button type="primary" plain size="mini" @click="flag2='0'">取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <p class="msg">经营信息</p>
      <div class="conts">
        <div class="line">
          <div class="l-left">主营品类：</div>
          <div class="l-right">
            <span v-if="flag3=='0'">{{resList.mainSale}}</span>
            <span v-if="flag3=='1'">
              <el-cascader
                expand-trigger="hover"
                :options="cateOptions"
                v-model="resList.mainSaleList"
                size="mini"
              ></el-cascader>
            </span>
          </div>
        </div>
        <div class="line">
          <div class="l-left">辅营品类：</div>
          <div class="l-right">
            <span v-if="flag3=='0'">{{resList.secondSale}}</span>
            <el-checkbox-group v-if="flag3=='1'" v-model="resList.secondSaleList">
              <el-checkbox
                v-for="item in fuOptions"
                :label="item.id"
                :key="item.id"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="line">
          <div class="l-left">供应商主体：</div>
          <div class="l-right">
            <span v-if="flag3=='0'">{{resList.host}}</span>
             <el-radio-group  v-if="flag3=='1'" v-model="resList.hostCode">
             <el-radio :label="item.code"  v-for="(item,index) in hostOptions" :key="index">{{item.desc}}</el-radio>

    </el-radio-group>
          </div>
        </div>
        <div class="line">
          <div class="l-left">供应商性质：</div>
          <div class="l-right">
            <span v-if="flag3=='0'">{{resList.property}}</span>
            <el-radio-group v-if="flag3=='1'" v-model="resList.propertyCode">
               <el-radio :label="item.code" v-for="(item,index) in propertyOptions" :key="index">{{item.desc}}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="line">
          <div class="l-left">员工数：</div>
          <div class="l-right">
            <span v-if="flag3=='0'">{{resList.employees}}</span>
            <el-radio-group v-if="flag3=='1'" v-model="resList.employCode">
               <el-radio :label="item.code" v-for="(item,index) in employeeOptions" :key="index">{{item.desc}}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="line">
          <div class="l-left">近一年销售额：</div>
          <div class="l-right">
            <span v-if="flag3=='0'">{{resList.saleAmount}}</span>
            <el-select v-model="resList.saleAmountCode" v-if="flag3=='1'" placeholder="请选择" size="mini">
                <el-option
                  v-for="(item,index) in saleNearYearOptions"
                  :key="index"
                  :label="item.desc"
                  :value="item.code">
                </el-option>
            </el-select>
          </div>
        </div>
        <div class="line">
          <div class="l-left">现有商品款式数量：</div>
          <div class="l-right">
            <span v-if="flag3=='0'">{{resList.styleCount}}</span>
            <el-input
              v-if="flag3=='1'"
              v-model="resList.styleCount"
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </div>
        </div>
        <div class="line">
          <div class="l-left">其他经营平台：</div>
          <div class="l-right">
            <span v-if="flag3=='0'">{{resList.otherManage}}</span>
             <el-checkbox-group v-if="flag3=='1'" v-model="resList.otherManageList">
              <el-checkbox
                v-for="item in otherPlatOptions"
                :label="item.code"
                :key="item.code"
                style="width:120px;margin-right:20px;"
              >{{item.desc}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="line" style="width:400px;margin:0 auto">
          <el-button
            type="primary"
            v-if="flag3=='0'"
            plain
            size="mini"
            style="margin:0 auto"
            @click="flag3='1'"
          >编辑</el-button>
          <div v-if="flag3=='1'" style="margin:0 auto">
            <el-button type="primary" plain size="mini" @click="save3()">保存</el-button>
            <el-button type="primary" plain size="mini" @click="flag3='0'">取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <p class="msg">您公司的联系方式</p>
      <div class="conts">
        <div class="line">
          <div class="l-left">联系人：</div>
          <div class="l-right">
            <span v-if="flag4=='0'">{{resList.contactName}}</span>
            <el-input
              v-if="flag4=='1'"
              v-model="resList.contactName"
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </div>
        </div>
        <div class="line">
          <div class="l-left">联系人部门及职能：</div>
          <div class="l-right">
            <span v-if="flag4=='0'">{{resList.contactJob}}</span>
            <el-input
              v-if="flag4=='1'"
              v-model="resList.contactJob"
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </div>
        </div>
        <div class="line">
          <div class="l-left">联系人手机号：</div>
          <div class="l-right">
            <span v-if="flag4=='0'">{{resList.tel}}</span>
            <el-input v-if="flag4=='1'" v-model="resList.tel" placeholder="请输入内容" size="mini"></el-input>
          </div>
        </div>
        <div class="line">
          <div class="l-left">联系人QQ：</div>
          <div class="l-right">
            <span v-if="flag4=='0'">{{resList.qqNumber}}</span>
            <el-input v-if="flag4=='1'" v-model="resList.qqNumber" placeholder="请输入内容" size="mini"></el-input>
          </div>
        </div>
        <div class="line">
          <div class="l-left">邮箱地址：</div>
          <div class="l-right">
            <span v-if="flag4=='0'">{{resList.email}}</span>
            <el-input v-if="flag4=='1'" v-model="resList.email" placeholder="请输入内容" size="mini"></el-input>
          </div>
        </div>
        <!-- <div class="line">
          <div class="l-left">发货地址：</div>
          <div class="l-right" style="display:flex;">
            <span v-if="flag4=='0'">
              <span v-if="resList.sendAddressList">{{resList.sendAddressList.join(',')}}</span>
              <span v-if="resList.sendAddress">{{resList.sendAddress}}</span>
            </span>
            <area-select
              v-if="flag4=='1'"
              type="text"
              v-model="resList.sendAddressList"
              :data="pcaa"
              :level="2"
              style="flex:2;"
            ></area-select>
            <el-input
              v-if="flag4=='1'"
              v-model="resList.sendAddress"
              placeholder="请输入内容"
              size="mini"
              style="flex:2;"
            ></el-input>
          </div>
        </div> -->
        <div class="line" style="width:400px;margin:0 auto">
          <el-button
            type="primary"
            v-if="flag4=='0'"
            plain
            size="mini"
            style="margin:0 auto"
            @click="flag4='1'"
          >编辑</el-button>
          <div v-if="flag4=='1'" style="margin:0 auto">
            <el-button type="primary" plain size="mini" @click="save4()">保存</el-button>
            <el-button type="primary" plain size="mini" @click="flag4='0'">取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import headTop from "../components/headTop";
import { mapState } from "vuex";
import { baseUrl } from "../config/env";
import pcaa from "../config/pcaa";
import {
  getMerchantInfo,
  updateCompany,
  updateSaleInfo,
  updateContactInfo,
  updateCardBank,
  getCategory,
  getEnumList
} from "@/api/getData";
export default {
  data() {
    return {
      pcaa: pcaa, //中国省市区大全
      cateOptions: [],
      fuOptions:[],
      hostOptions:[],
      propertyOptions:[],
      employeeOptions:[],
      saleNearYearOptions:[],
      otherPlatOptions:[],
      selectedOptions: [],//主营品类
      secSaleList:[],//辅营品类
      host:'',//供应商主体
      property:"",//供应商性质
      checkedCates: [],
      resList: {},
      surePwd: "",
      flag: false, //判断是否提示
      flag1: 0, //0代表只显示 1显示编辑框
      flag2: 0, //0代表只显示 1显示编辑框
      flag3: 0, //0代表只显示 1显示编辑框
      flag4: 0 //0代表只显示 1显示编辑框
    };
  },
  components: {
    headTop
  },
  created() {
    this.initCate();
  },
  mounted() {
    this.initData();
  },
  methods: {
    async handleChange(value) {},
    async initCate() {
      const res = await getEnumList({ token: this.$store.state.token });
      if(res.code=='0'){
           this.cateOptions = res.result.zhuList;
           this.fuOptions=res.result.fuList;
           this.hostOptions=res.result.hostList;
           this.propertyOptions=res.result.propertyList;
           this.employeeOptions=res.result.employeeList;
           this.saleNearYearOptions=res.result.saleNearYearList;
           this.otherPlatOptions=res.result.otherPlatList;
      }

    },
    async initData() {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      const merchantMsg = await getMerchantInfo({
        token: this.$store.state.token
      });
      if (merchantMsg.code == "0") {

        this.resList = merchantMsg.result.list;
        loading.close();
      }
    },
    edit1() {
      this.flag1 = "1";
    },
    async save1() {
      this.flag1 = "0";
      const res = await updateCompany({
        token: this.$store.state.token,
        addressDetail: this.resList.addressDetail,
        englishName: this.resList.englishName,
        socialCreditCode: this.resList.socialCreditCode,
        companyProvince: this.resList.companyAddressList[0], //公司所在省
        companyCity: this.resList.companyAddressList[1], //公司所在市
        companyArea: this.resList.companyAddressList[2] //公司所在区
      });
      if (res.code == "0") {
        this.$message.success("修改成功");
        this.initData();
      } else {
        this.$message.error("修改失败，请稍后再试！");
      }
    },
    async save2() {
      if (this.flag || this.surePwd == "") {
        this.$message.error("两次输入卡号不一致！");
      } else {
        this.flag2 = "0";
        const res = await updateCardBank({
          token: this.$store.state.token,
          bankName: this.resList.bankName,
          bankCardNum: this.resList.bankCardNum,
          userName: this.resList.userName,
          userIdCard: this.resList.userIdCard,
          depositBank: this.resList.depositBank,
          unionpayNum: this.resList.unionpayNum
        });
        if (res.code == "0") {
          this.$message.success("修改成功");
          this.initData();
        } else {
          this.$message.error("修改失败，请稍后再试！");
        }
      }
    },
    async save3() {
      this.flag3 = "0";
      console.log('em..',this.selectedOptions,this.host)
      const res = await updateSaleInfo({
        token: this.$store.state.token,
        mainSale:this.resList.mainSaleList.join(','),
        secondSale: this.resList.secondSaleList.join(','),
        host: this.resList.hostCode,
        property: this.resList.propertyCode,
        employees: this.resList.employCode,
        saleAmount: this.resList.saleAmountCode,
        styleCount: this.resList.styleCount,
        otherManage: this.resList.otherManageList.join(',')
      });
      if (res.code == "0") {
        this.$message.success("修改成功");
        this.initData();
      } else {
        this.$message.error("修改失败，请稍后再试！");
      }
    },
    async save4() {
      this.flag4 = "0";
      const res = await updateContactInfo({
        token: this.$store.state.token,
        contactName: this.resList.contactName,
        contactJob: this.resList.contactJob,
        qqNumber: this.resList.qqNumber,
        sendAddress: this.resList.sendAddress,
        email: this.resList.email,
        sendProvince: this.resList.sendAddressList[0], //公司所在省
        sendCity: this.resList.sendAddressList[1], //公司所在市
        sendArea: this.resList.sendAddressList[2] //公司所在区
      });
      if (res.code == "0") {
        this.$message.success("修改成功");
        this.initData();
      } else {
        this.$message.error("修改失败，请稍后再试！");
      }
    },
    handlesurePwd() {
      console.log("error");
      if (this.surePwd !== this.resList.bankCardNum) {
        this.flag = true;
      } else {
        this.flag = false;
      }
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
#edit {
  .el-input {
    width: 200px;
  }
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
      .line {
        display: flex;
        margin-bottom: 10px;

        .l-left {
          flex: 1;
          text-align: right;
          font-size: 14px;
          line-height: 1.5;
          font-weight: bold;
        }
        .l-right {
          flex: 1;
          font-size: 14px;
        }
      }
    }
  }
  .area-select-wrap .area-select {
    margin: 0 !important;
    height: 28px !important;
    width: 100px !important;
    .area-selected-trigger {
      padding: 5px 20px 7px 12px !important;
      font-size: 12px !important;
    }
  }
}
</style>
