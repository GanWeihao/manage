<template>
  <div id="home">
    <div id="login">
      <el-form class="login_form" :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
        <el-form-item label style="margin-bottom: 35px">
          <p style="font-size: 20px;margin-bottom: 10px;">管理员账号</p>
          <el-input style="width: 300px;font-size: 14px;" v-model="formLabelAlign.adminName"></el-input>
        </el-form-item>
        <el-form-item label style="margin-bottom: 15px">
          <p style="font-size: 20px;margin-bottom: 10px;">密码</p>
          <el-input style="width: 300px;font-size: 14px;" v-model="formLabelAlign.adminPassword"
                    show-password></el-input>
        </el-form-item>
      </el-form>
      <el-button class="login_btn" type="success" @click="submitForm()" round>登录</el-button>
    </div>
  </div>
</template>

<script>
  // var url = "http://localhost:8080";

  var url = "http://182.61.12.214:9090";
  export default {
    name: 'Home',
    data() {
      return {
        labelPosition: 'top',
        formLabelAlign: {
          adminName: "",
          adminPassword: ""
        }
      };
    },
    methods: {
      submitForm() {
        if (this.formLabelAlign.adminName == "" || this.formLabelAlign.adminName == null) {
          this.$alert('管理员账号不能空着哦！', '注意！', {
            confirmButtonText: '确定',
          });
        } else if (this.formLabelAlign.adminPassword == "" || this.formLabelAlign.adminPassword == null) {
          this.$alert('管理员密码不能空着哦！', '注意！', {
            confirmButtonText: '确定',
          });
        } else {
          let params = this.$qs.stringify({
            adminName: this.formLabelAlign.adminName,
            adminPassword: this.formLabelAlign.adminPassword
          });
          this.$axios
            .post(url + "/admin/login", params)
            .then(res => {
              if (res.data.status == 200) {
                this.$store.dispatch("login", res.data.data.adminId)
                this.$router.push({
                  name: 'index'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '账号或密码错误'
                });
              }
            })
            .catch(function () {
              this.$message({
                type: 'error',
                message: '登录异常'
              });
            });
        }
      }
    }
  }
</script>

<style>
  #home {
    display: flex;
    position: absolute;
    border-radius: 0px;
    width: 100%;
    height: 100%;
    padding: 0px ;
    margin: 0px 0px 0px 0px ;

    background-image: url("https://desk-fd.zol-img.com.cn/t_s1920x1080c5/g2/M00/05/00/ChMlWl0_rymIfKpSABGAMt-GOeYAAMNiQHQOdIAEYBK594.jpg");
  }

  #login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font: 20px/1.4 "Helvetica Neue", "HelveticaNeue", Helvetica, Arial, sans-serif;
    position: absolute;
    top: 20%;
    left: 38%;
    background: rgba(255, 255, 255, 0.75);
    border-radius: 6px;
    width: 450px;
    height: 400px;
    padding: 0px !important;
    margin: 0px 0px 0px 0px !important;
    background-position: center 50%;
  }

  .login_form {
    display: flex;
    flex-direction: column;
  }

  .login_btn {
    font-size: 14px;
    background-color: red;
    height: 40px;
    width: 250px;
    margin-top: 30px;
    border-radius: 30px;
  }
</style>
