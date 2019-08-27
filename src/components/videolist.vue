<template>
  <div id="videolist">
    <el-input
      style="margin-top:20px;width: 300px"
      placeholder="请输入内容"
      v-model="videoTitle">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-button type="primary" icon="el-icon-search" size="mini" @click="searchVideo()">搜索</el-button>
    <el-button icon="el-icon-back" size="mini" @click="listback()" v-if="videoTitle!=null && videoTitle!=''">返回</el-button>
    <el-table
      v-loading.fullscreen.lock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="videolist"
      height="665"
      style="width: 100%"
      size="medium">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        fixed="left"
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        label="标题"
        width="300">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" v-show="scope.row.videoId!=videoId">
            <p v-if="scope.row.highlight==null">标题: {{ scope.row.videoTitle }}</p>
            <p v-else-if="scope.row.highlight!=null">标题: <b v-html="scope.row.highlight.videoTitle[0]"></b></p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" class="msg container" :class="fold?'fold':'unfold'" disable-transitions>
                <b v-if="scope.row.highlight==null">{{ scope.row.videoTitle }}</b>
                <b v-else-if="scope.row.highlight!=null"><b v-html="scope.row.highlight.videoTitle[0]"></b></b>
              </el-tag>
            </div>
          </el-popover>
          <el-input
            v-show="scope.row.videoId==videoId"
            type="text"
            placeholder="请输入视频标题"
            v-model="scope.row.videoTitle"
          >
          </el-input>
        </template>

      </el-table-column>
      <el-table-column
        label="视频简介"
        width="200">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" v-show="scope.row.videoId!=videoId">

            <p>简介: <b v-html="scope.row.videoContent"></b></p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" class="msg container" :class="fold?'fold':'unfold'" disable-transitions>
                <b><b v-html="scope.row.videoContent"></b></b>
              </el-tag>
            </div>
          </el-popover>

          <el-input
            v-show="scope.row.videoId==videoId"
            type="text"
            placeholder="请输入视频简介"
            v-model="scope.row.videoContent"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="分类"
        width="180">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper" v-show="scope.row.videoId!=videoId">
            <el-tag size="medium" type="danger" v-for="category in categoryList" :key="category.categoryId"
                    v-show="category.categoryId == scope.row.videoCategoryId" disable-transitions>{{ category.categoryName }}
            </el-tag>
          </div>
          <el-select v-model="value" filterable placeholder="请选择" v-show="scope.row.videoId==videoId">
            <el-option
              v-for="item in categoryList"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryId">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="发布用户"
        width="180">
        <template slot-scope="scope">
          {{scope.row.user.userName}}
        </template>
      </el-table-column>
      <el-table-column
        label="发表时间"
        width="250">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.videoTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" v-if="scope.row.videoStatus!=0">
            <p>状态: 已删除</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" type="info" effect="dark" disable-transitions>已删除</el-tag>
            </div>
          </el-popover>
          <el-popover trigger="hover" placement="top" v-if="scope.row.videoStatus==0">
            <p>状态: 正常</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" type="success" effect="dark" disable-transitions>正常</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="medium">查看详情</el-button>
          <el-button @click="updatevideo(scope.row)" type="text" size="medium" v-if="scope.row.videoId!=videoId">
            编辑
          </el-button>
          <el-button @click="submitupdate(scope.row)" type="text" size="medium" v-if="scope.row.videoId==videoId">保存
          </el-button>
          <el-button @click="cancel(scope.row)" type="text" size="medium" v-if="scope.row.videoId==videoId">取消</el-button>
          <el-button @click="deletevideo(scope.row)" type="text" size="medium" v-if="scope.row.videoStatus==0">删除
          </el-button>
          <el-button @click="deletevideo(scope.row)" type="text" size="medium" v-if="scope.row.videoStatus!=0">恢复
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="videolistCurrentChange"
      :current-page.sync="pageNum"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>


    <el-dialog
      :visible.sync="centerDialogVisible"
      width="30%"
      @close="dialogclose"
      destroy-on-close
      center>
      <template type="title" style="font-size: 25px;text-align: center">
        <h1>{{video.videoTitle}}</h1>
        <video
          preload="auto"
          controls=true
          style="width: 99%"
          :src="'http://114.116.238.138:9090/file/'+video.videoUrl"
        >
        </video>
        <span>视频简介：{{video.videoContent}}</span>
      </template>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="closevideo">关 闭</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  var url = "http://114.116.238.138:9090"

  export default {
    name: "videolist",
    data(){
      return{
        pageNum:1,
        pageSize:10,
        total:0,
        videolist:[],
        fold: true,
        loading:false,
        categoryList:[],
        centerDialogVisible:false,
        video:{},
        videoId:'',
        value:'',
        videoTitle:''
      }
    },
    created() {
      this.init();
    },
    mounted() {

    },
    methods: {
      init() {
        this.loading = true;
        var param = this.$qs.stringify({
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
        this.$axios.get(url + "/video/queryall", param).then(res=>{
          if(res.data.status==200){
            for (let i = 0; i < res.data.data.pagedList.length; i++) {
              var date = new Date(res.data.data.pagedList[i].videoTime);
              res.data.data.pagedList[i].videoTime = date.toLocaleString();
            }
            this.videolist = res.data.data.pagedList;
            this.pageNum = res.data.data.nowPage;
            this.total = res.data.data.totalCount;
            this.loading = false;
          }else{
            this.videolist = [];
            this.pageNum = 1;
            this.total = 0;
            this.loading = false;
          }
        }).catch(res=>{
          console.log(res)
          console.log("查询异常")
          this.videolist = [];
          this.pageNum = 1;
          this.total = 0;
          this.loading = false;
        })

        this.$axios.get(url + "/category/queryall")
          .then(res => {
            if (res.data.status == 200) {
              this.categoryList = res.data.data;
            } else {
              console.log("查询失败")
            }
          })
          .catch(res => {
            console.log("查询异常")
          })
      },
      videolistCurrentChange(e) {
        this.loading = true;
        this.pageNum = e;
        if (this.videoTitle != null && this.videoTitle != '') {
          var param = this.$qs.stringify({
            videoTitle: this.videoTitle,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          })
          this.$axios.post(url + "/video/querybytitle", param)
            .then(res => {
              if (res.data.status == 200) {
                for (let i = 0; i < res.data.data.pagedList.length; i++) {
                  var date = new Date(res.data.data.pagedList[i].videoTime);
                  res.data.data.pagedList[i].videoTime = date.toLocaleString();
                  if(res.data.data.pagedList[i].highlight.videoContent!=null && res.data.data.pagedList[i].highlight.videoContent!=''){
                    res.data.data.pagedList[i].videoContent = res.data.data.pagedList[i].highlight.videoContent[0]
                  }
                }
                this.videolist = res.data.data.pagedList;
                this.pageNum = res.data.data.pageNum;
                this.total = res.data.data.total;
                this.loading = false;
              } else {
                this.videolist = []
                this.pageNum = 1
                this.total = 0;
                this.loading = false;
              }
            })
            .catch(res => {
              this.videolist = []
              this.pageNum = 1
              this.total = 0;
              this.loading = false;
            })
        }else{
        var param = this.$qs.stringify({
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
        this.$axios.post(url + "/video/queryall", param)
          .then(res => {
            if (res.data.status == 200) {
              for (let i = 0; i < res.data.data.pagedList.length; i++) {
                var date = new Date(res.data.data.pagedList[i].videoTime);
                res.data.data.pagedList[i].videoTime = date.toLocaleString();
              }
              this.videolist = res.data.data.pagedList;
              this.pageNum = res.data.data.nowPage;
              this.total = res.data.data.totalCount;
              this.loading = false;
            } else {
              this.$message("查询失败")
              this.pageNum = 1;
              this.total = 0;
              this.videolist = []
              this.loading = false;
            }
          })
          .catch(res => {
            console.log("查询异常")
            this.pageNum = 1;
            this.total = 0;
            this.videolist = []
            this.loading = false;
          })
        }
      },
      closevideo(){
        this.centerDialogVisible = false
        this.video = {}
      },
      dialogclose(){
        this.video = {}
      },
      handleClick(row){
        this.$axios.get(url + "/video/querybyid",{
          params:{
            videoId: row.videoId
          }
        }).then(res=>{
          if(res.data.status==200){
            this.video = res.data.data
            this.centerDialogVisible = true
          }else{
            this.$message({
              type:'info',
              message:'查看失败'
            })
          }
        }).catch(res=>{
          console.log("查看异常")
        })
      },
      deletevideo(row){
        var mes = "此操作将移除该类别, 是否继续?"
        if (row.videoStatus != 0) {
          mes = "此操作将恢复该类别, 是否继续?"
        }
        this.$confirm(mes, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get(url + "/video/delete", {
            params: {
              video: row.videoId
            }
          })
            .then(res => {
              if (res.data.status == 200) {
                this.$message({
                  type: 'success',
                  message: `操作成功`
                });
                this.videolistCurrentChange(this.pageNum)
              } else {
                this.$message({
                  type: 'info',
                  message: `操作失败`
                });
              }
            })
            .catch(res => {
              this.$message({
                type: 'error',
                message: `操作异常`
              });
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      updatevideo(row) {
        console.log(row.videoCategoryId)
        this.videoId = row.videoId
        this.value = row.videoCategoryId
      },
      submitupdate(row) {
        var param = this.$qs.stringify({
          videoId: row.videoId,
          videoTitle: row.videoTitle,
          videoContent: row.videoContent,
          videoCategoryId: this.value
        })
        this.$axios.post(url + "/video/update", param)
          .then(res => {
            if (res.data.status == 200) {
              this.videolistCurrentChange(this.pageNum);
              this.value = ''
              this.videoId = ''
              this.$message({
                type: 'success',
                message: '修改成功啦！！！'
              })
            } else {
              this.$message({
                type: 'info',
                message: res.data.message
              })
            }
          }).catch(res => {
          this.$message({
            type: 'error',
            message: res.data.message
          })
        })
      },
      cancel(e) {
        this.videolistCurrentChange(this.pageNum);
        this.value = ''
        this.videoId = ''
      },
      searchVideo(){
        if (this.videoTitle == null || this.videoTitle == '') {
          this.videoTitle = ''
          this.videolist = []
          this.init();
        } else {
          this.loading = true
          var param = this.$qs.stringify({
            videoTitle: this.videoTitle,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          })
          this.$axios.post(url + "/video/querybytitle", param)
            .then(res => {
              if (res.data.status == 200) {
                for (let i = 0; i < res.data.data.pagedList.length; i++) {
                  var date = new Date(res.data.data.pagedList[i].videoTime);
                  res.data.data.pagedList[i].videoTime = date.toLocaleString();
                  if(res.data.data.pagedList[i].highlight.videoContent!=null && res.data.data.pagedList[i].highlight.videoContent!=''){
                    res.data.data.pagedList[i].videoContent = res.data.data.pagedList[i].highlight.videoContent[0]
                  }
                }
                this.videolist = res.data.data.pagedList;
                this.pageNum = res.data.data.nowPage;
                this.total = res.data.data.totalCount;
                this.loading = false
              } else {
                this.videolist = []
                this.pageNum = 1
                this.total = 0;
                this.loading = false
              }
            })
            .catch(res => {
              this.videolist = []
              this.pageNum = 1
              this.total = 0;
              this.loading = false
            })
        }
      },
      listback() {
        this.init()
        this.videoTitle = ''
      },
    }
  }
</script>

<style scoped>

</style>
