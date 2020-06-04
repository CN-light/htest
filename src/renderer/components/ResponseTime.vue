<template>
  <div
    id="echarts"
    style="width:90%; height:81%;padding:6% 5%;display:flex;justify-content: center;"
  ></div>
</template>
<script>
import echarts from "echarts";
export default {
  name: "ResponseTime",
  data() {
    return {
      xdata: [],
      ydata: []
    };
  },
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      let echarts = this.$echarts.init(
        document.getElementById("echarts"),
        "dark"
      );
      window.onresize = echarts.onresize;
      // 绘制图表
      var option = {
        title: {
          text: "响应时间",
          textAlign: "center",
          left: "50%",
          top: "2%",
          right: "auto",
          bottom: "auto"
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          data: ["响应时间"],
          left: "auto",
          top: "3%",
          right: "10%",
          bottom: "auto"
        },
        xAxis: {
          name: "请求序列",
          nameLocation: "end",
          type: "category",
          data: this.xdata
        },
        yAxis: {
          name: "响应时间(ms)",
          nameLocation: "end",
          type: "value"
        },
        series: [
          {
            name: "响应时间",
            data: this.ydata,
            type: "line",
            smooth: true
          }
        ]
      };
      echarts.setOption(option);
    }
  },
  props: ["tabData"],
  watch: {
    tabData: {
      handler(newValue, oldValue) {
        if (newValue != undefined && newValue != "") {
          var obj = JSON.parse(newValue);
          if (obj.id == "0000003") {
            this.xdata = obj.time.xdata;
            this.ydata = obj.time.ydata;
          }
        }
      },
      deep: true, 
      immediate: true
    }
  }
};
</script>
<style scoped>
</style>