<template>
  <div id="addcategory">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="类别名称">
        <el-input v-model="form.categoryName"></el-input>
      </el-form-item>
      <el-form-item label="是否禁用">
        <el-switch v-model="form.delivery"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即添加</el-button>
        <el-button @click="clear">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  var url = "http://114.116.238.138:9090"
  export default {
    name: "addcategory",
    data() {
      return {
        form: {
          categoryName: '',
          delivery: false,
        },
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {
      clear() {
        this.form = {
          categoryName: '',
          delivery: false
        }
      },
      onSubmit() {
        var status = 0
        if (this.form.delivery == true) {
          status = 1;
        }
        var param = this.$qs.stringify({
          categoryName: this.form.categoryName,
          categoryStatus: status
        })
        this.$axios.post(url + "/category/insert", param)
          .then(res => {
            if (res.data.status == 200) {
              this.$message("创建成功")
              this.clear();
            } else {
              this.$message("创建失败")
            }
          })
          .catch(res => {
            console.log("创建异常")
          })
      },
    }
  }
</script>

<style scoped>
  #addcategory{
    width: 25%;
    margin-top: 20px;
  }
</style>
