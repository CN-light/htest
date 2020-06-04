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
      ></textarea>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "Settings",
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
        if (obj.id == "0000001") {
          this.text = JSON.stringify(obj.settings).replace(/,/g,",\r\n").replace(/\{/g,"{\r\n").replace(/\}/g, "\r\n}")
          this.showLine();
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