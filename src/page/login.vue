<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
          @keyup.enter.native="submitForm('loginForm')"
        >
          <p>
            <img src="../assets/img/logo.png" alt>
          </p>
          <p style="margin:10px 0;font-size:20px;">供应商后台系统</p>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名">
              <span></span>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
          </el-form-item>
          <div class="ifpwd" v-if="isPwd">
            <div class="l">
              <el-checkbox v-model="checked">记住密码</el-checkbox>
            </div>
            <div class="r">
              <a href="#">忘记密码</a>
            </div>
          </div>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('loginForm')"
              @keyup.native.enter="submitForm('loginForm')"
              class="submit_btn"

            ><span class="login">登 录</span> </el-button>
          </el-form-item>
          <div class="ifpwd" v-if="isPwd">
            <div class="b">
              还没有账号？
              <a href="#">点我注册</a>
            </div>
          </div>
        </el-form>
      </section>
    </transition>
  </div>
</template>

<script>
import { login } from "@/api/getData";
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import {setStore,getStore} from "@/config/mUtils"
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      showLogin: false,
      isPwd: false
    };
  },
  mounted() {
    this.showLogin = true;


  },
  created(){
    var password=getStore('password');
      var username= getStore('username');
      this. loginForm.username=username;
      this. loginForm.password=password;

  },
  computed: {

  },
  methods: {

    async submitForm(formName) {
      var that = this;
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const res = await login({
            username: this.loginForm.username,
            password: this.loginForm.password
          });
          console.log("res-->", res);
          that.$store.state.isLogin = true;
          that.$store.state.token = res.result.token;
          setStore('token',res.result.token);
          setStore('loginName',res.result.loginName);

          this.fullscreenLoading = true;
          if (res && res.code == "0") {
             setStore('password',this.loginForm.password);
             setStore('username',this.loginForm.username);
            this.fullscreenLoading = false;
             this.$router.push({ path: "/home" });
            this.$message({
              message:res.message,
              type: "success"
            });
          } else if (res && res.code == "1") {
            this.fullscreenLoading = false;
            this.$message.error(res.message);
          }else{
            this.$message.error('服务器未连接...');
          }
        } else {
          this.$message({
            message: "请输入用户名密码！",
            type: "warning"
          });
        }
      });
    }
  }

};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.login_page {
  background: url("../assets/img/loginbg.png") center center no-repeat;
  background-size: cover;
}
.manage_tip {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  p {
    font-size: 34px;
    color: #fff;
  }
}
.form_contianer {
  .wh(350px,auto);
  .ctr(400px, 300px);
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
  .submit_btn {
    width: 100%;
    font-size: 16px;
    .login{
      color:#fff;
    }

  }
}
.tip {
  font-size: 12px;
  color: red;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
.ifpwd {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
  .l {
    flex: 1;
    text-align: left;
  }
  .r {
    flex: 1;
    text-align: right;
    a {
      font-size: 14px;
    }
  }
  .b {
    text-align: center;
  }
}
</style>
