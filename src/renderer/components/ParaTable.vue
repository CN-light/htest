<template>
  <div class="div-container">
    <div class="div-search">
      <div class="text-div">请求参数设置</div>
      <div class="div-options">
        <el-input v-model="search" placeholder="关键字" class="special-input" />
        <el-button-group>
          <el-tooltip
            class="item"
            effect="dark"
            content="从文件导入"
            placement="bottom"
            :open-delay="1500"
          >
            <el-button type="primary" class="header-button" @click="openFile">
              <span class="icon iconfont iconfile-add"></span>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="添加" placement="bottom" :open-delay="1500">
            <el-button type="primary" class="header-button" @click="addReword">
              <span class="icon iconfont iconadd"></span>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom" :open-delay="1500">
            <el-button type="primary" class="header-button" @click="deleteReword">
              <span class="icon iconfont icondelete"></span>
            </el-button>
          </el-tooltip>
        </el-button-group>
      </div>
    </div>
    <div class="div-table">
      <el-table
        :data="tableData.filter(data => !search 
      || data.key.toLowerCase().includes(search.toLowerCase()) 
      || data.value.toLowerCase().includes(search.toLowerCase())
      || data.ecoding.toLowerCase().includes(search.toLowerCase()))"
        class="el-table-style"
        border
        :cell-style="setCellStyle"
        :header-cell-style="setHeadCellStyle"
        highlight-current-row
        height="500"
        ref="table"
        @current-change="currentChange"
      >
        <el-table-column label="名称">
          <template slot-scope="scope">
            <div>
              <el-input size="small" v-model="scope.row.key"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="值">
          <template slot-scope="scope">
            <div>
              <el-input size="small" v-model="scope.row.value" @blur="update"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="编码">
          <template slot-scope="scope">
            <div>
              <el-input size="small" v-model="scope.row.ecoding" @blur="update"></el-input>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<style src="../assets/css/table.css" scoped>
</style>
<script>
const { dialog, app } = require("electron").remote;
import utils from "../assets/js/fileUtils.js";
//设置表格的index
let staticindex = 1;
export default {
  name: "ParaTable",
  tindex: "",
  data() {
    return {
      id: "",
      tableData: [],
      search: ""
    };
  },
  methods: {
    //表格样式
    setCellStyle() {
      return "background-color:#3c3c3c;";
    },
    setHeadCellStyle() {
      return "background-color:#3c3c3c;color: #cccccc;padding-left:15px";
    },
    //删除表中所选记录
    deleteReword() {
      let ii = -1;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].index == this.tindex) {
          ii = i;
          break;
        }
      }
      if (ii != -1) {
        this.tableData.splice(ii, 1);
      }
    },
    //向表中追加一条记录
    addReword() {
      this.tableData.push({
        key: "",
        value: "",
        ecoding: "",
        index: ++staticindex
      });
    },
    //表格选中事件
    currentChange(val) {
      if (val != null) this.tindex = val.index;
    },
    openFile() {
      dialog.showOpenDialog(
        { filters: [{ name: "JSON", extensions: ["json"] }] },
        event => {
          if (event != undefined) {
            var string = utils.fileRead(event[0]);
            if (utils.httpParaFileCheck(string)) {
              var obj = JSON.parse(string);
              for(let i = 0; i < obj.length; i++){
                this.tableData.push(obj[i]);
              }
            } else {
              const options = {
                type: "error",
                title: app.getName(),
                message: "文件格式不正确，无法识别"
              };
              dialog.showMessageBox(options);
            }
          }
        }
      );
    },
    update() {
      let t = {
        id: this.id,
        tableData: this.tableData
      }
      this.$emit(
        "updateTableData",
        JSON.stringify(t).replace(/,\"index\":\d+/g, "")
      );
    }
  },
  props: ["tabData"],
  watch: {
    tableData(newValue, oldValue) {
      let t = {
        id: this.id,
        tableData: newValue
      }
      this.$emit(
        "updateTableData",
        JSON.stringify(t).replace(/,\"index\":\d+/g, "")
      );
    },
    tabData: {
      handler(newValue, oldValue) {
        if (newValue != undefined && newValue != "") {
          var obj = JSON.parse(newValue);
          if (this.id == "") {
            this.id = obj.id;
            if(this.para != undefined)
              this.tableData = obj.para.tableData;
          } else if (this.id == obj.id) {
            if(this.para != undefined)
            this.tableData = obj.para.tableData;
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>