<template>
  <el-col v-if="buttonList.length >0" :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true" @submit.native.prevent>
          <el-form-item>
              <el-input v-model="searchVal" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item v-for="item in buttonList">
              <el-button type="primary" @click="callFunc(item)">{{item.name}}</el-button>
          </el-form-item>
      </el-form>
  </el-col>
</template>

<script>
    export default {
        name: "Toolbar",
        data(){
            return {
                searchVal:""
            }
        },
        props:["buttonList"],
        methods:{
            callFunc(item){
                item.search=this.searchVal;
                this.$emit("callFunction",item);
            }
        }
    }
</script>

<style scoped>

</style>
