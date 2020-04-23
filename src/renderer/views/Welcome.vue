<template>
  <div class="div-container">
    <div class="div-image">
      <el-image class="image-style" :src="require('../assets/logo.png')" fit="fill"></el-image>
    </div>
    <div class="div-shortcutkeys">
      <div class="keys-container">
        <div class="left-div">新建计划</div>
        <div class="right-div">
          <div class="text-div">Ctrl</div>
          <div class="add-div">+</div>
          <div class="text-div">N</div>
        </div>
      </div>
      <div class="keys-container">
        <div class="left-div">打开计划文件</div>
        <div class="right-div">
          <div class="text-div">Ctrl</div>
          <div class="add-div">+</div>
          <div class="text-div">O</div>
        </div>
      </div>
      <div class="keys-container">
        <div class="left-div">执行计划</div>
        <div class="right-div">
          <div class="text-div">Ctrl</div>
          <div class="add-div">+</div>
          <div class="text-div">R</div>
        </div>
      </div>
      <div class="keys-container">
        <div class="left-div">切换开发者工具</div>
        <div class="right-div">
          <div class="text-div">Ctrl</div>
          <div class="add-div">+</div>
          <div class="text-div">Shift</div>
          <div class="add-div">+</div>
          <div class="text-div">I</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style src="../assets/css/welcome.css" scoped>
/*@import "../assets/css/welcome.css";*/
</style>
<script>
export default {
  name: "Welcome",
  data() {
    return {};
  }
};
</script>