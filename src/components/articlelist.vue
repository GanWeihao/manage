<template>
  <div>
    <el-input
      style="margin-top:20px;width: 300px"
      placeholder="请输入内容"
      v-model="articleTitle">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-button type="primary" icon="el-icon-search" size="mini" @click="searchVideo()">搜索</el-button>
    <el-button icon="el-icon-back" size="mini" @click="listback()" v-if="articleTitle!=null && articleTitle!=''">返回</el-button>
    <el-table
      v-loading.fullscreen.lock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="articlelist"
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
        width="350">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" v-show="scope.row.articleId!=articleId">
            <p v-if="scope.row.highlight==null">标题: {{ scope.row.articleTitle }}</p>
            <p v-else-if="scope.row.highlight!=null">标题: <b v-html="scope.row.highlight.articleTitle[0]"></b></p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" class="msg container" :class="fold?'fold':'unfold'" disable-transitions>
                <b v-if="scope.row.highlight==null">{{ scope.row.articleTitle }}</b>
                <b v-else-if="scope.row.highlight!=null"><b v-html="scope.row.highlight.articleTitle[0]"></b></b>
              </el-tag>
            </div>
          </el-popover>
          <el-input
            v-show="scope.row.articleId==articleId"
            type="text"
            placeholder="请输入文章标题"
            v-model="scope.row.articleTitle"
          >
          </el-input>

        </template>
      </el-table-column>
      <el-table-column
        label="分类"
        width="180">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper" v-show="scope.row.articleId!=articleId">
            <el-tag size="medium" type="danger" v-for="category in categoryList" :key="category.categoryId"
                    v-show="category.categoryId == scope.row.articleCategoryId" disable-transitions>{{ category.categoryName }}
            </el-tag>
          </div>
          <el-select v-model="value" placeholder="请选择" v-show="scope.row.articleId==articleId">
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
          <span style="margin-left: 10px">{{ scope.row.articleTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="150">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" v-if="scope.row.articleStatus!=0">
            <p>状态: 已删除</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" type="info" effect="dark" disable-transitions>已删除</el-tag>
            </div>
          </el-popover>
          <el-popover trigger="hover" placement="top" v-if="scope.row.articleStatus==0">
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
        width="250">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="medium">查看详情</el-button>
          <el-button @click="updatearticle(scope.row)" type="text" size="medium" v-if="scope.row.articleId!=articleId">
            编辑
          </el-button>
          <el-button @click="submitupdate(scope.row)" type="text" size="medium" v-if="scope.row.articleId==articleId">保存
          </el-button>
          <el-button @click="cancel(scope.row)" type="text" size="medium" v-if="scope.row.articleId==articleId">取消</el-button>
          <el-button @click="deletearticle(scope.row)" type="text" size="medium" v-if="scope.row.articleStatus==0">删除
          </el-button>
          <el-button @click="deletearticle(scope.row)" type="text" size="medium" v-if="scope.row.articleStatus!=0">恢复
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="articlelistCurrentChange"
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
        <h1>{{article.articleTitle}}</h1>
        <ul class="infinite-list" v-infinite-scroll="loading" style="overflow:auto;height:500px">
          <li v-for="(content,index) in article.list" :key="index" class="infinite-list-item">
            <br/>
            <div>&#12288;&#12288;{{content.contentText}}</div>
            <img style="width: 100%" :src="'http://114.116.238.138:9090/file/' + content.contentImgurl"/>
            <br/>
          </li>
        </ul>
      </template>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="closearticle">关 闭</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  var url = "http://114.116.238.138:9090"

  export default {
    name: "articlelist",
    components: {},
    data() {
      return {
        pageNum: 1,
        pageSize: 12,
        total: 0,
        articlelist: [],
        fold: true,
        categoryList: [],
        loading: false,
        centerDialogVisible: false,
        article: {},
        articleId: '',
        value:'',
        articleTitle:''
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
        this.$axios.post(url + "/article/queryall", param)
          .then(res => {
            console.log(res)
            if (res.data.status == 200) {
              for (let i = 0; i < res.data.data.pagedList.length; i++) {
                var date = new Date(res.data.data.pagedList[i].articleTime);
                res.data.data.pagedList[i].articleTime = date.toLocaleString();
              }
              this.articlelist = res.data.data.pagedList;
              this.pageNum = res.data.data.nowPage;
              this.total = res.data.data.totalCount;
              this.loading = false;
            } else {
              this.pageNum = 1;
              this.total = 0;
              this.articlelist = []
              this.loading = false;
            }
          })
          .catch(res => {
            console.log("查询异常")
            this.pageNum = 1;
            this.total = 0;
            this.articlelist = []
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
      closearticle() {
        this.centerDialogVisible = false
        this.article = {}
      },
      dialogclose() {
        this.article = {}
      },
      handleClick(row) {
        this.$axios.get(url + "/article/query/articleid", {
          params: {
            articleId: row.articleId
          }
        }).then(res => {
          if (res.data.status == 200) {
            this.article = res.data.data
            this.centerDialogVisible = true
            console.log(this.article)
          } else {
            this.$message({
              type: 'info',
              message: '查看失败'
            })
          }
        }).catch(res => {
          console.log("查看异常")
        })
      },
      articlelistCurrentChange(e) {
        this.loading = true;
        this.pageNum = e;
        if (this.articleTitle != null && this.articleTitle != '') {
          var param = this.$qs.stringify({
            articleTitle: this.articleTitle,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          })
          this.$axios.post(url + "/article/querybytitle", param)
            .then(res => {
              if (res.data.status == 200) {
                for (let i = 0; i < res.data.data.pagedList.length; i++) {
                  var date = new Date(res.data.data.pagedList[i].articleTime);
                  res.data.data.pagedList[i].articleTime = date.toLocaleString();
                }
                this.articlelist = res.data.data.pagedList;
                this.pageNum = res.data.data.pageNum;
                this.total = res.data.data.total;
                this.loading = false;
              } else {
                this.articlelist = []
                this.pageNum = 1
                this.total = 0;
                this.loading = false;
              }
            })
            .catch(res => {
              this.articlelist = []
              this.pageNum = 1
              this.total = 0;
              this.loading = false;
            })
        }else {
          var param = this.$qs.stringify({
            pageNum: this.pageNum,
            pageSize: this.pageSize
          })
          this.$axios.post(url + "/article/select/with/user", param)
            .then(res => {
              if (res.data.status == 200) {
                for (let i = 0; i < res.data.data.pagedList.length; i++) {
                  var date = new Date(res.data.data.pagedList[i].articleTime);
                  res.data.data.pagedList[i].articleTime = date.toLocaleString();
                }
                this.articlelist = res.data.data.pagedList;
                this.pageNum = res.data.data.nowPage;
                this.total = res.data.data.totalCount;
                this.loading = false;
              } else {
                this.$message("查询失败")
                this.pageNum = 1;
                this.total = 0;
                this.articlelist = []
                this.loading = false;
              }
            })
            .catch(res => {
              console.log("查询异常")
              this.pageNum = 1;
              this.total = 0;
              this.articlelist = []
              this.loading = false;
            })
        }
      },
      deletearticle(row) {
        var mes = "此操作将移除该类别, 是否继续?"
        if (row.articleStatus != 0) {
          mes = "此操作将恢复该类别, 是否继续?"
        }
        this.$confirm(mes, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get(url + "/article/delete", {
            params: {
              articleId: row.articleId
            }
          })
            .then(res => {
              if (res.data.status == 200) {
                this.$message({
                  type: 'success',
                  message: `操作成功`
                });
                this.articlelistCurrentChange(this.pageNum)
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
      updatearticle(row) {
        this.articleId = row.articleId
        this.value = row.articleCategoryId
      },
      submitupdate(row) {
        var param = this.$qs.stringify({
          articleId: row.articleId,
          articleTitle: row.articleTitle,
          articleCategoryId: this.value
        })
        this.$axios.post(url + "/article/update", param)
          .then(res => {
            if (res.data.status == 200) {
              this.articlelistCurrentChange(this.pageNum)
              this.articleId = '';
              this.value = ''
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
        this.articlelistCurrentChange(this.pageNum)
        this.articleId = '';
        this.value = ''
      },
      searchVideo(){
        if (this.articleTitle == null || this.articleTitle == '') {
          this.articleTitle = ''
          this.articlelist = []
          this.init();
        } else {
          this.loading = true
          var param = this.$qs.stringify({
            articleTitle: this.articleTitle,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          })
          this.$axios.post(url + "/article/querybytitle", param)
            .then(res => {
              if (res.data.status == 200) {
                for (let i = 0; i < res.data.data.pagedList.length; i++) {
                  var date = new Date(res.data.data.pagedList[i].articleTime);
                  res.data.data.pagedList[i].articleTime = date.toLocaleString();
                }
                this.articlelist = res.data.data.pagedList;
                this.pageNum = res.data.data.nowPage;
                this.total = res.data.data.totalCount;
                this.loading = false
              } else {
                this.articlelist = []
                this.pageNum = 1
                this.total = 0;
                this.loading = false
              }
            })
            .catch(res => {
              this.articlelist = []
              this.pageNum = 1
              this.total = 0;
              this.loading = false
            })
        }
      },
      listback() {
        this.init()
        this.articleTitle = ''
      },
    }
  }
</script>

<style scoped>
  .container {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .container.fold {
    -webkit-line-clamp: 3;
  }

  .container.unfold {
    -webkit-line-clamp: 100;
  }

  .infinite-list-item {
    font-size: 20px;
    margin: 0;
    padding: 0;
    font-family: "Poppins", sans-serif;
    font-weight: 400;
    line-height: 1.5;
  }
</style>
