<template>
    <div id="messagelist">
      <el-input
        style="margin-top:20px;width: 300px"
        placeholder="请输入用户编号"
        v-model="input">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="searchMessage()">搜索</el-button>
      <div style="margin-top:1%">
        <p v-if="messagelist==''">暂无数据！</p>
      <el-scrollbar v-else-if="messagelist!=''" style="height: 685px">
      <el-collapse accordion style="width: 500px">
        <el-collapse-item v-for="(message,index) in messagelist" :key="index">
          <template slot="title">
            <el-tag
              type="warning"
              effect="dark">
              标题：{{message.messageTitle}}
            </el-tag>

            <i style="margin-left: 10px" class="el-icon-circle-check" v-show="message.messageStatus==1"></i>
            <i style="margin-left: 10px" class="el-icon-warning-outline" v-show="message.messageStatus==0"></i>
            <i style="margin-left: 10px" class="el-icon-circle-close" v-show="message.messageStatus!=1 && message.messageStatus!=0"></i>
          </template>
          <div>内容：{{message.messageContent}}</div>
          <div>发送时间：{{message.messageTime}}</div>
          <div>
            <p v-if="message.messageStatus==0">消息状态：未读</p>
            <p v-if="message.messageStatus==1">消息状态：已读</p>
            <p v-if="message.messageStatus!=0 && message.messageStatus!=1">消息状态：已删除</p>
          </div>
        </el-collapse-item>
      </el-collapse>
      </el-scrollbar>
      </div>
    </div>
</template>

<script>
  var url  = "http://114.116.238.138:9090"
    export default {
        name: "messagelist",
      data(){
          return{
            input:'',
            messagelist:[]
          }
      },
      created(){

      },
      mounted(){

      },
      methods:{
        searchMessage(){
          if(this.input !=null && this.input != ''){
            this.$axios.get(url + "/message/select/all",{
              params:{
                messageUserId: this.input
              }
            }).then(res=>{
              if(res.data.status==200){
                for (let i = 0; i < res.data.data.length; i++) {
                  var date = new Date(res.data.data[i].messageTime);
                  res.data.data[i].messageTime = date.toLocaleString();
                }
                this.messagelist = res.data.data
              }
            }).catch(res=>{

            })
          }else{
            this.messagelist = [];
          }
        }
      }
    }
</script>

<style scoped>
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
