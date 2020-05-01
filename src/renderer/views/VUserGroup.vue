//虚拟用户组界面
<template>
  <div id="container">
    <el-form :model="vuser" :rules="rules" ref="vuser" label-width="100px">
      <div class="el-form-item-class">
        <el-form-item label="名称" prop="name">
          <el-input v-model="vuser.name"></el-input>
        </el-form-item>
      </div>
      <div class="el-form-item-class">
        <el-form-item label="备注">
          <el-input type="textarea" v-model="vuser.desc"></el-input>
        </el-form-item>
      </div>
      <div class="el-form-item-class">
        <el-form-item label="名称前缀">
          <el-input v-model="vuser.prefix"></el-input>
        </el-form-item>
      </div>
      <div class="el-form-item-class">
        <div class="div-inputs">
          <div style="width:50%">
            <el-form-item label="虚拟用户数">
              <el-input-number v-model="vuser.number" :min="1" :max="500" style="width:100%"></el-input-number>
            </el-form-item>
          </div>
          <div style="width:50%">
            <el-form-item label="循环次数">
              <el-input-number v-model="vuser.cycleCount" :min="1" style="width:100%"></el-input-number>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="el-form-item-class">
        <div class="div-inputs">
          <div style="width:50%">
            <el-form-item label="间隔时间(ms)">
              <el-input-number v-model="vuser.intervalTime" :min="0" style="width:100%"></el-input-number>
            </el-form-item>
          </div>
           <div style="width:50%">
            <el-form-item label="用户数增量">
              <el-input-number v-model="vuser.increment" :min="0" :max="20" style="width:100%"></el-input-number>
            </el-form-item>
          </div>
        </div>
      </div>
      <el-form-item label="模式">
        <el-select
          v-model="vuser.mode"
          placeholder="请选择模式"
          popper-class="popper-style"
          style="width:100%"
        >
          <el-option label="执行同一种请求" value="same"></el-option>
          <el-option label="执行不同的请求" value="different"></el-option>
        </el-select>
      </el-form-item>
      <div class="div-beizhu">备注：若选择执行相同的请求，则该节点下最多只能设置一个http请求。</div>
      <div class="el-form-item-class">
        <el-form-item>
          <div class="buttons-div">
            <el-button type="primary" @click="submitForm('vuser')" class="form-el-button">确定</el-button>
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
  name: "VUserGroup",
  data() {
    return {
      vuser: {
        name: "",
        desc: "",
        number: "",
        intervalTime: "",
        cycleCount: "",
        increment: "",
        prefix: "",
        mode: "different"
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
          if (this.vuser.mode == "different")
            this.$emit("submitOrCancel", "2" + JSON.stringify(this.vuser));
          else this.$emit("submitOrCancel", "7" + JSON.stringify(this.vuser));
        } else {
          return false;
        }
      });
    },
    cancelForm(e) {
      this.$emit("submitOrCancel", "0");
    }
  },
  props: ["dialogData"],
  watch: {
    dialogData(newValue, oldValue) {
      this.name = newValue.name;
      this.desc = newValue.desc;
      this.number = newValue.number;
      this.intervalTime = newValue.intervalTime;
      this.cycleCount = newValue.cycleCount;
      this.prefix = newValue.prefix;
      this.mode = newValue.mode;
      this.increment = newValue.increment;
    }
  }
};
</script>