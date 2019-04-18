<template>
  <div class="bigBox">
    <el-steps :active="1" style="width:50%;margin:50px auto;">
      <el-step title="第一步：" description="选择发布方式"></el-step>
      <el-step title="第二步：" description="填写商品信息"></el-step>
      <el-step title="第三步：" description="提交等待审核"></el-step>
    </el-steps>
    <div class="smlBox">
      <p class="alltitle">第一步：请选择商品类目，下载对应表格模板</p>
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
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        style="overflow:hidden"
      >
        <p style="margin:10px 0;">基本信息:</p>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="ruleForm.name" style="width:40%" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="商品品牌" prop="name">
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
        <el-form-item label="图片" prop="name">
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
            :limit="10"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </el-form-item>
        <el-form-item label="海关HS码" prop="name">
          <el-input v-model="ruleForm.hsCode" style="width:40%" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="适用性别" prop="name">
          <el-radio-group v-model="ruleForm.fixSex">
            <el-radio :label="'0'">通用</el-radio>
            <el-radio :label="'1'">男</el-radio>
            <el-radio :label="'2'">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <p style="margin:10px 0;" v-if="saleAttribute.length">销售属性:</p>
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
        <el-table class="newtable" style="width: 100%;margin-top: 20px" :data="ruleForm.sku" border>
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
        <p style="margin:10px 0;" v-if="secAttribute.length">分类属性：</p>
        <el-form-item
          :label="item.name"
          v-for="item in secAttribute"
          :key="item.id"
          :value="item.id"
          prop="name"
          style="width:40%;float:left"
        >
          <el-input v-model="item.form" v-if="item.pAttributeOptionsList.length==0" size="mini"></el-input>
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
            ></quill-editor>
          </el-row>
        </p>

        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="mini" plain>保存</el-button>
          <el-button @click="submitPlus">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { baseUrl } from "../config/env";
