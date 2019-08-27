<template>
  <div id="personnel">
    <el-input
      style="margin-top:20px;width: 300px"
      placeholder="请输入内容"
      v-model="input4">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-button type="primary" icon="el-icon-search" size="mini" @click="searchUser()">搜索</el-button>
    <el-button icon="el-icon-back" size="mini" @click="listback()" v-if="input4!=null && input4!=''">返回</el-button>
    <el-table
      height="627"
      size="medium"
      :data="tableData"
      style="margin-top:10px;width: 100%;">
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
        label="头像"
        width="150">
        <template slot-scope="scope">
          <el-avatar v-if="scope.row.userHeadurl!='' && scope.row.userHeadurl!=null" :size="70"
                     :src="'http://114.116.238.138:9090/file/'+scope.row.userHeadurl">
          </el-avatar>
          <el-avatar v-else-if="scope.row.userHeadurl=='' || scope.row.userHeadurl==null" :size="70"
                     src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png">
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名"
        width="200">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" v-show="scope.row.userId!=userId">
            <p>点击复制用户编号: {{ scope.row.userId }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag class="tag-read" style="cursor: pointer;" :data-clipboard-text="scope.row.userId" size="medium"
                      @click="copyId" >{{ scope.row.userName }}
              </el-tag>
            </div>
          </el-popover>
          <el-input
            v-show="scope.row.userId==userId"
            type="text"
            placeholder="请输入内容"
            v-model="scope.row.userName"
          >
          </el-input>
        </template>
      </el-table-column>

      <el-table-column
        label="手机号码"
        width="200">
        <template slot-scope="scope">
          <el-tag disable-transitions
                  size="medium"
                  v-show="scope.row.userId!=userId">
            {{scope.row.userTelphone}}
          </el-tag>
          <el-input
            v-show="scope.row.userId==userId"
            type="text"
            placeholder="请输入手机号码"
            v-model="scope.row.userTelphone"
            maxlength="11"
            show-word-limit
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="邮箱"
        width="300">
        <template slot-scope="scope">
          <el-tag disable-transitions
                  size="medium"
                  v-show="scope.row.userId!=userId">
            {{scope.row.userEmail}}
          </el-tag>
          <el-input
            v-show="scope.row.userId==userId"
            type="text"
            placeholder="请输入电子邮箱"
            v-model="scope.row.userEmail"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="注册时间"
        width="300">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.userTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="100">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" v-if="scope.row.userStatus!=0">
            <p>状态: 已删除</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" type="info" effect="dark">已删除</el-tag>
            </div>
          </el-popover>
          <el-popover trigger="hover" placement="top" v-if="scope.row.userStatus==0">
            <p>状态: 正常</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" type="success" effect="dark">正常</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button @click="updateuser(scope.row.userId)" type="text" size="medium" v-if="scope.row.userId!=userId">
            编辑
          </el-button>
          <el-button @click="submitupdate(scope.row)" type="text" size="medium" v-if="scope.row.userId==userId">保存
          </el-button>
          <el-button @click="cancel(scope.row)" type="text" size="medium" v-if="scope.row.userId==userId">取消</el-button>
          <el-button @click="sendmessage(scope.row)" type="text" size="medium" v-if="scope.row.userId!=userId">发送消息
          </el-button>
          <el-button @click="deleteuser(scope.row)" type="text" size="medium" v-if="scope.row.userStatus==0">删除
          </el-button>
          <el-button @click="deleteuser(scope.row)" type="text" size="medium" v-if="scope.row.userStatus!=0">恢复
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="pageNum"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
    <el-dialog
      title="发送消息"
      :visible.sync="dialogVisible2"
      width="30%">
      <span>To：{{user.userName}}</span>
      <br/>
      <span>消息标题：<el-input
        placeholder="请输入内容"
        v-model="message.messageTitle"
        clearable>
</el-input></span>
      <br/>
      <span>消息内容：
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入内容"
        v-model="message.messageContent">
</el-input>
      </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="closemess()">取 消</el-button>
    <el-button type="primary" @click="sendmess()">发 送</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  var url = "http://114.116.238.138:9090"

  // var url = "http://106.13.207.98:8080/jurisdiction";
  export default {
    name: "personnel",
    data() {
      return {
        dialogFormVisible: false,
        dialogFormVisible2: false,
        dialogVisible: false,
        dialogVisible2: false,
        tableData: [],
        user: {},
        roleOptions: [],
        checkboxRoles: [],
        form: {
          userName: '',
          userPassword: '',
          userTelphone: '',
          userEmail: ''
        },
        form2: {
          userId: '',
          userName: '',
          userTelphone: '',
          userEmail: ''
        },
        formLabelWidth: "120px",
        multipleSelection: [],
        ids: [],

        currentPage4: 4,
        singlePage: false,
        pageSize: 8,
        pageNum: 1,
        total: 0,
        input4: '',
        userId: '',
        message: {
          messageTitle: '',
          messageContent: ''
        }
      };
    },
    created: function () {
      this.init();
    },
    mounted: function () {
      // this.$bus.$on('addRole', () => {
      //   this.init()
      // })
    },
    methods: {
      init() {
        this.$axios.get(url + "/user/all")
          .then(res => {
            console.log(res)
            if (res.data.status == 200) {
              for (let i = 0; i < res.data.data.list.length; i++) {
                var date = new Date(res.data.data.list[i].userTime);
                res.data.data.list[i].userTime = date.toLocaleString();
              }
              this.tableData = res.data.data.list;
              this.pageNum = res.data.data.pageNum;
              this.pageSize = res.data.data.pageSize;
              this.total = res.data.data.total;
            } else {
              this.tableData = []
            }
          })
          .catch(res => {
            this.tableData = []
          })
      },
      handleCurrentChange(e) {
        if (this.input4 != null && this.input4 != '') {
          var param = this.$qs.stringify({
            userName: this.input4,
            pageNum: this.pageNum
          })
          this.$axios.post(url + "/user/query/mohu", param)
            .then(res => {
              if (res.data.status == 200) {
                for (let i = 0; i < res.data.data.list.length; i++) {
                  var date = new Date(res.data.data.list[i].userTime);
                  res.data.data.list[i].userTime = date.toLocaleString();
                }
                this.tableData = []
                this.tableData = res.data.data.list;
                this.pageNum = res.data.data.pageNum;
                this.pageSize = res.data.data.pageSize;
                this.total = res.data.data.total;
              } else {
                this.tableData = []
                this.pageNum = 1
                this.total = 0;
              }
            })
            .catch(res => {
              this.tableData = []
              this.pageNum = 1
              this.total = 0;
            })

        } else {
          this.pageNum = e
          this.$axios.get(url + "/user/all", {
            params: {
              pageNum: e
            }
          })
            .then(res => {
              if (res.data.status == 200) {
                for (let i = 0; i < res.data.data.list.length; i++) {
                  var date = new Date(res.data.data.list[i].userTime);
                  res.data.data.list[i].userTime = date.toLocaleString();
                }
                this.tableData = []
                this.tableData = res.data.data.list;
                this.pageNum = res.data.data.pageNum;
                this.pageSize = res.data.data.pageSize;
                this.total = res.data.data.total;
              } else {
                this.tableData = []
                this.pageNum = 1
                this.total = 0;
              }
            })
            .catch(res => {
              this.tableData = []
              this.pageNum = 1
              this.total = 0;
            })
        }
      },
      searchUser() {
        if (this.input4 == null || this.input4 == '') {
          this.input4 = ''
          this.tableData = []
          this.init();
        } else {
          var param = this.$qs.stringify({
            userName: this.input4,
            pageNum: this.pageNum
          })
          this.$axios.post(url + "/user/query/mohu", param)
            .then(res => {
              if (res.data.status == 200) {
                for (let i = 0; i < res.data.data.list.length; i++) {
                  var date = new Date(res.data.data.list[i].userTime);
                  res.data.data.list[i].userTime = date.toLocaleString();
                }
                this.tableData = []
                this.tableData = res.data.data.list;
                this.pageNum = res.data.data.pageNum;
                this.pageSize = res.data.data.pageSize;
                this.total = res.data.data.total;
              } else {
                this.tableData = []
                this.pageNum = 1
                this.total = 0;
              }
            })
            .catch(res => {
              this.tableData = []
              this.pageNum = 1
              this.total = 0;
            })
        }
      },
      deleteuser(row) {
        var mess = "此操作将删除该用户, 是否继续?"
        if (row.userStatus != 0) {
          mess = "此操作将恢复该用户, 是否继续?"
        }
        this.$confirm(mess, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get(url + "/user/delete", {
            params: {
              userId: row.userId
            }
          }).then(res => {
            if (res.data.status == 200) {
              this.handleCurrentChange(this.pageNum);
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
            } else {
              this.$message({
                type: 'info',
                message: '操作失败!'
              });
            }
          }).catch(error => {
            this.$message({
              type: 'success',
              message: '删除异常!'
            })
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deluser() {
        this.$confirm('此操作将永久删除选中用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get(url + '/user/deleteoptions', {
            params: {
              user: JSON.stringify(this.ids)
            }
          })
            .then(res => {
              if (res.data.status == 200) {
                this.init();
                this.$message("删除成功")
              } else {
                this.$message("删除失败")
              }
            }).catch(res => {
            this.$message("删除异常")
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      copyId(e) {
        var clipboard = new this.$clipboard('.tag-read')
        clipboard.on('success', e => {
          this.$message('复制成功')
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          // 不支持复制
          this.$message('该浏览器不支持自动复制')
          // 释放内存
          clipboard.destroy()
        })
      },
      updateuser(userId) {
        this.userId = userId
      },
      cancel(e) {
        this.handleCurrentChange(this.pageNum);
        this.userId = ''
      },
      submitupdate(e) {
        if (e.userName == null || e.userName == '') {
          this.$message({
            type: 'error',
            message: '用户名不能空着哦'
          })
        } else if (e.userTelphone == null || e.userTelphone == '') {
          this.$message({
            type: 'error',
            message: '手机号不能空着哦'
          })
        } else if (e.userEmail == null || e.userEmail == '') {
          this.$message({
            type: 'error',
            message: '电子邮箱不能空着哦'
          })
        } else {
          var param = this.$qs.stringify({
            userId: e.userId,
            userName: e.userName,
            userEmail: e.userEmail,
            userTelphone: e.userTelphone
          })
          this.$axios.post(url + "/user/update", param)
            .then(res => {
              if (res.data.status == 200) {
                this.$message({
                  type: 'success',
                  message: '修改成功啦！！！'
                })
                this.handleCurrentChange(this.pageNum);
                this.userId = ''
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
        }
      },
      listback() {
        this.init()
        this.input4 = ''
      },
      sendmessage(row) {
        this.user = row;
        this.message = {
          messageTitle: '',
          messageContent: ''
        }
        this.dialogVisible2 = true;
      },
      sendmess() {
        this.$axios.get(url + "/message/insert",{
          params:{
            messageUserId: this.user.userId,
            messageTitle: this.message.messageTitle,
            messageContent: this.message.messageContent
          }
        }).then(res=>{
          if(res.data.status==200){
            this.$message({
              type: 'success',
              message: '发送成功'
            })
            this.user = {};
            this.dialogVisible2 = false
          }else{
            this.$message({
              type: 'info',
              message: '发送失败'
            })
          }
        }).catch(res=>{
          console.log('发送异常')
        })


      },
      closemess() {
        this.dialogVisible2 = false
      }
    }
  }
</script>

<style>
  #personnel {
    font-size: 20px;
  }
</style>
