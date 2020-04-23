// 设置断言
<template>
  <div class="container">
    <el-form :model="assert" :rules="rules" ref="assert" label-width="100px">
      <div class="el-form-item-class">
        <el-form-item label="名称" prop="name">
          <el-input v-model="assert.name"></el-input>
        </el-form-item>
      </div>
      <div class="el-form-item-class">
        <el-form-item label="备注">
          <el-input type="textarea" v-model="assert.desc"></el-input>
        </el-form-item>
      </div>
      <div class="el-form-item-class">
        <el-form-item label="测试字段">
          <el-select v-model="assert.field" placeholder="测试字段" popper-class="popper-style">
            <el-option label="响应状态" value="status"></el-option>
            <el-option label="响应头" value="header"></el-option>
            <el-option label="响应正文" value="maintext"></el-option>
          </el-select>
        </el-form-item>
        <div class="el-form-item-class">
          <el-form-item label="匹配规则">
            <el-select v-model="assert.rule" placeholder="匹配规则" popper-class="popper-style">
              <el-option label="相等" value="equal"></el-option>
              <el-option label="包括" value="include"></el-option>
              <el-option label="匹配" value="match"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="el-form-item-class">
        <el-form-item label="定义失败消息">
          <el-input type="textarea" v-model="assert.failmsg" :rows="7"></el-input>
        </el-form-item>
      </div>
        <div class="el-form-item-class">
        <el-form-item>
          <div class="buttons-div">
            <el-button type="primary" @click="submitForm('assert')" class="form-el-button">确定</el-button>
            <el-button class="form-el-button" @click="cancelForm()">取消</el-button>
          </div>
        </el-form-item>
      </div>
      </div>
    </el-form>
  </div>
</template>
<style src="../assets/css/formstyle.css" scoped>
/*@import "../assets/css/formstyle.css";*/
</style>
<script>
export default {
  name: "Assert",
  data() {
    return {
      assert: {
        name: "",
        desc: "",
        field: "status",
        rule: "equal",
        failmsg: ""
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("submitOrCancel", "6"+this.assert.name);
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
      this.field = newValue.field;
      this.rule = newValue.rule;
      this.failmsg = newValue.failmsg;
    }
  }
};
</script>