import data from "./datas.json";
import {
  getCategory,
  getBrandAndAttribute,
  addOneProduct,
  updateProduct
} from "@/api/getData";
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
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
  data() {
    return {
      index: null,
      cateOptions: [],
      selectedCate: [],
      fileList: [],
      file: [], //仅为spu缩略图展示
      fileListColor: [],
      skufile: {}, //仅为sku缩略图展示
      saleAttribute: [],
      ruleForm: {
        skuSaleImg: [],
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
        details: "<p>hello</p>", //富文本编辑器内容
        description: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        region: [{ required: true, message: "请选择", trigger: "change" }],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
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
      flag: false,
      editSkuCode: "", //从编辑跳转过来的skucode
      editTxt:{},
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  computed: {

  },
  created() {
    if (this.$route.query) {
      this.editSkuCode = this.$route.query.skuCode;
      this.updateProduct()
    }
  },
  watch: {
    $route: {
      handler(val, oldval) {
        if (this.$route.query) {
          console.log("val", this.$route.query.skuCode);
          if (this.$route.query.skuCode) {
            this.editSkuCode = this.$route.query.skuCode;
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initData()
    this.httpUrl = baseUrl + "/product/headImgUpload";
    this.data.token = this.$store.state.token;
  },
  methods: {
    submitPlus() {
      console.log(this.editTxt);
    },
    async updateProduct() {
      const res = await updateProduct({
        token: this.$store.state.token,
        skuCode: this.editSkuCode
      });

      if (res.simpleJsonResult.code == "0") {

        this.editTxt = JSON.parse(JSON.stringify(res.simpleJsonResult.result.resultMap));

      }
    },

    async initData() {//获取树级分类
      const category = await getCategory({ token: this.$store.state.token });
      this.cateOptions = category.simpleJsonResult.result.data;
      this.selectedCate.push(this.editTxt.category1Id);
      this.selectedCate.push(this.editTxt.category2Id);
      this.editInitData()
    },
    async editInitData() {//获取值
      this.ruleForm.category1Id = this.selectedCate[0];
      this.ruleForm.category2Id = this.selectedCate[1];
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
        this.ruleForm.name = this.editTxt.name;
        this.ruleForm.brandId = this.editTxt.brandId;
        this.ruleForm.hsCode = this.editTxt.hsCode;
        this.ruleForm.fixSex = this.editTxt.fixSex;
        this.ruleForm.description = this.editTxt.description;
        this.ruleForm.details = JSON.stringify(this.editTxt.details);
        // 根据编辑原有的勾选生成sku --开始
        for (var i = 0; i < this.secAttribute.length; i++) {
          //  console.log("this.editTxt",this.editTxt,'i',i,this.editTxt.secondAttribute[i].secondAttributeValue);
          // this.secAttribute[i].form = this.editTxt.secondAttribute[i][secondAttributeValue]
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
        for (var i = 0; i < this.editTxt.skuSaleImg.length; i++) {
          this.ruleForm.skuSaleImg.push(this.editTxt.skuSaleImg[i]);
          var obj = {};
          let index = this.editTxt.skuSaleImg[i].saleAttributeImg.lastIndexOf(
            "/"
          );
          let fileName = this.editTxt.skuSaleImg[i].saleAttributeImg.substring(
            index + 1,
            this.editTxt.skuSaleImg.length.length
          ); //最后的文件名截取出来
          this.$set(obj, "name", fileName);
          this.$set(obj, "url", this.editTxt.skuSaleImg[i].saleAttributeImg); //修改files里面的结构（name,url）
          var newid = this.editTxt.skuSaleImg[i].saleAttributeImgId;

          if (this.skufile[newid]) {
            this.skufile[newid].push(obj);
          } else {
            this.skufile[newid] = [];
            this.skufile[newid].push(obj);
          }
          console.log("this", this.skufile);
        }
      }
      //判断form是否为空 如果为空这应该调用动态生成表格
      for (var n = 0; n < this.saleAttribute.length; n++) {
        if (this.saleAttribute[n].form.length > 0) {
          // this.hrr(n);
        }
      }
      // 根据编辑原有的勾选生成sku --结束
      this.ruleForm.sku = this.editTxt.sku;
      console.log("this.ruleForm.sku", this.ruleForm.sku);
    },
    async onSubmit() {
      this.secAttribute.forEach(ele => {
        if (ele.pAttributeOptionsList.length == 0) {
          ele.obj.secondAttributeId = ele.id;
          // ele.obj.secondAttributeValue = ele.form;
          ele.obj.secondAttributenType = "text";
        } else if (ele.pAttributeOptionsList.length > 0) {
          ele.obj.secondAttributeId = ele.id;
          // ele.obj.secondAttributeValue = ele.form;
          ele.obj.secondAttributenType = "option";
        }
        this.ruleForm.secondAttribute.push(ele.obj);
      });
      this.ruleForm.spuImg = this.fileList.join(",");
      const res = await addOneProduct({
        skuSaleImg: JSON.stringify(this.ruleForm.skuSaleImg),
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
    handleRemoveColor(file, fileList) {
      for (var i = 0; i < this.ruleForm.skuSaleImg.length; i++) {
        if (file.url == this.ruleForm.skuSaleImg[i].saleAttributeImg) {
          this.ruleForm.skuSaleImg.splice(i, 1);
        }
      }
      console.log("this.ruleForm.skuSaleImg", this.ruleForm.skuSaleImg);
    },
    handleProgress(file) {
      console.log("file文件上传", file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
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
      console.log("res", res, "file", file, "fileList", fileList);
      this.fileList = [];

      if (res.code == "0") {
        var obj = {};
        if (this.ruleForm.sku[this.index].skuImgList) {
          obj.name = "mockName";
          obj.url = res.result.url;
          this.ruleForm.sku[this.index].skuImgList.push(obj);
        } else {
          this.ruleForm.sku[this.index].skuImgList = [];
          obj.name = "mockName";
          obj.url = res.result.url;
          this.ruleForm.sku[this.index].skuImgList.push(obj);
        }

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
      if (typeof this.batchValue === "string") {
        this.$message({
          type: "warning",
          message: "请输入正确的值"
        });
        return;
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
      this.ruleForm.sku = [];
      let skuList = this.ruleForm.sku;
      let saleOptionId = [];
      //只有一个属性时
      if (this.saleAttribute.length === 1) {
        let values = this.saleAttribute[0].form;
        for (let i = 0; i < values.length; i++) {
          // skuList.push({
          //   sp1: values[i]
          // });
          skuList.push({ saleOptionId: values[i] });
        }
      } else if (this.saleAttribute.length === 2) {
        let values0 = this.saleAttribute[0].form;
        let values1 = this.saleAttribute[1].form;
        for (let i = 0; i < values0.length; i++) {
          if (values1.length === 0) {
            saleOptionId.push(values0[i]);

            // skuList.push({
            //   sp1: values0[i]
            // });
            skuList.push({ saleOptionId: values0[i] });
            continue;
          }
          for (let j = 0; j < values1.length; j++) {
            // skuList.push({
            //   sp1: values0[i],
            //   sp2: values1[j]
            // });
            skuList.push({ saleOptionId: values0[i] + "," + values1[j] });
          }
        }
      } else {
        let values0 = this.saleAttribute[0].form;
        let values1 = this.saleAttribute[1].form;
        let values2 = this.saleAttribute[2].form;
        for (let i = 0; i < values0.length; i++) {
          if (values1.length === 0) {
            // skuList.push({
            //   sp1: values0[i]
            // });
            skuList.push({ saleOptionId: values0[i] });
            continue;
          }
          for (let j = 0; j < values1.length; j++) {
            if (values2.length === 0) {
              // skuList.push({
              //   sp1: values0[i],
              //   sp2: values1[j]
              // });
              skuList.push({ saleOptionId: values0[i] + "," + values1[j] });
              continue;
            }
            for (let k = 0; k < values2.length; k++) {
              // skuList.push({
              //   sp1: values0[i],
              //   sp2: values1[j],
              //   sp3: values2[k]
              // });
              skuList.push({
                saleOptionId: values0[i] + "," + values1[j] + "," + values2[k]
              });
            }
          }
        }
      }
    },
    getProductSkuSp(row, index) {
      var a;
      var arr = row.saleOptionId.split(",");
      if (index === 0) {
        //第一列

        this.saleAttribute.forEach(ele => {
          ele.pAttributeOptionsList.forEach(e => {
            if (e.id == arr[0]) {
              a = e.name;
            }
          });
        });
        return a;
      } else if (index === 1) {
        //第二列
        this.saleAttribute.forEach(ele => {
          ele.pAttributeOptionsList.forEach(e => {
            if (e.id == arr[1]) {
              a = e.name;
            }
          });
        });
        return a;
      } else {
        this.saleAttribute.forEach(ele => {
          ele.pAttributeOptionsList.forEach(e => {
            if (e.name == arr[2]) {
              a = e.id;
            }
          });
        });
        return a;
      }
    },
    //删除表格行
    deleteRow(index, rows) {
      console.log(1111);
      rows.splice(index, 1);
      console.log(rows);
      //  rows.splice(index,1);
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
</style>