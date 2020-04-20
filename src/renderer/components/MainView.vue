// 主页面
<template>
<span>
  <el-input type="textarea" v-model="mainText" :rows="32"></el-input>
</span>
    
</template>
<script>
export default {
  name: "MainView",
  data() {
    return {
      mainText: ""
    };
  }
};
</script>
<style src="../assets/css/textarea2.css" scoped>
/*@import "../assets/css/textarea2.css"*/
</style>