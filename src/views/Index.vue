<template>
    <div id="index">
        <caidan v-on:childByValue="childByValue" v-if="isRouterAlive"></caidan>
        <pagehead></pagehead>
        <setting v-bind:title="menuname"></setting>
    </div>
</template>

<script>
    import caidan from "@/components/caidan";
    import pagehead from "@/components/pagehead";
    import setting from "@/components/setting";
    export default {
        name: "Index",
        components: {
            caidan,
            pagehead,
            setting
        },
        data() {
            return{
              menuname:'',
              isRouterAlive: true
            }
        },
      mounted(){
        this.$bus.$on('backindex', () => {
          this.reload('首页')
        })
      },
        methods:{
            childByValue:function (childValue) {
              this.menuname = childValue;
            },
          reload(){
              this.isRouterAlive = false;
              this.$nextTick(function () {
                this.isRouterAlive = true;
              })
          }
        }
    }
</script>

<style>
    #index{
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }
</style>
