<template>
  <div class="container">
    <el-form :model="request" :rules="rules" ref="request" label-width="100px">
      <div class="el-form-item-class">
        <el-form-item label="名称" prop="name">
          <el-input v-model="request.name"></el-input>
        </el-form-item>
      </div>
      <div class="el-form-item-class">
        <el-form-item label="备注">
          <el-input type="textarea" v-model="request.desc"></el-input>
        </el-form-item>
      </div>
      <div class="el-form-item-class">
        <div class="div-inputs">
          <div style="width:25%">
            <el-form-item label="协议">
              <el-select v-model="request.protocol" placeholder="协议" popper-class="popper-style">
                <el-option label="http" value="01"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="width:50%">
            <el-form-item label="服务器ip/名称">
              <el-input v-model="request.ip"></el-input>
            </el-form-item>
          </div>
          <div style="width:25%">
            <el-form-item label="端口号">
              <el-input v-model="request.port"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>

      <div class="el-form-item-class">
        <div class="div-inputs">
          <div style="width:25%">
            <el-form-item label="方法">
              <el-select v-model="request.method" placeholder="方法" popper-class="popper-style">
                <el-option label="GET" value="01"></el-option>
                <el-option label="HEAD" value="02"></el-option>
                <el-option label="POSTPOST" value="03"></el-option>
                <el-option label="DELETE" value="04"></el-option>
                <el-option label="PUT" value="05"></el-option>
                <el-option label="CONNECT" value="06"></el-option>
                <el-option label="OPTIONS" value="07"></el-option>
                <el-option label="TRACE" value="08"></el-option>
                <el-option label="PATCH" value="09"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="width:50%">
            <el-form-item label="请求路径">
              <el-input v-model="request.path"></el-input>
            </el-form-item>
          </div>
          <div style="width:25%">
            <el-form-item label="内容编码">
              <el-input v-model="request.contentEcoding"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="el-form-item-class">
        <el-form-item label="请求头部">
          <el-select v-model="request.header" placeholder="请求头部" popper-class="popper-style">
            <el-option label="系统默认" value="default"></el-option>
            <el-option label="用户自定义" value="user_define"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="el-form-item-class">
        <el-form-item label="请求数据体">
          <el-input type="textarea" v-model="request.rdata" :rows="4"></el-input>
        </el-form-item>
      </div>
      <div class="div-beizhu">备注：用户在http管理种定义所需要的请求头部；若在此节点下配置参数表，则全局参数表不生效</div>
      <div class="el-form-item-class">
        <el-form-item>
          <div class="buttons-div">
            <el-button type="primary" @click="submitForm('request')" class="form-el-button">确定</el-button>
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
  name: "HttpRequest",
  data() {
    return {
      request: {
        name: "",
        desc: "",
        ip: "",
        protocol: "01",
        port: "",
        path: "",
        method: "01",
        contentEcoding: "",
        header: "default",
        rdata: ""
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
          this.$emit("submitOrCancel", "5"+this.request.name);
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
      this.ip = newValue.ip;
      this.protocol = newValue.protocol;
      this.port = newValue.port;
      this.path = newValue.path;
      this.method = newValue.method;
      this.contentEcoding = newValue.contentEcoding;
      this.header = newValue.header;
      this.rdata = newValue.rdata;
    }
  }
};
</script>