<template>
  <div id="changeimg">
    <div class="model" v-show="model" @click="model = false" style="width: 300px">
      <div class="model-show">
        <img :src="modelSrc" alt="">
      </div>
    </div>

    <div class="cut">
      <vue-cropper ref="cropper" :img="option.img" :output-size="option.size" :output-type="option.outputType" :info="true" :full="option.full"
                   :can-move="option.canMove" :can-move-box="option.canMoveBox" :fixed-box="option.fixedBox" :original="option.original"
                   :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight" :center-box="option.centerBox"
                   :high="option.high"
                   @img-load="imgLoad" ></vue-cropper>
    </div>

    <div class="test-button">
      <label class="btn" for="uploads">选择图片</label>
    <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg"
           @change="uploadImg($event, 1)">
      <button @click="refreshCrop" class="btn">刷新</button>
      <button @click="changeScale(1)" class="btn">+</button>
      <button @click="changeScale(-1)" class="btn">-</button>
      <button @click="rotateLeft" class="btn">左转</button>
      <button @click="rotateRight" class="btn">右转</button>
      <button @click="finish('blob')" class="btn">预览</button>
      <button @click="submitImg('base64')" class="btn">确认上传</button>
      <!-- <button @click="finish('blob')" class="btn">preview(blob)</button> -->
      <!-- <a @click="down('base64')" class="btn">download(base64)</a> -->
      <!--<a @click="down('base64')" class="btn">download(blob)</a>-->

    </div>
  </div>
</template>

<script>

  var url = "http://localhost:9090"

  export default {
    name: 'changeimg',
    created(){

      //this.option.img = this.cropperimg
      // alert(this.cropperimg)
    },

    data() {
      return {
        items: [],
        model: false,
        modelSrc: '',
        crap: false,

        option: {
          img:'',
          //img: '',//裁剪图片的地址
          size: 1,
          full: true, //是否输出原图比例的截图
          outputType: 'png',//裁剪生成图片的格式
          canMove: true, //上传图片是否可以移动
          fixedBox: true, //固定截图框大小 不允许改变
          original: true, //上传图片按照原始比例渲染
          canMoveBox: true, //截图框能否拖动
          autoCrop: true, //	是否默认生成截图框
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 200, //默认生成截图框宽度
          autoCropHeight: 200, //默认生成截图框高度
          centerBox: true, //截图框是否被限制在图片里面
          high: true  //是否按照设备的dpr 输出等比例图片
        },
        show: true
      }
    },
    computed:{
      cropperimg(){
        // return this.$store.getters['getcropperImg']
      }
    },

    methods: {
      refreshCrop() {
        // clear
        this.$refs.cropper.refresh()
        this.option.img=''
      },
      changeScale(num) {
        num = num || 1
        this.$refs.cropper.changeScale(num)
      },
      rotateLeft() {
        this.$refs.cropper.rotateLeft()//左旋转
      },
      rotateRight() {
        this.$refs.cropper.rotateRight()//右旋转
      },
      // 截图
      finish(type) {
        // 输出
        // var test = window.open('about:blank')
        // test.document.body.innerHTML = '图片生成中..'
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            console.log(data);
            var img = window.URL.createObjectURL(data)
            this.model = true
            this.modelSrc = img
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            console.log(data);
            // data就是截到图片生成的base64
            this.model = true
            this.modelSrc = data
          })
        }
      },
      submitImg(type){
          this.$refs.cropper.getCropData((data) => {
            console.log(data);
            var param = this.$qs.stringify({
              img: data
            })
            this.$axios.post(url + "/upload/base64",param
            )
              .then(res=>{
                if(res.data.status==200){
                  this.$message("上传成功");
                  this.$emit('childByValue',  res.data.data)
                  this.refreshCrop();
                }else{
                  this.$message("上传失败")
                }
              })
          })
      },
      // down(type) {
      //   // event.preventDefault()
      //   var aLink = document.createElement('a')
      //   aLink.download = 'demo'
      //   // 输出
      //   if (type === 'blob') {
      //     this.$refs.cropper.getCropBlob((data) => {
      //       console.log(data)
      //       this.downImg = window.URL.createObjectURL(data)
      //       aLink.href = window.URL.createObjectURL(data)
      //       aLink.click()
      //     })
      //   } else {
      //     this.$refs.cropper.getCropData((data) => {
      //       console.log(data)
      //       this.downImg = data
      //       aLink.href = data
      //       aLink.click()
      //     })
      //   }
      // },

      uploadImg(e, num) {
        //上传图片
        // this.option.img
        var file = e.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        var reader = new FileReader()
        reader.onload = (e) => {
          let data
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          if (num === 1) {
            this.option.img = data
          } else if (num === 2) {
            this.example2.img = data
          }
        }
        // 转化为base64
        reader.readAsDataURL(file)
        // 转化为blob
        // reader.readAsArrayBuffer(file)
      },
      imgLoad(msg) {
        console.log(msg)
      }
    }
  }
</script>

<style scoped>
  #changeimg{
    width: 300px;
  }
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  * {
    margin: 0;
    padding: 0;
  }

  .cut {
    width: 300px;
    height: 300px;
    margin: 30px auto;
  }

  .test-button {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
  }

  .btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c0ccda;
    color: #1f2d3d;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin:20px 10px 0px 0px;
    padding: 9px 15px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #50bfff;
    border-color: #50bfff;
    transition: all .2s ease;
    text-decoration: none;
    user-select: none;
  }

  code.language-html {
    padding: 10px 20px;
    margin: 10px 0px;
    display: block;
    background-color: #333;
    color: #fff;
    overflow-x: auto;
    font-family: Consolas, Monaco, Droid, Sans, Mono, Source, Code, Pro, Menlo, Lucida, Sans, Type, Writer, Ubuntu, Mono;
    border-radius: 5px;
    white-space: pre;
  }

  .show-info h2 {
    line-height: 50px;
  }

  .model {
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
  }

  .model-show {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }

  .model img {
    display: block;
    margin: auto;
    max-width: 80%;
    user-select: none;
    background-position: 0px 0px, 10px 10px;
    background-size: 20px 20px;
    background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
  }

  @keyframes slide {
    0%  {
      background-position: 0 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
</style>
