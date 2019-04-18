<template>
  <div>
    <head-top></head-top>

      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" style="background:#fff;margin:20px;padding:20px 0;">
        <el-form-item label="用户名" prop="name" :label-width="formLabelWidth">
          <el-col :span="8" >
           &nbsp;{{getUsername()}}
          </el-col>
        </el-form-item>
        <el-form-item label="当前密码" prop="pass" :label-width="formLabelWidth">
          <el-col :span="8">
            <el-input v-model="ruleForm.pass" placeholder="请输入原密码" type="password"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="新密码" prop="newpass" :label-width="formLabelWidth">
          <el-col :span="8">
            <el-input v-model="ruleForm.newpass" placeholder="请输入新密码" id="newkey" type="password"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checknewpass" :label-width="formLabelWidth">
          <el-col :span="8">
            <el-input
              v-model="ruleForm.checknewpass"
              placeholder="请再次输入新密码"
              type="password"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item >
              <el-button type="primary" @click="submitForm('ruleFormRef')" size="mini" plain style="margin-left:380px;">保存</el-button>
              <el-button type="primary" @click="onCancel" size="mini" plain style="margin-left:50px;" >取消</el-button>


        </el-form-item>
      </el-form>


  </div>
</template>


<script>
import headTop from "../components/headTop";
import { mapState } from "vuex";
import { setStore, removeStore, getStore } from "@/config/mUtils";
import { baseUrl } from "../config/env";
import {
  modifyPassWord
} from "@/api/getData";
export default {
  data() {
     var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newpass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formLabelWidth:'300px',
      ruleForm:{
        pass:'',
        newpass:'',
        checknewpass:''
      },
      rules: {
        pass: [{ required: true, message: "请输入密码" }],
        newpass: [{ required: true, message: "请输入新密码" }],
        checknewpass: [
          { required: true, trigger: "blur", validator: validatePass2 }
        ]
      }
    };
  },
  components: {
    headTop
  },
  methods: {
    getUsername(){
        var name=getStore("loginName");
        return name;
    },
    onCancel(){
      this.$router.history.go(-1)
    },
    async submitForm(ref){
      const res=await modifyPassWord({
        token: this.$store.state.token,
        oldPwd:this.ruleForm.pass,
        newPwd:this.ruleForm.newpass
      })
      console.log('update pwd',res)
      if(res.code=='0'){
          this.$message.success(res.message)
          this.$router.push('/')
      }else{
        this.$message.error(res.message)
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
