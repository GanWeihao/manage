<template>
  <div id="adduser">
    <div @click="uploadimg()" style="background-color: darkgray;width: 200px;height: 200px;border-radius: 50%;margin-bottom: 30px">
      <el-avatar :size="200" @error="errorHandler">
        <img :src="headimg"/>
      </el-avatar>
    </div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="用户昵称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="用户密码">
        <el-input v-model="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="form.telphone"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="是否禁用">
        <el-switch v-model="form.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="感兴趣的" style="align-items: center">
        <el-checkbox-group v-model="form.type">
          <el-checkbox v-for="(category,index) in categoryList" :key="index" :label="category.categoryId" :name="category.categoryId">{{category.categoryName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="clear">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="上传头像" width="338px" :visible.sync="dialogTableVisible">
      <Changeimg v-on:childByValue="childByValue"></Changeimg>
    </el-dialog>

  </div>
</template>

<script>
  import Changeimg from '../views/changeimg'
  var url = "http://114.116.238.138:9090"
    export default {
      name: "adduser",
      components:{
        Changeimg
      },
      data() {
        return {
          form: {
            name: '',
            password:'',
            telphone:'',
            email:'',
            delivery: false,
            type: []
          },
          dialogTableVisible: false,
          headimg:'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png',
          headimg_add:'',
          categoryList:[]
        }
      },
      created(){
        this.init();
      },
      methods: {
        init(){
          this.$axios.get(url + "/category/queryall")
            .then(res=>{
              if(res.data.status==200){
                  this.categoryList = res.data.data;
              }else{
                console.log("查询失败")
              }
            })
            .catch(res=>{
              console.log("查询异常")
            })
        },
        clear(){
          this.form = {
              name: '',
              password:'',
              telphone:'',
              email:'',
              delivery: false,
              type: []
          }
          this.headimg = 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png';
          this.headimg_add = ''
        },

        onSubmit() {
          console.log(this.form.type)
          var status = 0
          if(this.form.delivery==true){
            status = 1;
          }
          var param = this.$qs.stringify({
            userName:this.form.name,
            userPassword: this.form.password,
            userTelphone: this.form.telphone,
            userEmail: this.form.email,
            userStatus: status,
            userHeadurl: this.headimg_add
          })
          this.$axios.post(url + "/user/insert",param)
            .then(res=>{
              if(res.data.status==200){
                this.$message("创建成功")
                for(var i=0;i<this.form.type.length;i++){
                  this.$axios.get(url + "/usercategory/insert",{
                    params:{
                      userCategoryUserId: res.data.data,
                      userCategoryCategoryId: this.form.type[i]
                    }
                  })
                }
                this.clear();
              }else{
                this.$message("创建失败")
              }
            })
            .catch(res=>{
              console.log("创建异常")
            })
        },

        uploadimg(){
          this.dialogTableVisible = true
        },
        childByValue(childValue){
          console.log(childValue)
          this.headimg = "http://localhost:9090/file/"+childValue;
          this.headimg_add = childValue;
          this.dialogTableVisible = false
        },
        errorHandler(){
          return true
        }
      }
    }
</script>

<style>
 #adduser{
   width: 50%;
   margin: auto;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
 }
</style>
