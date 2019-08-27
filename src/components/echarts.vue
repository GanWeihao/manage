<template>
  <div id="echarts" style="width:500px;height:400px;margin-top: 50px">
    <div style="width:450px;height:450px" ref="chart"></div>
  </div>
</template>

<script>
  var url = "http://114.116.238.138:9090"
    export default {
        name: "echarts",
      data () {
        return {
          xdata:[],
          ydata:[]
        };
      },
      mounted(){
        this.initCharts();
      },
      methods: {
        initCharts () {
          this.$axios.get(url + "/user/select/bytime")
            .then(res=>{
              if(res.data.status==200){
                var x=[]
                var y=[]
                var length = res.data.data.length;
                if(res.data.data.length>5){
                  length=5;
                }
                for(var i=0;i<length;i++){
                  this.xdata[i] = res.data.data[i].date
                  this.ydata[i] = res.data.data[i].num
                }
                console.log(this.xdata);
                let myChart = this.$echarts.init(this.$refs.chart);
                // 绘制图表
                myChart.setOption({
                  title:{
                    text: '增长数量',
                    subtext: 'Example in MetricsGraphics.js',
                    left: 'left'
                  },
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      type: 'cross',
                      animation: false,
                      label: {
                        backgroundColor: '#ccc',
                        borderColor: '#aaa',
                        borderWidth: 1,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        textStyle: {
                          color: '#222'
                        }
                      }
                    }
                  },
                  xAxis: {
                    type: 'category',
                    data: this.xdata
                  },
                  yAxis: {
                    type: 'value'
                  },
                  series: [{
                    name: '用户数',
                    data: this.ydata,
                    type: 'line',
                    lineStyle:{
                      normal:{
                        color: "#796AEE",
                        width: 3
                      }
                    }
                  }]
                });
              }
            })
            .catch(res=>{
              console.log("异常")
            })


        }
      }
    }
</script>

<style>

</style>
