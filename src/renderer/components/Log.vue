// 查看日志
<template>
<span>
  <el-input type="textarea" v-model="log" :rows="30"></el-input>
</span>
    
</template>
<script>
export default {
  name: "Log",
  data() {
    return {
      log: ""
    };
  }
};
</script>
<style src="../assets/css/textarea2.css" scoped>
/*@import "../assets/css/textarea2.css"*/
</style>