<template>
  <div class="div-container">
    <div class="div-left">
      <el-tooltip
        class="item"
        effect="dark"
        content="报告bug"
        placement="top-start"
        :open-delay="1000"
      >
        <div class="div-op" @click="sendBug">
          <span class="icon iconfont iconbug"></span>
        </div>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="联系作者"
        placement="top-start"
        :open-delay="1000"
      >
        <div class="div-op" @click="contactAuthor">
          <span class="icon iconfont iconemail1"></span>
        </div>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="已经执行时间"
        placement="top-start"
        :open-delay="1000"
      >
        <div class="div-time">{{runTime}}</div>
      </el-tooltip>
    </div>
    <div class="div-right">
      <div class="div-tishi-container">
        <el-tooltip
          class="item"
          effect="dark"
          content="警告"
          placement="top-start"
          :open-delay="1000"
        >
          <div class="div-tishi" @click="viewLog">
            <div class="div-tishi-number">{{warningNum}}</div>
            <span class="icon iconfont iconwarningo"></span>
          </div>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="错误"
          placement="top-start"
          :open-delay="1000"
        >
          <div class="div-tishi" @click="viewLog">
            <div class="div-tishi-number">{{errorNum}}</div>
            <span class="icon iconfont iconerror"></span>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<style src="../assets/css/footer.css" scoped>
/*@import "../assets/css/footer.css";*/
</style>
<script>
export default {
  name: "FooterButtons",
  data(){
    return{
      runTime:"00:00:00",
      warningNum:0,
      errorNum:0
    }
  },
  methods: {
    viewLog() {
      console.log("查看日志");
    },
    sendBug() {
      const { shell } = require("electron");
      shell.openExternal("https://www.baidu.com");
    },
    contactAuthor() {
      const { shell } = require("electron");
      shell.openExternal("https://www.baidu.com");
    }
  }
};
</script>