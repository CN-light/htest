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
        <el-form-item label="线程名称前缀">
          <el-input v-model="vuser.prefix"></el-input>
        </el-form-item>
      </div>
      <div class="el-form-item-class">
        <div class="div-inputs">
          <div style="width:33%">
            <el-form-item label="虚拟用户数">
              <el-input-number v-model="vuser.number" :min="1" style="width:100%"></el-input-number>
            </el-form-item>
          </div>
          <div style="width:34%">
            <el-form-item label="间隔时间(秒)">
              <el-input v-model="vuser.intervalTime"></el-input>
            </el-form-item>
          </div>
          <div style="width:33%">
            <el-form-item label="循环次数">
              <el-input-number v-model="vuser.cycleCount" :min="1" style="width:100%"></el-input-number>
            </el-form-item>
          </div>
        </div>
      </div>
      <el-form-item label="执行策略">
        <el-select
          v-model="vuser.region"
          placeholder="执行策略"
          popper-class="popper-style"
          style="width:100%"
        >
          <el-option label="出错后停止当前用户组" value="stopnow"></el-option>
          <el-option label="出错后停止全部用户组" value="stopall"></el-option>
          <el-option label="出错后继续执行当前用户组" value="continuenow"></el-option>
          <el-option label="出错后执行下一个用户组" value="continuenext"></el-option>
          <el-option label="出错后执行当前用户组下一个循环" value="continuenextloop"></el-option>
        </el-select>
      </el-form-item>
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
      <div class="div-beizhu">备注：若选择执行不同的请求，则会对该用户组下的所有请求执行相同次数，即总次数/请求种类数；</div>
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
        intervalTime: "5",
        cycleCount: "5",
        prefix: "",
        mode: "different",
        region: "stopnow"
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
          if(this.vuser.mode == "different")
            this.$emit("submitOrCancel", "2"+this.vuser.name);
          else
            this.$emit("submitOrCancel", "7"+this.vuser.name);
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
      this.number = newValue.number;
      this.intervalTime = newValue.intervalTime;
      this.cycleCount = newValue.cycleCount;
      this.prefix = newValue.prefix;
      this.mode = newValue.mode;
      this.region = newValue.region;
    }
  }
};
</script>