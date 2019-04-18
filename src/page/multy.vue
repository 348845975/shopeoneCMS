<template>
  <div class="bigBox">
     <head-top></head-top>
    <el-steps :active="1" style="width:50%;margin:50px auto;">
      <el-step title="第一步：" description="选择发布方式"></el-step>
      <el-step title="第二步：" description="下载填写表格"></el-step>
      <el-step title="第三步：" description="提交等待审核"></el-step>
    </el-steps>
    <div class="smlBox">
      <p class="tit">第一步：请选择商品类目，下载对应表格模板</p>
      <div class="block">
        <span class="demonstration">选择类目：</span>
        <el-cascader
          expand-trigger="hover"
          :options="cateOptions"
          v-model="selectedCate"
          @change="handleChange"
          size="mini"
        ></el-cascader>
      </div>
      <el-button type="primary" @click="downloadTemplate()" size="mini" plain>
        <i class="el-icon-download"></i>
        下载模板
      </el-button>
      <a href="#">
        <i class="el-icon-question"></i>查看如何填写商品单
      </a>
    </div>
    <div class="smlBox">
      <p class="tit">第二步：上传表格</p>
      <div class="block">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="httpUrl"
          :on-preview="handlePreview"
          :on-success="handleSuccess"
          :limit="1"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          :data="data"
        >
          <el-button style="margin-left: 10px;" type="primary" @click="submitUpload" size="mini"  plain>
            <i class="el-icon-upload2 uload" ></i>
            &nbsp;&nbsp;上&nbsp;&nbsp;传&nbsp;&nbsp;
          </el-button>
        </el-upload>
      </div>
    </div>
    <div class="smlBox">
      <p class="tit">第三步：预览确认</p>
      <el-table :data="tableData" stripe border style="width: 100%;margin:20px 0">
        <el-table-column prop="errorMessage" label="错误信息" width="180"></el-table-column>
        <el-table-column prop="brandName" label="品牌名称"></el-table-column>
        <el-table-column label="商品图片" width="180">
          <template slot-scope="scope">
            <img :src="scope.row.skuImg" min-width="70" height="70">
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="saleOptionName" label="商品销售属性（规格）"></el-table-column>

        <el-table-column prop="tagPrice" label="吊牌价（单位元）"></el-table-column>
        <el-table-column prop="supplyPrice" label="供应价（单位元）"></el-table-column>
        <el-table-column prop="stock" label="库存"></el-table-column>
        <el-table-column prop="barCode" label="供应商条码"></el-table-column>
      </el-table>
      <el-button type="primary" @click="getShangpin" size="mini"  plain>
        <!-- <i class="el-icon-upload2"></i> -->
        &nbsp;&nbsp;提&nbsp;&nbsp;交&nbsp;&nbsp;
      </el-button>
    </div>
  </div>
</template>
<script>
import { baseUrl } from "../config/env";
import {
  addExcelProduct,
  getCategory,
  downloadTemplateSkuMer
} from "@/api/getData";
import headTop from "@/components/headTop";
export default {
    components: {
    headTop
  },
  data() {
    return {
      cateOptions: [],
      selectedCate: [],
      selectedOptions: [],
      fileList: [],
      tableData: [],
      data: {
        token: "",
        categoryId: ""
      },
      httpUrl:''

    };
  },
  mounted() {
    this.initData();
    this.httpUrl = baseUrl + "/product/batchProductVerife";
    this.data.token = this.$store.state.token;
  },
  methods: {
    async initData() {
      const category = await getCategory({ token: this.$store.state.token });
      this.cateOptions = category.simpleJsonResult.result.data;
    },
    async downloadTemplate() {
      if (this.selectedCate.length == 0) {
        this.$message({
          message: "请选择类目",
          type: "error"
        });
        return;
      }
       this.data.categoryId = "1";
      // this.data.categoryId = this.selectedCate[1];
      const res = await downloadTemplateSkuMer({
        token: this.$store.state.token,
        categoryId: this.selectedCate[1]
      });
      if (res.simpleJsonResult.code == "0") {
        window.location.href = res.simpleJsonResult.result.excelUrl;
      } else {
        this.$message({
          message: res.simpleJsonResult.message,
          type: "error"
        });
      }
    },
    submitUpload() {
      console.log(this.data);
      this.$refs.upload.submit();
    },
    handleSuccess(res, fileList) {
      console.log("file文件上传", res);
       if (res && res.code == "0") {
        console.log("xzss", res);
        this.tableData = res.result.data;
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleChange(value) {

      console.log(value);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    async getShangpin() {
      console.log( this.tableData);
      const res = await addExcelProduct({
        token: this.$store.state.token,
        category1Id : this.selectedCate[0],
        category2Id : this.selectedCate[1],
        skuExcelList : JSON.stringify(this.tableData)
      });
     if (res.simpleJsonResult.code == "0") {

        this.$message({
          message: res.simpleJsonResult.message,
          type: "success"
        });
        this.cateOptions= [],
        this.selectedCate= [],
        this.selectedOptions= [],
        this.fileList= [],
        this.tableData= [],
        this.initData();
        window.reload();
      } else {
        this.$message({
          message: res.simpleJsonResult.message,
          type: "error"
        });
      }
    }
  },
  created() {
    console.log("store", this.$store);
  }
};
</script>
<style lang="less" scoped>
a {
  color: #409eff;
}
.bigBox {
  margin:0 40px;

  .smlBox {
    padding: 20px;
    background-color: #fff;
    margin: 20px 0;
    .tit {
      font-size: 14px;
      color:#666;
      font-weight:bold;
    }
    .block {
      padding: 10px 0;
    }
    .el-button {
      margin: 0 20px;
    }
    .upload-demo {
      display: block;
    }
  }
}
</style>