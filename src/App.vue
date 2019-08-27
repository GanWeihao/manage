<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>

</template>

<script>
  export default {
    name: 'App',
    components: {

    },
    provide(){
      return{
        reload: this.reload
      }
    },
    data(){
      return{
        isRouterAlive: true
      }
    },
    created(){
      window.addEventListener("beforeunload",()=>{
        localStorage.setItem("adminId",JSON.stringify(this.$store.state))
      })
      localStorage.getItem("adminId") && this.$store.replaceState(Object.assign(this.$store.state,JSON.parse(localStorage.getItem("adminId"))));
    },
    mounted(){
      /**
       * 解决 css 引入图片在 github pages 无法获取的问题
       */
      const { NODE_ENV } = process.env;
      document.documentElement.className = NODE_ENV;
    },
    methods:{
      reload(){
        this.isRouterAlive = false;
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      },
    }
  }
</script>

<style>
  *{
    margin: 0;
    padding: 0;
    font-family: "Poppins", sans-serif;
    font-weight: 400;
    line-height: 1.5;
  }
</style>
