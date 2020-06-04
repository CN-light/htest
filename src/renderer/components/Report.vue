<template>
  <div class="div-container">
    <div class="div-collapse">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="响应时间汇总" name="responseTime">
          <div class="text">数&emsp;量：{{time.number}}</div>
          <div class="text">最小值：{{time.min}}</div>
          <div class="text">最大值：{{time.max}}</div>
          <div class="text">平均值：{{time.avg}}</div>
          <div class="text">中位数：{{time.middle}}</div>
          <div class="text">未响应：{{time.error}}</div>
        </el-collapse-item>
        <el-collapse-item title="响应结果汇总" name="result">
          <div class="text">数&emsp;&emsp;量：{{result.number}}</div>
          <div class="text">正常数量：{{result.correct}}</div>
          <div class="text">异常数量：{{result.incorrect}}</div>
          <div class="text">正&ensp;确&ensp;率：{{result.accuracy}}</div>
        </el-collapse-item>
        <el-collapse-item title="响应码统计" name="code">
          <div class="text">1**：{{code.one}}</div>
          <div class="text">2**：{{code.two}}</div>
          <div class="text">3**：{{code.three}}</div>
          <div class="text">4**：{{code.four}}</div>
          <div class="text">5**：{{code.five}}</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
export default {
  name: "Report",
  data() {
    return {
      activeNames: ["result", "responseTime", "code"],
      time: {
        number: "0",
        min: "0",
        max: "0",
        avg: "0",
        middle: "0",
        error: "0"
      },
      result: {
        number: "0",
        correct: "0",
        incorrect: "0",
        accuracy: "0"
      },
      code: {
        one: "0",
        two: "0",
        three: "0",
        four: "0",
        five: "0"
      }
    };
  },
  props: ["tabData"],
  watch: {
    tabData: {
      handler(newValue, oldValue) {
        if (newValue != undefined && newValue != "") {
          var obj = JSON.parse(newValue);
          if (obj.id == "0000004") {
            this.time = obj.report.time;
            this.code = obj.report.code;
            this.result = obj.report.result;
          }
        }
      },
      deep: true, 
      immediate: true
    }
  }
};
</script>
<style src="../assets/css/report.css" scoped>
</style>