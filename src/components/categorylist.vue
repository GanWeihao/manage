<template>
    <div id="categorylist">
      <el-table
        :data="categorylist"
      max-height="800">
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
          fixed
          label="名称"
          width="150">
          <template slot-scope="scope" >
            <el-tag disable-transitions
                    @click="changeName(scope.row.categoryId)"
                    size="medium"
                    effect="dark"
                    v-show="scope.row.categoryId!=categoryId">
              {{scope.row.categoryName}}
            </el-tag>
            <el-input
              v-show="scope.row.categoryId==categoryId"
              @blur="blur"
              @keyup.enter.native="doChange(scope.row.categoryName,scope.row.categoryId)"
              type="text"
              placeholder="请输入内容"
              v-model="scope.row.categoryName"
              maxlength="10"
              show-word-limit
            >
            </el-input>
          </template>

        </el-table-column>
        <el-table-column
          prop="categoryStatus"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" v-if="scope.row.categoryStatus!=0">
              <p>状态: 已删除</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium" type="info" effect="dark">已删除</el-tag>
              </div>
            </el-popover>
            <el-popover trigger="hover" placement="top" v-if="scope.row.categoryStatus==0">
              <p>状态: 正常</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium" type="success" effect="dark">正常</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.row.categoryId,scope.row.categoryStatus)"
              type="text"
              size="small"
              v-if="scope.row.categoryStatus==0">
              移除
            </el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.row.categoryId,scope.row.categoryStatus)"
              type="text"
              size="small"
              v-if="scope.row.categoryStatus!=0">
              恢复
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
  var url = "http://114.116.238.138:9090"
    export default {
        name: "categorylist",
      data(){
          return{
            categorylist:[],
            categoryId:''
          }
      },
      created(){
        this.init();
      },
      mounted(){

      },
      methods:{
          init(){
            this.$axios.get(url + "/category/queryall2")
              .then(res=>{
                if(res.data.status==200){
                  this.categorylist = res.data.data;
                }else{
                  this.$message("查询失败")
                }
              })
              .catch(res=>{
                console.log("查询异常")
              })
          },
        changeName(id){
            this.categoryId = id;
        },
        blur(e){
          if(this.categoryId != ''){
            this.categoryId = ''
            this.init()
            this.$message({
              type: 'info',
              message: `取消修改`
            });
          }
        },
        doChange(name,id){
          if(name == null || name == ''){
            this.$alert('类别名称不能为空', '警告', {
              confirmButtonText: '确定',
              callback: action => {
                this.$message({
                  type: 'info',
                  message: `请重新输入`
                });
              }
            });
          }else{

            this.$axios.get(url + "/category/updatebyid",{
              params:{
                categoryName: name,
                categoryId: id
              }
            }).then(res=>{
              if(res.data.status==200){
                this.$message({
                  type: 'success',
                  message: `修改成功`
                });
                this.categoryId = ''
              }else{
                this.$message({
                  type: 'info',
                  message: `修改失败`
                });
                this.init()
              }
            }).catch(res=>{
              this.$message({
                type: 'error',
                message: `修改异常`
              });
              this.init()
            })
          }
        },
        deleteRow(e , status){
            var mes = "此操作将移除该类别, 是否继续?"
            if(status != 0){
              mes = "此操作将恢复该类别, 是否继续?"
            }
          this.$confirm(mes, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var param = this.$qs.stringify({
              categoryId: e
            })
            this.$axios.post(url + "/category/deletebyid",param)
              .then(res=>{
                if(res.data.status==200){
                  this.$message({
                    type: 'success',
                    message: `操作成功`
                  });
                  this.init();
                }else{
                  this.$message({
                    type: 'info',
                    message: `操作失败`
                  });
                }
              })
              .catch(res=>{
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
        }
      }
    }
</script>

<style scoped>

</style>
