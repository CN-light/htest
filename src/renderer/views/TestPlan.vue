// 测试计划页面
<template>
  <div class="container">
    <el-form :model="testplan" :rules="rules" ref="testplan" label-width="100px">
      <div class="el-form-item-class">
        <el-form-item label="名称" prop="name">
          <el-input v-model="testplan.name"></el-input>
        </el-form-item>
      </div>
      <div class="el-form-item-class">
        <el-form-item label="备注">
          <el-input type="textarea" v-model="testplan.desc" class="log"></el-input>
        </el-form-item>
      </div>
      <div class="el-form-item-class">
        <el-form-item label="执行方式">
          <el-select v-model="testplan.mode" placeholder="执行方式" popper-class="popper-style">
            <el-option label="加压执行" value="jiaya"></el-option>
            <el-option label="顺序执行" value="shunxu"></el-option>
            <el-option label="定时执行" value="dingshi"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="el-form-item-class" v-show="testplan.mode == 'dingshi' ? true : false">
        <el-form-item label="定时开始时间">
          <el-col :span="11">
            <el-form-item>
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="testplan.date"
                popper-class="popper-style"
                style="width: 100%;color: #606266;"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item>
              <el-time-picker
                placeholder="选择时间"
                v-model="testplan.time"
                popper-class="popper-style"
                style="width: 100%;color: #606266;"
                value-format="HH:mm:SS"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
      </div>
      <div class="el-form-item-class">
        <el-form-item label="日志级别">
          <el-select v-model="testplan.logLevel" placeholder="日志级别" popper-class="popper-style">
            <el-option label="ALL" value="ALL"></el-option>
            <el-option label="TRACE" value="TRACE"></el-option>
            <el-option label="DEBUG" value="DEBUG"></el-option>
            <el-option label="INFO" value="INFO"></el-option>
            <el-option label="WARN" value="WARN"></el-option>
            <el-option label="ERROR" value="ERROR"></el-option>
            <el-option label="FATAL" value="FATAL"></el-option>
            <el-option label="OFF" value="OFF"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="执行策略">
        <el-select
          v-model="testplan.region"
          placeholder="执行策略"
          popper-class="popper-style"
          style="width:100%"
        >
          <el-option label="出错后停止" value="stop"></el-option>
          <el-option label="出错后继续执行" value="continue"></el-option>
        </el-select>
      </el-form-item>
      <div class="el-form-item-class">
        <el-form-item label="其他功能">
          <el-checkbox-group v-model="testplan.others">
            <div class="checkbox-div">
              <el-checkbox label="保存服务器返回数据到本地" name="type"></el-checkbox>
              <el-checkbox label="启动前自动保存" name="type"></el-checkbox>
            </div>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <div class="el-form-item-class">
        <el-form-item>
          <div class="buttons-div">
            <el-button type="primary" @click="submitForm()" class="form-el-button">确定</el-button>
            <el-button class="form-el-button" @click="cancelForm()">取消</el-button>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<style src="../assets/css/formstyle.css" scoped>
/*@import "../assets/css/formstyle.css";*/
</style>
<script>

export default {
  name: "TestPaln",
  data() {
    return {
      testplan: {
        name: "",
        desc: "",
        mode: "shunxu",//默认执行方式
        date: "",
        time: "",
        logLevel: "DEBUG",//默认日志级别
        region: "stop",
        others: ["启动前自动保存"]
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs["testplan"].validate(valid => {
        if (valid) {
          this.$emit("submitOrCancel", "1"+JSON.stringify(this.testplan));
        } else {
          return false;
        }
      });
    },
    cancelForm(e){
      this.$emit("submitOrCancel", "0");
    }
  },
  props:["dialogData"],
  watch:{
    dialogData(newValue, oldValue){
      this.name = newValue.name;
      this.desc = newValue.desc;
      this.mode = newValue.mode;
      this.date = newValue.date;
      this.time = newValue.time;
      this.logLevel = newValue.logLevel;
      this.region = newValue.region;
      this.others = newValue.others;
    }
  }
};
</script>