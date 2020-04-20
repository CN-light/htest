// 暂未实现两个file类型的按钮
<template>
  <div class="div-container">
    <div class="div-table-compont">
      <div class="div-search">
        <div class="text-div">http请求头部</div>
        <div class="div-options">
          <el-input v-model="search1" placeholder="关键字" class="special-input" />
          <el-button-group>
            <el-tooltip
              class="item"
              effect="dark"
              content="从文件导入"
              placement="bottom"
              :open-delay="1500"
            >
              <el-button type="primary" class="header-button" @click="openHeaderFile">
                <span class="icon iconfont iconfile-add"></span>
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="添加"
              placement="bottom"
              :open-delay="1500"
            >
              <el-button type="primary" class="header-button" @click="addReword(headerData)">
                <span class="icon iconfont iconadd"></span>
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="bottom"
              :open-delay="1500"
            >
              <el-button
                type="primary"
                class="header-button"
                @click="deleteReword(headerData,headerIndex)"
              >
                <span class="icon iconfont icondelete"></span>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <div class="div-table">
        <el-table
          :data="headerData.filter(data => !search1 || data.tname.toLowerCase().includes(search1.toLowerCase()) || data.tvalue.toLowerCase().includes(search1.toLowerCase()))"
          class="el-table-style"
          border
          :cell-style="setCellStyle"
          :header-cell-style="setHeadCellStyle"
          highlight-current-row
          height="250"
          @current-change="headerCurrentChange"
        >
          <el-table-column label="变量">
            <template slot-scope="scope">
              <div>
                <el-input size="small" v-model="scope.row.tname"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="值">
            <template slot-scope="scope">
              <div>
                <el-input size="small" v-model="scope.row.tvalue"></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="div-table-compont">
      <div class="div-search">
        <div class="text-div">cookie设置</div>
        <div class="div-options">
          <el-input v-model="search2" placeholder="关键字" class="special-input" />
          <el-button-group>
            <el-tooltip
              class="item"
              effect="dark"
              content="从文件导入"
              placement="bottom"
              :open-delay="1500"
            >
              <el-button type="primary" class="header-button" @click="openCookieFile">
                <span class="icon iconfont iconfile-add"></span>
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="添加"
              placement="bottom"
              :open-delay="1500"
            >
              <el-button type="primary" class="header-button" @click="addReword(cookieData)">
                <span class="icon iconfont iconadd"></span>
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="bottom"
              :open-delay="1500"
            >
              <el-button
                type="primary"
                class="header-button"
                @click="deleteReword(cookieData,cookieIndex)"
              >
                <span class="icon iconfont icondelete"></span>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <div class="div-table">
        <el-table
          :data="cookieData.filter(data => !search2 || data.tname.toLowerCase().includes(search2.toLowerCase()) || data.tvalue.toLowerCase().includes(search2.toLowerCase()))"
          class="el-table-style"
          border
          :cell-style="setCellStyle"
          :header-cell-style="setHeadCellStyle"
          highlight-current-row
          height="250"
          @current-change="cookieCurrentChange"
        >
          <el-table-column label="名称">
            <template slot-scope="scope">
              <div>
                <el-input size="small" v-model="scope.row.tname"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="值">
            <template slot-scope="scope">
              <div>
                <el-input size="small" v-model="scope.row.tvalue"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="域名">
            <template slot-scope="scope">
              <div>
                <el-input size="small" v-model="scope.row.tdomain"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="路径">
            <template slot-scope="scope">
              <div>
                <el-input size="small" v-model="scope.row.tpath"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="过期时间">
            <template slot-scope="scope">
              <div>
                <el-input size="small" v-model="scope.row.texpire"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="安全">
            <template slot-scope="scope">
              <div>
                <el-input size="small" v-model="scope.row.tsecure"></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<style src="../assets/css/http_manager.css" scoped>
/*@import "../assets/css/http_manager.css";*/
</style>
<script>
//设置表格的index
let staticindex = 1;
export default {
  name: "HttpManager",
  headerIndex: "",
  cookieIndex: "",
  data() {
    return {
      headerData: [
        {
          tname: "2016-05-02",
          tvalue: "王小虎",
          index: ""
        }
      ],
      cookieData: [
        {
          tname: "cookie的名称",
          tvalue: "cookie的值",
          tdomain: "可以访问此cookie的域名",
          tpath: "可以访问此cookie的页面路径",
          texpire: "cookie超时时间",
          tsecure: "是否只能通过https来传递此条cookie",
          index: ""
        }
      ],
      search1: "",
      search2: ""
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
    deleteReword(tableData, index) {
      let ii = -1;
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].index == index) {
          ii = i;
          break;
        }
      }
      if (ii != -1) {
        tableData.splice(ii, 1);
      }
    },
    //向表中追加一条记录
    addReword(tableData) {
      tableData.push({
        tkey: "",
        tvalue: "",
        tecoding: "",
        index: ++staticindex
      });
    },
    //表格选中事件
    headerCurrentChange(val) {
      if (val != null) this.headerIndex = val.index;
    },
    cookieCurrentChange(val) {
      if (val != null) this.cookieIndex = val.index;
    },
    //从外部文件导入
    openCookieFile() {
      console.log("打开写有cookie的文件");
    },
    openHeaderFile() {
      console.log("打开写有http头部参数的文件");
    }
  }
};
</script>