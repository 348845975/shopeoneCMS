<template>
  <div>
    <el-upload
      :action="httpUrl"
      :data="data"
       list-type="picture-card"
      :multiple="false"
      :show-file-list="showFileList"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
    >
        <i class="el-icon-plus" @click="clickPic(scope.$index,scope.row)"></i>

    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt>
    </el-dialog>
  </div>
</template>
<script>
import { baseUrl } from "../config/env";

export default {
  name: "singleUpload",
  props: {
    value:String
  },
  computed: {
    imageUrl() {
      return this.value;
    },
    imageName() {
      if (this.value != null && this.value !== "") {
        return this.value.substr(this.value.lastIndexOf("/") + 1);
      } else {
        return null;
      }
    },
    fileList() {
      return [
        {
          name: this.imageName,
          url: this.imageUrl
        }
      ];
    },
    showFileList: {
      get: function() {
        return (
          this.value !== null && this.value !== "" && this.value !== undefined
        );
      },
      set: function(newValue) {}
    }
  },
  data() {
    return {
      data: {
        token: ""
      },
      dialogVisible: false,
      httpUrl: baseUrl + "/product/headImgUpload"
    };
  },
  mounted() {
    this.data.token = this.$store.state.token;
  },
  methods: {
    emitInput(val) {
      this.$emit("input", val);
    },
    handleRemove(file, fileList) {
      this.emitInput("");
    },
    handlePreview(file) {
      this.dialogVisible = true;
    },
    handleUploadSuccess(res, file) {
      this.showFileList = true;
      this.fileList.pop();
      if (res.code == "0") {
        var imgUrl = res.result.url;
        var imgName = file.name;
        this.fileList.push({ name: imgName, url: imgUrl });
      } else if (res.code == "1") {
        this.$message.error(res.message);
      }
      this.emitInput(this.fileList[0].url);
    }
  }
};
</script>
<style>
</style>


