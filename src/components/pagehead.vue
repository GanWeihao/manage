<template>
  <div id="pagehead">
    <div class="pagehead-welcome">
      <a class="welcome">欢迎来到TASTE管理系统</a>
    </div>
    <div class="pagehead-bg">
      <a class="username">
        {{admin.adminName}}
      </a>
      <a class="login_out" @click="removeSession">
        注销
        <i class="el-icon-s-release"></i>
      </a>
    </div>
  </div>
</template>

<script>
  var url = "http://114.116.238.138:9090"

  // var url = "http://106.13.207.98:8080/jurisdiction";
export default {
  name: 'pagehead',
  data(){
    return{
      adminId:"",
      admin:{}
    }
  },
  props: {
    msg: String
  },
  created(){
    this.init()
  },
  mounted(){
    this.$bus.$on('headChange', ()=> {
      this.init()
    })
  },
  methods: {

    init(){
      this.adminId = this.$store.state.loginAdminId;
      var param = this.$qs.stringify({
        adminId: this.adminId
      })
      this.$axios.post(url + "/admin/findbyid", param).then(res => {
        if (res.data.status == 200) {
          this.admin = res.data.data;
        }else{
          this.$message('查询管理员失败');
        }
      }).catch(error => {
        this.$message('查询管理员异常');
      })
    },
    removeSession:function () {
      this.$router.push({name: 'home'})
      window.localStorage.removeItem("adminId")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #pagehead{
    display: flex;
    flex-direction: row;
    margin: 0;
    padding: 0;
    width: 89%;
    height: 60px;
    background-color: #545c64;
  }

  .welcome{
    text-decoration: none;
    line-height: 60px;
    color: #fbffff;
    font-size: 32px;
    margin-right: 10px;
  }
  .pagehead-welcome{
    margin: auto;
  }
    .pagehead-bg{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      float: right;
      margin: 0;
    }
    .pagehead-bg img{
      margin-right: 10px;
      height: 50px;
      border-radius: 50%;
    }
    .username{
      text-decoration: none;
      line-height: 60px;
      color: cyan;
      font-size: 20px;
      margin-right: 10px;
    }
  .login_out{
    text-decoration: none;
    line-height: 60px;
    margin-right: 50px;
    font-size: 20px;
    color: white;
    cursor: pointer;
  }

</style>
