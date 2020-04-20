<template>
<span>
  <el-input type="textarea" v-model="settings" :rows="32"></el-input>
</span>
    
</template>
<script>
export default {
  name: "Settings",
  data() {
    return {
      settings: ""
    };
  }
};
</script>
<style src="../assets/css/textarea2.css" scoped>
/*@import "../assets/css/textarea2.css"*/
</style>