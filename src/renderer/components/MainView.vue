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
  name: "MainView",
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
        if (newValue != undefined && newValue != "") {
          var obj = JSON.parse(newValue);
          if (obj.id == "0000005") {
            this.text = JSON.stringify(obj.fileData)
              .replace(/,/g, ",\r\n")
              .replace(/\{/g, "{\r\n")
              .replace(/\}/g, "\r\n}")
              // .replace(/settings/g, "设置")
              // .replace(/logPath/g, "日志文件路径")
              // .replace(/responsePath/g, "服务器返回数据保存路径")
              // .replace(/testPlan/g, "测试计划")
              // .replace(/name/g, "名称")
              // .replace(/desc/g, "备注")
              // .replace(/serverIp/g, "服务器ip")
              // .replace(/mode/g, "模式")
              // .replace(/date/g,"日期")
              // .replace(/time/g, "时间")
              // .replace(/logLevel/g, "日志级别")
              // .replace(/region/g, "策略")
              // .replace(/others/g, "其他")
              // .replace(/vUserGroup/g, "虚拟用户组")
              // .replace(/number/g, "数量")
              // .replace(/intervalTime/g, "间隔时间")
              // .replace(/cycleCount/g, "循环次数")
              // .replace(/increment/g, "增量")
              // .replace(/prefix/g, "线程前缀")
              // .replace(/protocol/g, "协议")
              // .replace(/port/g, "端口号")
              // .replace(/path/g, "路径")
              // .replace(/method/g, "方法")
              // .replace(/random/g, "随机变量")
              // .replace(/rdata/g, "请求体")
              // .replace(/paraTable/g, "请求参数表")
              // .replace(/httpHeader/g, "头部参数表")
              // .replace(/randomVars/g, "随机变量表")
            this.showLine();
          }
        }
      },
      deep: true,
      immediate: true
    },
    text(newValue, oldValue) {
      try {
        newValue = newValue
          .replace(/\r/g, "")
          .replace(/\n/g, "")
          // .replace(/设置/g, "settings")
          // .replace(/日志文件路径/g, "logPath")
          // .replace(/服务器返回数据保存路径/g, "responsePath")
          // .replace(/测试计划/g, "testPlan")
          // .replace(/名称/g, "name")
          // .replace(/备注/g, "desc")
          // .replace(/服务器ip/g, "serverIp")
          // .replace(/模式/g, "mode")
          // .replace(/日期/g,"date")
          // .replace(/时间/g, "time")
          // .replace(/日志级别/g, "logLevel")
          // .replace(/策略/g, "region")
          // .replace(/其他/g, "others")
          // .replace(/虚拟用户组/g,"vUserGroup")
          // .replace(/数量/g, "number")
          // .replace(/间隔时间/g, "intervalTime")
          // .replace(/循环次数/g, "cycleCount")
          // .replace(/增量/g, "increment")
          // .replace(/线程前缀/g, "prefix")
          // .replace(/协议/g, "protocol")
          // .replace(/端口号/g, "port")
          // .replace(/路径/g, "path")
          // .replace(/方法/g, "method")
          // .replace(/随机变量/g, "random")
          // .replace(/请求体/g, "rdata")
          // .replace(/请求参数表/g, "paraTable")
          // .replace(/头部参数表/g, "paraTable")
          // .replace(/随机变量表/g, "randomVars")
        let t = {
          id: "0000005",
          tableData: JSON.parse(newValue)
        };
        this.$emit("updateTableData", JSON.stringify(t));
      } catch (err) {
        console.log(err);
      }
    }
  },
  mounted() {
    this.showLine();
  }
};
</script>
<style src="../assets/css/text_area.css" scoped>
</style>