<template>
  <div class="div-container">
    <div class="div-show">
      <el-select
        v-model="value"
        placeholder="请选择"
        popper-class="popper-style"
        style="width:100%;margin-bottom:2%"
        @change="showBody"
      >
        <el-option
          v-for="item in options"
          :key="item.label"
          :label="item.label"
          :value="item.label"
        ></el-option>
      </el-select>
      <el-input type="textarea" v-model="bodyText" resize="none" :rows="20" readonly></el-input>
    </div>
  </div>
</template>

<style src="../assets/css/result.css" scoped>
</style>

<script>
export default {
  name: "Result",
  data() {
    return {
      options: [],
      value: "",
      body: [],
      bodyText: ""
    };
  },
  methods: {
    showBody() {
      for (let i = 0; i < this.body.length; i++) {
        if (this.value == this.body[i].rename) {
          this.bodyText = this.body[i].rebody;
          break;
        }
      }
    }
  },
  props: ["tabData"],
  watch: {
    tabData: {
      handler(newValue, oldValue) {
        if (newValue != undefined && newValue != "") {
          var obj = JSON.parse(newValue);
          if (obj.id == "0000002") {
            for (let i = 0; i < obj.result.length; i++) {
              this.body.push(obj.result[i]);
              this.options.push({label:obj.result[i].rename})
            }
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>