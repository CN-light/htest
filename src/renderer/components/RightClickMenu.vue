// 右键点击弹出菜单组件
<template>
  <div>
    <div id="menu" class="menu">
      <div class="menu__item" v-show="add_vuser" @click="sendCommand($event)"><div class="div-op">添加虚拟用户组</div><div class="div-key"></div></div>
      <div class="menu__item" v-show="add_var" @click="sendCommand($event)"><div class="div-op">添加请求参数表</div><div class="div-key"></div></div>
      <div class="menu__item" v-show="add_http_manager" @click="sendCommand($event)"><div class="div-op">添加Http管理器</div><div class="div-key"></div></div>
      <div class="menu__item" v-show="add_http" @click="sendCommand($event)"><div class="div-op">添加Http请求</div><div class="div-key"></div></div>
      <div class="menu__item" v-show="set_assert" @click="sendCommand($event)"><div class="div-op">设置断言</div><div class="div-key"></div></div>
      <div class="menu__item" v-show="show_assert" @click="sendCommand($event)"><div class="div-op">查看断言结果</div><div class="div-key"></div></div>
      <el-divider></el-divider>
      <div class="menu__item" @click="sendCommand($event)"><div class="div-op">编辑</div><div class="div-key">Ctrl+E</div></div>
      <div class="menu__item" @click="sendCommand($event)"><div class="div-op">删除</div><div class="div-key">Ctrl+D</div></div>
      <div class="menu__item" @click="sendCommand($event)"><div class="div-op">重命名</div><div class="div-key">F2</div></div>
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
      add_http_manager: this.options.charAt(2) == "1" ? true : false,
      add_http: this.options.charAt(3) == "1" ? true : false,
      set_assert: this.options.charAt(4) == "1" ? true : false,
      show_assert: this.options.charAt(5) == "1" ? true : false
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
      this.add_http_manager = newValue.charAt(2) == "1" ? true : false;
      this.add_http = newValue.charAt(3) == "1" ? true : false;
      this.set_assert = newValue.charAt(4) == "1" ? true : false;
      this.show_assert = newValue.charAt(5) == "1" ? true : false;
    }
  }
};
</script>