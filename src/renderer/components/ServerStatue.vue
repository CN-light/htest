<template>
  <div
    id="echart"
    style="width:90%; height:81%;padding:6% 5%;display:flex;justify-content: center;"
  ></div>
</template>
<script>
import echarts from "echarts";
export default {
  name: "ServerStatue",
  data() {
    return {
      xdata:[],
      memory: [],
      disk: []
    };
  },
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      let echart = this.$echarts.init(
        document.getElementById("echart"),
        "dark"
      );
      window.onresize = echart.onresize;
      // 绘制图表
      var option = {
        title: {
          text: "服务器性能监测",
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
          data: ["内存使用率", "磁盘使用率"],
          left: "auto",
          top: "3%",
          right: "10%",
          bottom: "auto"
        },
        xAxis: {
          name: "ms",
          nameLocation: "end",
          type: "category",
          data: this.xdata
        },
        yAxis: {
          name: "%",
          nameLocation: "end",
          type: "value"
        },
        series: [
          {
            name: "内存使用率",
            data: this.memory,
            type: "line",
            smooth: true
          },
          {
            name: "磁盘使用率",
            data: this.disk,
            type: "line",
            smooth: true
          }
        ]
      };
      echart.setOption(option);
    }
  },
  props: ["tabData"],
  watch: {
    tabData: {
      handler(newValue, oldValue) {
        if (newValue != undefined && newValue != "") {
          var obj = JSON.parse(newValue);
          if (obj.id == "0000006") {
            this.xdata = obj.serverStatue.xdata;
            this.memory = obj.serverStatue.memory;
            this.disk = obj.serverStatue.disk;
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