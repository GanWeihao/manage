<template>
  <div id="setting">

    <div class="setting-table">
      <el-card class="box-card">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/index' }"><a @click="backindex">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item v-if="title!='' && title!='首页'">{{title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="zhanshi" v-if="title=='' || title=='首页'">
          <div class="col-xl-3 col-sm-6">
            <div class="item d-flex align-items-center">
              <div class="bg-violet bg1">
                <i class="el-icon-user"></i>
              </div>
              <div class="title">
                <span>User<br/>Number</span>
              </div>
              <div class="number">
                <strong>{{usernum}}</strong>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-sm-6">
            <div class="item d-flex align-items-center">
              <div class="bg-violet bg2">
                <i class="el-icon-tickets"></i>
              </div>
              <div class="title">
                <span>Article<br/>Number</span>
              </div>
              <div class="number">
                <strong>{{articlenum}}</strong>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-sm-6">
            <div class="d-flex align-items-center">
              <div class="bg-violet bg3">
                <i class="el-icon-video-camera"></i>
              </div>
              <div class="title">
                <span>Video<br/>Number</span>
              </div>
              <div class="number">
                <strong>{{videonum}}</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="table" v-if="title=='' || title=='首页'">
          <echarts></echarts>
          <echarts2></echarts2>
          <echarts1></echarts1>
        </div>

        <adduser v-if="title=='添加用户'"></adduser>
        <personnel v-if="title=='用户列表'"></personnel>
        <articlelist v-if="title=='文章列表'"></articlelist>
        <categorylist v-if="title=='类别列表'"></categorylist>
        <videolist v-if="title=='视频列表'"></videolist>
        <messagelist v-if="title=='消息列表'"></messagelist>
        <addcategory v-if="title=='添加类别'"></addcategory>
      </el-card>
    </div>
  </div>
</template>

<script>

  import echarts from "@/components/echarts";
  import echarts1 from "@/components/echarts1";
  import echarts2 from "@/components/echarts2";
  import adduser from "@/components/adduser";
  import personnel from "@/components/personnel";
  import articlelist from "@/components/articlelist";
  import categorylist from "@/components/categorylist";
  import videolist from "@/components/videolist";
  import messagelist from "@/components/messagelist";
  import addcategory from "@/components/addcategory"

  var url = "http://114.116.238.138:9090"
  // var url = "http://106.13.207.98:8080/jurisdiction"
  export default {
    name: "setting",
    components: {
      echarts,
      echarts1,
      echarts2,
      adduser,
      personnel,
      articlelist,
      categorylist,
      videolist,
      messagelist,
      addcategory
    },
    data() {
      return {
        list: [],
        usernum:'',
        articlenum:'',
        videonum:''
      }
    },
    props: {
      title: String,
    },
    beforeCreate() {

    },
    created(){
      this.init();
    },
    mounted() {

    },
    methods: {
      init() {
        this.$axios.get(url + "/user/querynum")
          .then(res=>{
            this.usernum = res.data.data
          })
          .catch(res=>{
            console.log("查询用户数量异常")
          })

        this.$axios.get(url + "/article/select/num")
          .then(res=>{
            this.articlenum = res.data.data
          })
          .catch(res=>{
            console.log("查询文章数量异常")
          })

        this.$axios.get(url + "/video/select/num")
          .then(res=>{
            this.videonum = res.data.data
          })
          .catch(res=>{
            console.log("查询视频数量异常")
          })
      },
      backindex(){
        this.$bus.$emit('backindex')
      }
    }
  }
</script>

<style>
  #setting {
  }

  @media (min-width: 576px) {
    .col-xl-3 {
      flex: 0 0 25%;
      max-width: 25%;
    }
  }

  .col-xl-3 {
    position: relative;
    width: 100%;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
  }

  .col-sm-6 {
    position: relative;
    width: 100%;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
  }

  .setting-table {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    float: left;
    margin: 0;
    width: 89%;
    min-height: 877px;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .box-card {
    height: 800px;
    width: 95%;
  }

  .zhanshi {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .item {
    border-right: 1px solid #eee;
    padding: 15px 0;

  }
  .d-flex{
    align-items: center !important;
    display: flex !important;
  }
  .align-items-center{
    box-sizing: border-box;
  }

  .bg-violet {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    min-width: 40px;
    max-width: 40px;
    border-radius: 50%;

    color: #fff;
  }
  .bg1{
    background: #796AEE !important;
  }
  .bg2{
    background: #67C23A !important;
  }
  .bg3{
    background: #F56C6C !important;
  }

  .title{
    font-size: 1.1rem;
    font-weight: 300;
    color: #777;
    margin: 0 20px;
  }

  .number{
    font-size: 1.8em;
    font-weight: 300;
  }
  .table{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

</style>
