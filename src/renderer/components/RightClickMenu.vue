// 右键点击弹出菜单组件
<template>
  <div>
    <div id="menu" class="menu">
      <div class="menu__item" v-show="add_vuser" @click="sendCommand($event)"><div class="div-op">添加虚拟用户组</div><div class="div-key"></div></div>
      <div class="menu__item" v-show="add_var" @click="sendCommand($event)"><div class="div-op">添加请求参数表</div><div class="div-key"></div></div>
      <div class="menu__item" v-show="add_http_header" @click="sendCommand($event)"><div class="div-op">添加Http头部参数表</div><div class="div-key"></div></div>
      <div class="menu__item" v-show="add_random_vars" @click="sendCommand($event)"><div class="div-op">添加随机变量表</div><div class="div-key"></div></div>
      <div class="menu__item" v-show="add_http" @click="sendCommand($event)"><div class="div-op">添加Http请求</div><div class="div-key"></div></div>
      <el-divider></el-divider>
      <div class="menu__item" @click="sendCommand($event)"><div class="div-op">编辑</div><div class="div-key"></div></div>
      <div class="menu__item" @click="sendCommand($event)"><div class="div-op">删除</div><div class="div-key">Ctrl+D</div></div>
      <div class="menu__item" @click="sendCommand($event)"><div class="div-op">重命名</div><div class="div-key">Ctrl+Alt+R</div></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "RightClickMenu",
  data() {
    return {
      add_vuser: this.options.charAt(0) == "1" ? true : false,
      add_var: this.options.charAt(1) == "1" ? true : false,
      add_http_header: this.options.charAt(2) == "1" ? true : false,
      add_random_vars: this.options.charAt(3) == "1" ? true : false,
      add_http: this.options.charAt(4) == "1" ? true : false,
    };
  },
  methods: {
    sendCommand(e) {
      this.$emit("menuOperation", e.target.innerHTML);
    }
  },
  props: ["options"],
  watch: {
    options(newValue, oldValue) {
      this.add_vuser = newValue.charAt(0) == "1" ? true : false;
      this.add_var = newValue.charAt(1) == "1" ? true : false;
      this.add_http_header = newValue.charAt(2) == "1" ? true : false;
      this.add_random_vars = newValue.charAt(3) == "1" ? true : false;
      this.add_http = newValue.charAt(4) == "1" ? true : false;
    }
  }
};
</script>