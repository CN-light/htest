<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #cccccc;
  margin: 0px;
  padding: 0px;
  height: 100%;
}
body {
  margin: 0px;
  padding: 0px;
  height: 100%;
  overflow: hidden;
  /* 阻止元素被选中 */
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
html {
  height: 100%;
  overflow: hidden;
}

body .el-table th.gutter {
  display: table-cell !important;
}

@import "./assets/css/styles.css"
</style>
