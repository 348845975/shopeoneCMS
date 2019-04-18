<template>
  <div class="bigBox">
    <head-top></head-top>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      style="overflow:hidden"
    >
      <el-steps :active="1" style="width:50%;margin:50px auto;">
        <el-step title="第一步：" description="选择发布方式"></el-step>
        <el-step title="第二步：" description="填写商品信息"></el-step>
        <el-step title="第三步：" description="提交等待审核"></el-step>
      </el-steps>
      <div class="smlBox">
        <p class="alltitle">第一步：请选择商品类目</p>
        <div class="block">
          <span class="demonstration">选择类目</span>
          <el-cascader
            expand-trigger="hover"
            :options="cateOptions"
            v-model="selectedCate"
            @change="handleChange"
            size="mini"
          ></el-cascader>
        </div>
      </div>
      <div class="smlBox">
        <p class="alltitle">第二步：填写商品信息</p>

        <p class="secTit">基本信息:</p>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="ruleForm.name" style="width:40%" size="mini" @change="isFollow"></el-input>&nbsp;&nbsp;
          <span v-if="hint">
            该商品已存在，请您进行
            <router-link :to="{path:'/followgoods',query:{name:ruleForm.name}}">跟卖</router-link>
          </span>
        </el-form-item>
        <el-form-item label="商品品牌" prop="brandId">
          <el-select v-model="ruleForm.brandId" placeholder="请选择" size="mini">
            <el-option
              :label="item.brandName"
              :value="item.id"
              v-for="item in brand"
              :key="item.id"
            ></el-option>
          </el-select>
          <span>或</span>
          <el-button size="mini">
            <i class="el-icon-plus"></i> 添加品牌
          </el-button>
        </el-form-item>
        <el-form-item label="图片" prop="public">
          <el-upload
            ref="upload1"
            :action="httpUrl"
            name="file"
            list-type="picture-card"
            :on-error="handleError"
            :on-preview="handlePreview"
            :on-success="handleSuccess"
            :data="data"
            :on-remove="handleRemove"
            :file-list="file"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </el-form-item>
        <el-form-item label="海关HS码" prop="hsCode">
          <el-input v-model="ruleForm.hsCode" style="width:40%" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="适用性别" prop="fixSex">
          <el-radio-group v-model="ruleForm.fixSex">
            <el-radio :label="'0'">通用</el-radio>
            <el-radio :label="'1'">男</el-radio>
            <el-radio :label="'2'">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <p class="secTit" v-if="saleAttribute.length">销售属性:</p>
        <div v-if="saleAttribute.length" class="baseBorder">
          <el-form-item
            v-for="(item1,index) in saleAttribute"
            :key="item1.id"
            :label="item1.name+':'"
            prop="name"
          >
            <el-checkbox-group v-model="item1.form" @change="refreshProductSkuList">
              <span
                v-for="(item2,i) in item1.pAttributeOptionsList"
                :key="item2.id"
                style="margin-right:10px;"
              >
                <el-checkbox
                  class="checkBox"
                  style="margin-right:5px;display:inline-block;"
                  :label="item2.id"
                >{{item2.name}}</el-checkbox>
              </span>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div class="skutable">
          <div class="wh-foot">
            <span class="label">批量设置：</span>
            <ul class="set-list" v-if="isSetListShow">
              <li class="set-item">
                <el-button
                  style="margin:0"
                  @click="openBatch('barCode')"
                  type="primary"
                  size="mini"
                  plain
                >供应商条码</el-button>
              </li>
              <li class="set-item">
                <el-button
                  style="margin:0"
                  @click="openBatch('tagPrice')"
                  type="primary"
                  size="mini"
                  plain
                >吊牌价格</el-button>
              </li>
              <li class="set-item">
                <el-button
                  style="margin:0"
                  @click="openBatch('supplyPrice')"
                  type="primary"
                  size="mini"
                  plain
                >供应价</el-button>
              </li>
              <li class="set-item">
                <el-button
                  style="margin:0"
                  @click="openBatch('stock')"
                  type="primary"
                  size="mini"
                  plain
                >库存</el-button>
              </li>
            </ul>
            <div class="set-form" v-else>
              <el-input size="mini" v-model="batchValue" placeholder="输入要设置的数量"></el-input>
              <i class="set-btn blue el-icon-check" @click="setBatch"></i>
              <i class="set-btn red el-icon-close" @click="cancelBatch"></i>
            </div>
          </div>
          <el-table
            class="newtable"
            style="width: 100%;margin-top: 20px"
            :data="ruleForm.sku"
            border
          >
            <el-table-column
              v-for="(item,index) in saleAttribute"
              :label="item.name"
              :key="item.id"
              align="center"
            >
              <template slot-scope="scope">{{getProductSkuSp(scope.row,index)}}</template>
            </el-table-column>
            <el-table-column label="供应商条码" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.barCode"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="吊牌价格" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.tagPrice"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="供应价格" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.supplyPrice"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="库存" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.stock"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="SKU图片" align="center" prop="skuImgList" width="300">
              <template slot-scope="scope">
                <div style="inline-block" @click="clickPic(scope.$index, scope.row)">
                  <el-upload
                    class="upload-demo"
                    :action="httpUrl"
                    :on-success="handleSuccessColor"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleSmlRemove"
                    :data="data"
                    :limit="8"
                    list-type="picture-card"
                    :file-list="scope.row.skuImgList"
                    :multiple="true"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="handleRemoveProductSku(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="secTit" v-if="secAttribute.length">分类属性：</p>
        <el-form-item
          :label="item.name"
          v-for="item in secAttribute"
          :key="item.id"
          :value="item.id"
          prop="name"
          style="width:40%;float:left"
        >
          <el-input v-model="item.form" v-if="item.pAttributeOptionsList.length==0" size="mini" style="width:300px"></el-input>
          <el-select
            v-if="item.pAttributeOptionsList.length>0"
            v-model="item.form"
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="it in item.pAttributeOptionsList"
              :key="it.id"
              :label="it.name"
              :value="it.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <p style="clear:both">
          商品特殊说明：
          <el-input
            v-model="ruleForm.description"
            style="width:40%;"
            placeholder="尺码差别，色差等，您需要特殊说明的内容"
            size="mini"
          ></el-input>
        </p>
        <p>
          商品详情描述：
          <!-- 图片上传组件辅助-->
          <el-upload
            ref="upload"
            class="avatar-uploader"
            :action="httpUrl"
            name="file"
            :data="data"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload"
            id="quill-upload"
          ></el-upload>
          <el-row v-loading="quillUpdateImg">
            <quill-editor
              v-model="ruleForm.details"
              ref="myQuillEditor"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
              style="width:1000px;"
            ></quill-editor>
          </el-row>
        </p>

        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="mini" plain>保存</el-button>
          <el-button @click="submitPlus" size="mini" plain>取消</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import { baseUrl } from "../config/env";
