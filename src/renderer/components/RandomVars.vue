<template>
  <div class="div-container">
    <div class="div-search">
      <div class="text-div">随机变量</div>
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
        :data="tableData.filter(data => !search || data.value.toLowerCase().includes(search.toLowerCase()))"
        class="el-table-style"
        border
        :cell-style="setCellStyle"
        :header-cell-style="setHeadCellStyle"
        highlight-current-row
        height="500"
        ref="table"
        :show-header="false"
        @current-change="currentChange"
      >
        <el-table-column label="字符串">
          <template slot-scope="scope">
            <div>
              <el-input size="small" v-model="scope.row.value"></el-input>
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
//设置表格的index
let staticindex = 1;
export default {
  name: "RandomVars",
  tindex: "",
  data() {
    return {
      tableData: [
        {
          value: "2016-05-02",
          index: "1"
        },
        {
          value: "2016-05-04",
          index: "2"
        }
      ],
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
        value: "",
        index: ++staticindex
      });
    },
    //表格选中事件
    currentChange(val) {
      if (val != null) this.tindex = val.index;
    },
    openFile() {
      console.log("打开写有随机变量的文件");
    }
  }
};
</script>