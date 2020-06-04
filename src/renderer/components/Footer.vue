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
        <div class="div-time">{{hour}}:{{minute}}:{{second}}</div>
        <!-- <div class="div-time">{{tim}}</div> -->
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
const ipcRenderer = require("electron").ipcRenderer;
export default {
  name: "FooterButtons",
  data() {
    return {
      second: "00",
      minute: "00",
      hour: "00",
      warningNum: 0,
      errorNum: 0,
      isRunning: false,
      timer: ""
    };
  },
  methods: {
    viewLog() {
      ipcRenderer.send("menu-to-main", "view log");
    },
    sendBug() {
      const { shell } = require("electron");
      shell.openExternal("https://www.baidu.com");
    },
    contactAuthor() {
      const { shell } = require("electron");
      shell.openExternal("https://www.baidu.com");
    },
    //计时器
    time() {
      // var d = new Date();
      // var t = d.toLocaleTimeString();
      // this.tim = t;
      // console.log(this.hour+this.minute+this.second)
      if (this.isRunning) {
        if (parseInt(this.second) < 59) {
          var tsecond = parseInt(this.second);
          tsecond++;
          if (tsecond < 10) {
            this.second = "0" + tsecond;
          } else {
            this.second = "" + tsecond;
          }
        } else {
          this.second = "00";
          if (parseInt(this.minute) < 59) {
            var tminute = parseInt(this.minute);
            tminute++;
            if (tminute < 10) {
              this.minute = "0" + tminute;
            } else {
              this.minute = "" + tminute;
            }
          } else {
            this.minute = "00";
            var thour = parseInt(this.hour);
            thour++;
            if (thour < 10) {
              this.hour = "0" + thour;
            } else {
              this.hour = "" + thour;
            }
          }
        }
      }
    },
    reset(){
      this.second = "00";
      this.hour = "00";
      this.minute = "00";
    }
  },
  props: ["footData"],
  watch: {
    footData: {
      handler(newValue, oldValue) {
        var int;
        var obj = JSON.parse(newValue);
        this.warningNum = obj.warningNum;
        this.errorNum = obj.errorNum;
        this.isRunning = obj.isRunning;
        if (this.isRunning == true) {
          this.hour = "00";
          this.minute = "00";
          this.second = "00";
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.timer = setInterval(this.time, 1000);
  }
};
</script>