import data from "./datas.json";
import {
  getCategory,
  getBrandAndAttribute,
  addOneProduct,
  updateProduct,
  deleteSkuMerForStatus,
  existToSell
} from "@/api/getData";
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import headTop from "@/components/headTop";
import diaLog from "@/components/dialog";
// import * as Quill from 'quill'  //引入编辑器
import resizeImage from "quill-image-resize-module"; // 调整大小组件。
import { setTimeout } from "timers";
Quill.register("modules/resizeImage ", resizeImage);
// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  // [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ align: [] }],
  ["image"],
  ["clean"] // remove formatting button
];
const defaultProductAttr = {
  hsCode: "",
  spuImg: "",
  brandId: "",
  name: "",
  category1Id: "",
  category2Id: "",
  description: "",
  secondAttribute: [],
  fixSex: "",
  sku: [],
  details: ""
};
export default {
  components: {
    headTop
  },
  data() {
    return {
      sure:true,
      hint: false,
      index: null,
      cateOptions: [],
      selectedCate: [],
      fileList: [],
      file: [], //仅为spu缩略图展示
      fileListColor: [],
      skufile: {}, //仅为sku缩略图展示
      saleAttribute: [],
      ruleForm: {
        hsCode: "",
        spuImg: "",
        brandId: "",
        name: "",
        category2Id: "",
        category1Id: "",
        description: "",
        secondAttribute: [],
        fixSex: "",
        sku: [],
        details: null, //富文本编辑器内容
        description: ""
      },
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        brandId: [{ required: true, message: "请选择商品品牌", trigger: "change" }],
        hsCode: [{ required: true, message: "请输入海关HS码", trigger: "blur" }],
        fixSex: [{ required: true, message: "请选择适用性别", trigger: "blur" }],
        public: [{ required: true, message: "参数不能为空", trigger: "blur" }],
      },
      httpUrl: "",
      data: {
        token: ""
      },
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      // serverUrl: '',  // 这里写你要上传的图片服务器地址
      editorOption: {
        modules: {
          imageResize: {
            //调整大小组件。
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white"
            },
            modules: ["Resize", "DisplaySize", "Toolbar"]
          },
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector("#quill-upload input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      },
      brand: [],
      secAttribute: [],
      input: "",
      specification: [{}],
      // 子规格
      // 用来存储要添加的规格属性
      addValues: [],
      // 默认商品编号
      defaultProductNo: "PRODUCTNO_",
      // 批量设置相关
      isSetListShow: true,
      batchValue: "", // 批量设置所绑定的值
      currentType: "", // 要批量设置的类型
      str: "",
      skuImgList: [],
      skuCodeList: [],
      flag: false,
      editSkuCode: "", //从编辑跳转过来的skucode
      editTxt: {},
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  computed: {},
  created() {
    if (this.$route.query) {
      this.editSkuCode = this.$route.query.skuCode;
      this.updateProduct();
    }
  },
  watch: {
    $route: {
      handler(val, oldval) {
        if (this.$route.query) {
          console.log("val", this.$route.query.skuCode);
          if (this.$route.query.skuCode) {
            this.editSkuCode = this.$route.query.skuCode;
            this.updateProduct();
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.httpUrl = baseUrl + "/product/headImgUpload";
    this.data.token = this.$store.state.token;
    this.initData();
  },
  beforeRouteLeave(to, from, next) {
    if (this.sure) {
      this.$confirm("确认关闭？关闭后该页面数据将消失？")
        .then(_ => {
          next();
        })
        .catch(_ => {
          return fasle;
        });
      console.log("你要离开吗");
    }else{
      next()
    }
  },
  destroyed() {
    console.log("你已离开");
  },
  methods: {
    submitPlus() {
      this.$router("/mygoods");
    },
    async updateProduct() {
      const res = await updateProduct({
        token: this.$store.state.token,
        skuCode: this.editSkuCode
      });

      if (res.simpleJsonResult.code == "0") {
        this.editTxt = JSON.parse(
          JSON.stringify(res.simpleJsonResult.result.resultMap)
        );
        console.log("eee", this.editTxt);
        this.editTxt.sku.forEach(e => {
          this.skuCodeList.push(e.skuCode);
        });
      }
    },
    async initData() {
      //获取树级分类
      const category = await getCategory({ token: this.$store.state.token });
      this.cateOptions = category.simpleJsonResult.result.data;
      this.editInitData();
    },
    async editInitData() {
      //获取值

      const attribute = await getBrandAndAttribute({
        token: this.$store.state.token,
        // categoryId: this.ruleForm.category2Id
        categoryId: "1"
      });
      if (attribute) {
        var res = attribute.simpleJsonResult.result.data;
        this.saleAttribute = res.saleAttribute;
        this.brand = res.brand;
        this.ruleForm.category1Id = this.editTxt.category1Id;
        this.ruleForm.category2Id = this.editTxt.category2Id;
        this.secAttribute = res.secondAttribute;
        this.ruleForm.name = this.editTxt.name;
        this.ruleForm.brandId = this.editTxt.brandId;
        this.ruleForm.hsCode = this.editTxt.hsCode;
        this.ruleForm.fixSex = this.editTxt.fixSex;
        this.ruleForm.description = this.editTxt.description;
        this.ruleForm.details = this.editTxt.details;
        this.ruleForm.sku = JSON.parse(JSON.stringify(this.editTxt.sku));
        this.selectedCate.push(this.editTxt.category1Id);
        this.selectedCate.push(this.editTxt.category2Id);
        // 根据编辑原有的勾选生成sku --开始
        for (var i = 0; i < this.secAttribute.length; i++) {
          console.log(
            "this.editTxt",
            this.secAttribute,
            this.editTxt.secondAttribute
          );
          if (this.secAttribute[i].id)
            this.editTxt.secondAttribute.forEach(ele => {
              if (this.secAttribute[i].id == ele.secondAttributeId) {
                this.secAttribute[i].form = ele.secondAttributeValue;
              }
            });
        }
        var arrList = [],
          temp = [];
        for (var j = 0; j < this.editTxt.sku.length; j++) {
          arrList.push(this.editTxt.sku[j].saleOptionId);
        }
        arrList.forEach(ele => {
          ele.split(",").forEach(e => {
            temp.push(e);
          });
        });
        temp = Array.from(new Set(temp));
        console.log("temp", temp);
        temp.forEach(t => {
          this.saleAttribute.forEach(item => {
            item.pAttributeOptionsList.forEach(it => {
              if (t == it.id) {
                item.form.push(it.id);
              }
            });
          });
        });
        this.editTxt.spuImg.split(",").forEach(item => {
          this.fileList.push(item);
          var obj = {};
          let index = item.lastIndexOf("/");
          let fileName = item.substring(index + 1, item.length); //最后的文件名截取出来
          this.$set(obj, "name", fileName);
          this.$set(obj, "url", item); //修改files里面的结构（name,url）
          this.file.push(obj);
        });
      }

      // 根据编辑原有的勾选生成sku --结束
      // this.ruleForm.sku=JSON.parse(JSON.stringify(this.editTxt.sku)) ;
      console.log("this.ruleForm.sku", this.ruleForm.sku);
    },
    async onSubmit() {
       this.sure = false;
      console.log("this.skuCodeList", this.skuCodeList.join(","));
      this.secAttribute.forEach(ele => {
        if (ele.pAttributeOptionsList.length == 0) {
          ele.obj.secondAttributeId = ele.id;
          ele.obj.secondAttributeValue = ele.form;
          ele.obj.secondAttributenType = "text";
        } else if (ele.pAttributeOptionsList.length > 0) {
          ele.obj.secondAttributeId = ele.id;
          ele.obj.secondAttributeValue = ele.form;
          ele.obj.secondAttributenType = "option";
        }
        this.ruleForm.secondAttribute.push(ele.obj);
      });
      this.ruleForm.spuImg = this.fileList.join(",");
      const delRes = await deleteSkuMerForStatus({
        token: this.$store.state.token,
        skuCode: this.skuCodeList.join(",")
      });
      console.log("delRes", delRes);
      if (delRes.code == "0") {
        console.log("this.ruleForm", this.ruleForm);
        const res = await addOneProduct({
          hsCode: this.ruleForm.hsCode,
          spuImg: JSON.stringify(this.ruleForm.spuImg),
          brandId: this.ruleForm.brandId,
          name: this.ruleForm.name,
          category2Id: this.ruleForm.category2Id,
          category1Id: this.ruleForm.category1Id,
          secondAttribute: JSON.stringify(this.ruleForm.secondAttribute),
          fixSex: this.ruleForm.fixSex,
          sku: JSON.stringify(this.ruleForm.sku),
          details: this.ruleForm.details,
          description: this.ruleForm.description,
          token: this.$store.state.token
        });
        if (res.simpleJsonResult && res.simpleJsonResult.code == "0") {
          this.$message.success(res.simpleJsonResult.message);
          this.$router.push("/mygoods");
        } else {
          this.$message.success(res.simpleJsonResult.message);
        }
      } else {
        this.$message.error(res.message);
      }
    },
    handleRemoveProductSku(index) {
      this.ruleForm.sku.splice(index, 1);
    },
    handleSuccess(res, file, fileList) {
      if (res) {
        this.fileList.push(res.result.url);
      }
      console.log("fileLIst文件", this.fileList, this.ruleForm.spuImg);
    },
    handleError(err, file, fileLis) {
      this.$message.error("图片上传失败！");
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      for (var i = 0; i < this.fileList.length; i++) {
        if (file.url == this.fileList[i]) {
          this.fileList.splice(i, 1);
        }
      }
      console.log(this.fileList);
    },
    handleProgress(file) {
      console.log("file文件上传", file);
    },
    handleExceed(files, fileList) {
      this.$message.warning("主图仅能上传 1 张");
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async handleChange(value) {
      console.log(value);
      this.ruleForm.category1Id = value[0];
      this.ruleForm.category2Id = value[1];
      const attribute = await getBrandAndAttribute({
        token: this.$store.state.token,
        // categoryId: this.ruleForm.category2Id
        categoryId: "1"
      });
      if (attribute) {
        var res = attribute.simpleJsonResult.result.data;
        this.saleAttribute = res.saleAttribute;
        this.brand = res.brand;
        this.secAttribute = res.secondAttribute;
      }
    },
    onEditorBlur(quill) {
      console.log("editor blur!", quill);
    },
    onEditorFocus(quill) {
      console.log("editor focus!", quill);
    },
    onEditorReady(quill) {
      console.log("editor ready!", quill);
    },
    onEditorChange({ quill, html, text }) {
      console.log("editor change!", quill, html, text);
      this.ruleForm.details = html;
    },
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    clickPic(index, row) {
      console.log("index", index);
      this.index = index;
    },
    handleSmlRemove(file, fileList) {
      console.log("shan前", this.index);
      for (
        var i = 0;
        i < this.ruleForm.sku[this.index].skuImgList.length;
        i++
      ) {
        if (file.url == this.ruleForm.sku[this.index].skuImgList[i].url) {
          console.log("----我要闪了");
          this.ruleForm.sku[this.index].skuImgList.splice(i, 1);
        }
      }
      console.log("shan", this.ruleForm.sku);
    },
    handleSuccessColor(res, file, fileList) {
      if (res.code == "0") {
        let obj = {};
        obj.name = "mockName";
        obj.url = res.result.url;
        if (!this.ruleForm.sku[this.index].skuImgList) {
          this.ruleForm.sku[this.index].skuImgList = [];
        }
        this.ruleForm.sku[this.index].skuImgList.push(obj);
        this.ruleForm.sku = Object.assign([], this.ruleForm.sku);
        console.log(" this.ruleForm.sku", this.ruleForm.sku);
      } else if (res.code == "1") {
        this.$message.error(res.message);
      }
    },
    upLoadImg(event, n, i) {
      this.str = n;
      console.log("event---", this.str);
    },
    uploadSuccess(res, file) {
      console.log("res", res);
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.code === "0" && res.result.url !== null) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片 res.result.url为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.result.url);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },
    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false;
      this.$message.error("图片插入失败");
    },
    // 添加规格项目
    addSpec() {
      if (this.saleAttribute.length < 5) {
        this.saleAttribute.push({
          name: "",
          pAttributeOptionsList: []
        });
      }
    },
    // 监听规格启用操作
    handleUserChange(index, value) {
      // 启用规格时，生成不重复的商品编号；关闭规格时，清空商品编号
      if (value) {
        let No = this.makeProductNoNotRepet(index);
        this.$set(this.ruleForm.sku[index], "childProductNo", No);
      } else {
        this.$set(this.ruleForm.sku[index], "childProductNo", "");
      }
    },
    // 监听商品编号的blur事件
    handleNo(index, attr) {
      // 1.当用户输入完商品编号时，判断是否重复，如有重复，则提示客户并自动修改为不重复的商品编号
      const value = this.ruleForm.sku[index].childProductNo;
      let isRepet;
      this.sku.forEach((item, i) => {
        if (item.childProductNo === value && i !== index) {
          isRepet = true;
        }
      });
      if (isRepet) {
        this.$message({
          type: "warning",
          message: "不允许输入重复的商品编号"
        });
        this.$set(
          this.ruleForm.sku[index],
          "childProductNo",
          this.makeProductNoNotRepet(index)
        );
      }
    },
    // 打开设置框
    openBatch(type) {
      this.currentType = type;
      this.isSetListShow = false;
    },
    // 批量设置
    setBatch() {
      let regDouble=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
      let regInt=/^([1-9][0-9]*)$/;
      if(this.currentType === 'tagPrice') {
        // 吊牌价格
        if(!regDouble.test(this.batchValue)) {
          this.$message({
            type: "warning",
            message: "请输入正确的吊牌价格"
          });
          return;
        }
      } else if (this.currentType === 'stock') {
        // 库存
        if(!regInt.test(this.batchValue)) {
          this.$message({
            type: "warning",
            message: "请输入正确的库存值"
          });
          return;
        }
      } else if (this.currentType === 'supplyPrice') {
        // 供应价
        if(!regDouble.test(this.batchValue)) {
          this.$message({
            type: "warning",
            message: "请输入正确的供应价"
          });
          return;
        }
      }
      this.ruleForm.sku.forEach(item => {
        item[this.currentType] = this.batchValue;
      });
      this.cancelBatch();
    },
    // 取消批量设置
    cancelBatch() {
      this.batchValue = "";
      this.currentType = "";
      this.isSetListShow = true;
    },
    refreshProductSkuList() {
      console.log("--->", this.saleAttribute);
      let skuList = this.ruleForm.sku;
      let saleOptionId = [];
      let skuListTmp = [];
      //只有一个属性时
      if (this.saleAttribute.length === 1) {
        let values = this.saleAttribute[0].form;
        for (let i = 0; i < values.length; i++) {

          skuListTmp.push({ saleOptionId: values[i] });
        }
      } else if (this.saleAttribute.length === 2) {
        let values0 = this.saleAttribute[0].form;
        let values1 = this.saleAttribute[1].form;
        for (let i = 0; i < values0.length; i++) {
          if (values1.length === 0) {
            saleOptionId.push(values0[i]);
            skuListTmp.push({ saleOptionId: values0[i] });
            continue;
          }
          for (let j = 0; j < values1.length; j++) {
            skuListTmp.push({ saleOptionId: values0[i] + "," + values1[j] });
          }
        }
      } else if (this.saleAttribute.length === 3) {
        let values0 = this.saleAttribute[0].form;
        let values1 = this.saleAttribute[1].form;
        let values2 = this.saleAttribute[2].form;
        for (let i = 0; i < values0.length; i++) {
          if (values1.length === 0) {
            skuListTmp.push({ saleOptionId: values0[i] });
            continue;
          }
          for (let j = 0; j < values1.length; j++) {
            if (values2.length === 0) {
              skuListTmp.push({ saleOptionId: values0[i] + "," + values1[j] });
              continue;
            }
            for (let k = 0; k < values2.length; k++) {
              skuListTmp.push({
                saleOptionId: values0[i] + "," + values1[j] + "," + values2[k]
              });
            }
          }
        }
      } else {
        let values0 = this.saleAttribute[0].form;
        let values1 = this.saleAttribute[1].form;
        let values2 = this.saleAttribute[2].form;
        let values3 = this.saleAttribute[3].form;
        for (let i = 0; i < values0.length; i++) {
          if (values1.length === 0) {
            skuListTmp.push({ saleOptionId: values0[i] });
            continue;
          }
          for (let j = 0; j < values1.length; j++) {
            if (values2.length === 0) {

              skuListTmp.push({ saleOptionId: values0[i] + "," + values1[j] });
              continue;
            }
            for (let k = 0; k < values2.length; k++) {

              if (values3.length === 0) {
                skuListTmp.push({
                  saleOptionId: values0[i] + "," + values1[j] + "," + values2[k]
                });
                continue;
              }
              for (let l = 0; l < values3.length; l++) {
                skuListTmp.push({
                  saleOptionId:
                    values0[i] +
                    "," +
                    values1[j] +
                    "," +
                    values2[k] +
                    "," +
                    values3[l]
                });
              }
            }
          }
        }
      }

      for (let i = 0; i < skuList.length; i++) {
        for (let j = 0; j < skuListTmp.length; j++) {
          if (skuList[i]["saleOptionId"] === skuListTmp[j]["saleOptionId"]) {
            skuListTmp[j] = skuList[i];
            continue;
          }
        }
      }

      this.ruleForm.sku = skuListTmp;
    },
    getProductSkuSp(row, index) {
      var a;
      var arr = row.saleOptionId.split(",");
      this.saleAttribute.forEach(ele => {
        ele.pAttributeOptionsList.forEach(e => {
          if (e.id == arr[index]) {
            a = e.name;
          }
        });
      });
      return a;
    },
    //删除表格行
    deleteRow(index, rows) {
      console.log(1111);
      rows.splice(index, 1);
      console.log(rows);
      //  rows.splice(index,1);
    },
    async isFollow() {
      const res = await existToSell({
        token: this.$store.state.token,
        name: this.ruleForm.name
      });
      console.log("res", res);
      if (res.simpleJsonResult.code == "0") {
        if (res.simpleJsonResult.result.exist == "1") {
          this.hint = true;
        } else if (res.simpleJsonResult.result.exist == "0") {
          this.hint = false;
        }
      }
    }
  }
};
</script>
<style lang="less" >
a {
  color: #409eff;
}
.bigBox {
  margin: 0 40px;
  .smlBox {
    padding: 20px;
    background-color: #fff;
    margin: 10px 0;
    .tit {
      font-size: 18px;
    }
    .block {
      padding: 10px 0;
    }
    .el-button {
      margin: 0 20px;
    }
  }
}
.el-upload-list {
  width: 150px !important;
}
.el-icon-zoom-in,
.el-icon-delete {
  color: #4775e4;
  font-size: 25px;
}

.alltitle {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}
.demonstration {
  display: inline-block;
  width: 100px;
  font-size: 14px;
  text-align: right;
}
ul {
  font-size: 30px !important;
}
.checkBox .el-upload-list__item-name {
  display: none !important;
}
.checkBox .el-upload-list__item-thumbnail {
  width: 110px !important;
}
.newtable .el-upload--picture-card {
  width: 50px !important;
  height: 50px !important;
  line-height: 50px !important;
  i {
    font-size: 22px !important;
  }
}
.newtable .el-upload-list__item {
  width: 50px !important;
  height: 50px !important;
}
.newtable .el-icon-zoom-in,
.newtable .el-icon-delete {
  color: #fff !important;
  font-size: 10px !important;
}
.priPic .el-icon-zoom-in,
.priPic .el-icon-delete {
  color: #fff !important;
  font-size: 30px;
}
.secTit {
  margin: 10px 0;
  font-size: 14px;
}
.baseBorder {
  background: #f8f9fc;
  box-sizing: border-box;
  width: 1000px;
  padding: 0 20px;
  margin: 20px 0;
  border-radius: 5px;
  border: 1px solid #ebeef5;
}
.skutable {
  background: #f8f9fc;
  box-sizing: border-box;
  width: 1000px;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #ebeef5;
}
.wh-foot {
  line-height: 30px;
  .label {
    display: inline-block;
    vertical-align: top;
  }
  .set-list {
    display: inline-block;
    vertical-align: top;
    font-size: 0;
    .set-item {
      display: inline-block;
      vertical-align: top;
      margin-left: 15px;
      font-size: 13px;
      cursor: pointer;
      color: #0088ee;
    }
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
  .right {
    float: right;
  }
  .text {
    font-size: 13px;
  }
}
.el-form-item__label {
  width: 150px !important;
}
</style>