<template>
  <el-container>
    <el-aside width="50px">
      <textarea class="line-number" ref="lines" disabled v-model="lines"></textarea>
    </el-aside>
    <el-main>
      <textarea
        class="text"
        wrap="off"
        ref="text"
        @focus="showLine"
        @keyup="showLine"
        v-model="text"
        @scroll="scroll"
        disabled
      ></textarea>
    </el-main>
  </el-container>
</template>
<script>
import utils from "../assets/js/fileUtils.js";
export default {
  name: "Log",
  data() {
    return {
      text: "",
      lines: ""
    };
  },
  methods: {
    showLine() {
      var str = this.text.replace(/\r/g, "");
      str = str.split("\n");
      var num = "";
      for (var i = 1; i <= str.length; i++) {
        num += i + "\n";
      }
      this.lines = num;
    },
    scroll() {
      this.$refs.lines.scrollTop = this.$refs.text.scrollTop;
    }
  },
  props: ["tabData"],
  watch: {
    tabData: {
      handler(newValue, oldValue) {
        var obj = JSON.parse(newValue);
        if (obj.id == "0000000") {
          var path = obj.path;
          if (path == "") {
            path = require("path").join(__dirname, "../../../log/log.log")
          }
          this.text = utils.fileRead(path)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.showLine();
  }
};
</script>
<style src="../assets/css/text_area.css" scoped>
</style>