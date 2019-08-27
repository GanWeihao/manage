<template>
  <div id="menu_list">
    <div class="title">
      <span style="color: cyan;font-size: 25px">TASTE</span>
    </div>
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#ffffff"
      active-text-color="#409EFF"
      collapse-transition
    >
      <el-menu-item @click="thismenu('首页')" index="1">
        <i class="el-icon-s-home"></i>
        <span style="font-size: 16px;" slot="title">首页</span>
      </el-menu-item>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span style="font-size: 16px;">用户管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item @click="thismenu('添加用户')" index="2-1" style="font-size: 15px;">
            添加用户
          </el-menu-item>
          <el-menu-item @click="thismenu('用户列表')" index="2-2" style="font-size: 15px;">
            用户列表
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span style="font-size: 16px;">文章管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item @click="thismenu('文章列表')" index="3-1" style="font-size: 15px;">
            文章列表
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-s-unfold"></i>
          <span style="font-size: 16px;">类别管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item @click="thismenu('添加类别')" index="4-1" style="font-size: 15px;">
            添加类别
          </el-menu-item>
          <el-menu-item @click="thismenu('类别列表')" index="4-2" style="font-size: 15px;">
            类别列表
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-video-camera-solid"></i>
          <span style="font-size: 16px;">视频管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item @click="thismenu('视频列表')" index="5-1" style="font-size: 15px;">
            视频列表
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="6">
        <template slot="title">
          <i class="el-icon-s-comment"></i>
          <span style="font-size: 16px;">消息管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item @click="thismenu('消息列表')" index="6-1" style="font-size: 15px;">
            消息列表
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  // var url = "http://localhost:8080"

  var url = "http://114.116.238.138:9090/jurisdiction";
  export default {
    name: 'caidan',
    data() {
      return {
        caianList: [],
        ruleslist: [],
        userId: "",
        index: 0
      };
    },
    created() {

    },
    mounted: function () {
      this.$bus.$on('backindex', () => {
        this.thismenu('首页')
      })
    },
    methods: {
      thismenu(e){
          this.$emit('childByValue',  e)
      }
    }
  }
</script>

<style>
  .title {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    line-height: 60px;
    height: 60px;
  }

  .title img {
    margin-right: 10px;
    height: 40px;
  }

  .title p {
    font-family: 幼圆;
    font-size: 18px;
    color: springgreen;
  }

  #menu_list {
    float: left;
    width: 11%;
    min-height: 937px;
    background-color: #545c64;
  }

  .el-menu-vertical-demo {

    border: none;
  }
</style>
