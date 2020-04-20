// 头部，排列常用按钮操作
<template>
  <div class="div-container">
    <el-button-group>
      <el-tooltip class="item" effect="dark" content="新建" placement="bottom" :open-delay="1500">
        <el-button type="primary" class="header-button" @click="buttonClick('新建')">
          <span class="icon iconfont iconfolder-new"></span>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="打开" placement="bottom" :open-delay="1500" id="button-open">
        <el-button type="primary" class="header-button" @click="buttonClick('打开')">
          <span class="icon iconfont iconfolder"></span>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="保存" placement="bottom" :open-delay="1500">
        <el-button type="primary" class="header-button" @click="buttonClick('保存')">
          <span class="icon iconfont iconsave"></span>
        </el-button>
      </el-tooltip>
    </el-button-group>

    <el-button-group>
      <el-tooltip class="item" effect="dark" content="启动" placement="bottom" :open-delay="1500">
        <el-button type="primary" class="header-button" @click="buttonClick('启动')">
          <span class="icon iconfont iconkaishi"></span>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="停止" placement="bottom" :open-delay="1500">
        <el-button type="primary" class="header-button" @click="buttonClick('停止')">
          <span class="icon iconfont iconstop"></span>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="重新启动" placement="bottom" :open-delay="1500">
        <el-button type="primary" class="header-button" @click="buttonClick('重新启动')">
          <span class="icon iconfont iconrestart"></span>
        </el-button>
      </el-tooltip>
    </el-button-group>
    <el-button-group>
      <el-tooltip class="item" effect="dark" content="查看结果" placement="bottom" :open-delay="1500">
        <el-button type="primary" class="header-button" @click="buttonClick('查看结果')">
          <span class="icon iconfont iconresult"></span>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="查看响应时间" placement="bottom" :open-delay="1500">
        <el-button type="primary" class="header-button" @click="buttonClick('查看响应时间')">
          <span class="icon iconfont iconresult1"></span>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="查看汇总报告" placement="bottom" :open-delay="1500">
        <el-button type="primary" class="header-button" @click="buttonClick('查看汇总报告')">
          <span class="icon iconfont iconreport"></span>
        </el-button>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="查看服务器状态"
        placement="bottom"
        :open-delay="1500"
      >
        <el-button type="primary" class="header-button" @click="buttonClick('查看服务器状态')">
          <span class="icon iconfont iconxingzhuang"></span>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="查看日志" placement="bottom" :open-delay="1500">
        <el-button type="primary" class="header-button" @click="buttonClick('查看日志')">
          <span class="icon iconfont iconchayuerizhi"></span>
        </el-button>
      </el-tooltip>
    </el-button-group>

    <el-button-group>
      <el-tooltip class="item" effect="dark" content="设置" placement="bottom" :open-delay="1500">
        <el-button type="primary" class="header-button" @click="buttonClick('设置')">
          <span class="icon iconfont iconsetting"></span>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="帮助" placement="bottom" :open-delay="1500">
        <el-button type="primary" class="header-button" @click="buttonClick('帮助')">
          <span class="icon iconfont iconhelp"></span>
        </el-button>
      </el-tooltip>
    </el-button-group>
  </div>
</template>
<style src="../assets/css/header.css" scoped>
/*@import "../assets/css/header.css";*/
</style>
<script>
export default {
  name: "HeaderButtons",
  methods: {
    buttonClick(val) {
      this.$emit("buttonOperation", val);
    }
  }
};
</script>