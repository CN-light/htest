<template>
  <el-container class="all-div">
    <el-header>
      <header-buttons @buttonOperation="handleButtonOperation"></header-buttons>
    </el-header>

    <el-container class="main-aside" v-if="hasPlan">
      <el-aside width="200px">
        <div id="text-div">资源管理器</div>
        <div class="block">
          <el-tree
            :data="data"
            node-key="id"
            ref="tree"
            icon-class="el-icon-arrow-right"
            check-on-click-node
            :expand-on-click-node="false"
            @node-contextmenu="treeRightClick"
            @node-click="leftClick"
            @keydown.ctrl.d.native="handleDelete"
            @keydown.ctrl.alt.r.native="handleRename"
          ></el-tree>
        </div>
      </el-aside>

      <el-main>
        <el-tabs type="card" v-model="editableTabsValue" closable @tab-remove="removeTab">
          <el-tab-pane
            v-for="(item) in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          >
            <component
              :is="item.content"
              :tabData="tabData"
              @updateTableData="handleUpdateTableData"
            ></component>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <el-container class="main-aside" v-else>
      <welcome></welcome>
    </el-container>

    <!-- 右键弹出菜单 -->
    <right-click-menu v-show="menuVisible" @menuOperation="handleMenuOperation" :options="options"></right-click-menu>

    <!-- 弹出表单 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogTableVisible"
      v-dialogDrag
      :close-on-click-modal="false"
    >
      <component :is="dialogForm" ref="dialog" @submitOrCancel="handleSubmitOrCancel"></component>
    </el-dialog>

    <el-footer>
      <footer-buttons :footData="JSON.stringify(footData)"></footer-buttons>
    </el-footer>
  </el-container>
</template>

<style src="../assets/css/layout.css" scope>
/*@import "../assets/css/right_click_menu.css";
@import "../assets/css/layout.css";*/
</style>

<script>
import "../assets/css/static/element.css";
import "../assets/css/right_click_menu.css";
import "../assets/js/directive.js";
import utils from "../assets/js/fileUtils.js";
import "../assets/font/iconfont.css";

import rightClickMenu from "../components/RightClickMenu";
import paraTable from "../components/ParaTable";
import headerButtons from "../components/Header";
import log from "../components/Log";
import httpHeader from "../components/HttpHeader";
import randomVars from "../components/RandomVars";
import footerButtons from "../components/Footer";
import settings from "../components/Settings";
import result from "../components/Result";
import mainView from "../components/MainView";
import report from "../components/Report";
import responseTime from "../components/ResponseTime";
import serverStatue from "../components/ServerStatue";

import testPlan from "../views/TestPlan";
import httpRequest from "../views/HttpRequest";
import vUserGroup from "../views/VUserGroup";
import welcome from "../views/Welcome";
import { on } from "cluster";

const ipcRenderer = require("electron").ipcRenderer;
const { dialog, app } = require("electron").remote;
/*树节点id规则
以i开头对节点类型分类，最高为9，即9种分类
1：代表测试计划节点
2：代表虚拟用户组节点（不同请求）
3：代表用户请求参数表节点
4：代表http头部参数表节点
5：代表http请求节点
7：代表虚拟用户组节点（相同请求）
8：代表随机变量表节点
0000000：日志界面
0000001：设置界面
0000002：结果界面
0000003：响应时间界面
0000004：报告界面
0000005：mainView
0000006：服务器状态
同时tab的name与节点id一致*/
let id = 100000;
export default {
  name: "Start",
  data() {
    return {
      //树节点的数据
      data: [],
      //node用来保存当前右键点击的节点的信息
      node: {},
      //树节点右键菜单是否显示
      menuVisible: false,
      //若当前没有测试计划则为false,显示welcome界面
      hasPlan: false,
      //控制树节点右键菜单显示方式
      options: "",
      //tab页
      editableTabs: [],
      //当前选中的tab
      editableTabsValue: "",
      //控制对话框表单的显示
      dialogTableVisible: false,
      //对话框表单的标题
      dialogTitle: "",
      //动态显示对话框表单的内容
      dialogForm: "",
      //保存路径
      savePath: "",
      temp: "",
      footData: {
        errorNum: 0,
        warningNum: 0,
        isRunning: false
      },

      // 要写入文件的数据
      fileData: {
        settings: {
          logPath: "",
          responsePath: ""
        },
        testPlan: {},
        vUserGroup: [],
        httpRequest: [],
        paraTable: [],
        httpHeader: [],
        randomVars: {}
      },
      //运行过后产生的数据
      responseTime: { xdata: [], ydata: [] },
      result: [],
      serverStatue: { xdata: [], memory: [], disk: [] },
      report: {
        time: {
          number: "0",
          min: "0",
          max: "0",
          avg: "0",
          middle: "0",
          error: "0"
        },
        result: {
          number: "0",
          correct: "0",
          incorrect: "0",
          accuracy: "0"
        },
        code: {
          one: "0",
          two: "0",
          three: "0",
          four: "0",
          five: "0"
        }
      }
    };
  },
  components: {
    testPlan,
    httpRequest,
    vUserGroup,
    welcome,

    rightClickMenu,
    paraTable,
    headerButtons,
    log,
    httpHeader,
    randomVars,
    footerButtons,
    settings,
    result,
    mainView,
    report,
    responseTime,
    serverStatue
  },
  methods: {
    //树节点右键事件
    treeRightClick(row, event) {
      //先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.menuVisible = false;
      //显示模态窗口，跳出自定义菜单栏
      this.menuVisible = true;
      var menu = document.querySelector("#menu");
      this.styleMenu(menu);
      //将当前节点信息保存
      this.node.id = event.id;
      this.node.label = event.label;
      this.node.children = event.children;

      let vflag = true;
      let hflag = true;
      for (let i = 0; i < this.node.children.length; i++) {
        if (this.node.children[i].id.charAt(0) == "3") {
          vflag = false;
          break;
        }
      }
      for (let i = 0; i < this.node.children.length; i++) {
        if (this.node.children[i].id.charAt(0) == "4") {
          hflag = false;
          break;
        }
      }

      //控制右键菜单的显示
      switch (event.id.charAt(0)) {
        case "1":
          //一个测试计划只允许有一个全局的请求参数表、一个http头部参数表和一个随机变量表
          let randomflag = true;
          for (let i = 0; i < this.node.children.length; i++) {
            if (this.node.children[i].id.charAt(0) == "8") {
              randomflag = false;
              break;
            }
          }
          if (!randomflag) {
            if (vflag && !hflag) this.options = "11000";
            if (!vflag && hflag) this.options = "10100";
            if (!vflag && !hflag) this.options = "10000";
            if (vflag && hflag) this.options = "11100";
          } else {
            if (vflag && !hflag) this.options = "11010";
            if (!vflag && hflag) this.options = "10110";
            if (!vflag && !hflag) this.options = "10010";
            if (vflag && hflag) this.options = "11110";
          }
          break;
        case "2":
          //一个虚拟用户组下只允许有一个全局的请求参数表和http头部参数表
          if (vflag && !hflag) this.options = "01001";
          if (!vflag && hflag) this.options = "00101";
          if (!vflag && !hflag) this.options = "00001";
          if (vflag && hflag) this.options = "01101";
          break;
        case "3":
          this.options = "00000";
          break;
        case "4":
          this.options = "00000";
          break;
        case "5":
          //一个http请求只允许添加一个请求参数表和头部参数表
          if (vflag && !hflag) this.options = "01000";
          if (!vflag && hflag) this.options = "00100";
          if (!vflag && !hflag) this.options = "00000";
          if (vflag && hflag) this.options = "01100";
          break;
        case "7":
          //选择了执行同一请求的用户组只能添加一个http请求并且一个虚拟用户组只允许一个参数表和http头部参数表
          let rflag = true;
          for (let i = 0; i < this.node.children.length; i++) {
            if (this.node.children[i].id.charAt(0) == "5") {
              rflag = false;
              break;
            }
          }
          if (!rflag) {
            if (vflag && !hflag) this.options = "01000";
            if (!vflag && hflag) this.options = "00100";
            if (!vflag && !hflag) this.options = "00000";
            if (vflag && hflag) this.options = "01100";
          } else {
            if (vflag && !hflag) this.options = "01001";
            if (!vflag && hflag) this.options = "00101";
            if (!vflag && !hflag) this.options = "00001";
            if (vflag && hflag) this.options = "01101";
          }
          break;
        case "8":
          this.options = "00000";
          break;
          break;
        default:
          break;
      }
    },
    foo() {
      // 取消鼠标监听事件 菜单栏
      this.menuVisible = false;
      // 及时关掉监听
      document.removeEventListener("click", this.foo);
    },
    //控制右键菜单显示位置
    styleMenu(menu) {
      if (event.clientX > 1800) {
        menu.style.left = event.clientX - 100 + "px";
      } else {
        menu.style.left = event.clientX + "px";
      }
      document.addEventListener("click", this.foo);
      if (event.clientY > 700) {
        menu.style.top = event.clientY - 30 + "px";
      } else {
        menu.style.top = event.clientY + "px";
      }
    },
    //控制mian组件的显示
    leftClick(row, event) {
      //左键点击源在树节点上时关闭右键菜单的显示
      this.menuVisible = false;
      //保存当前选中节点信息
      this.node.id = event.data.id;
      this.node.label = event.data.label;
      this.node.children = event.data.children;
      var ch = this.node.id.charAt(0);
      if (ch == "1" || ch == "2" || ch == "5" || ch == "7") {
        this.openTab({
          id: "0000005",
          label: "测试计划信息",
          content: "mainView"
        });
      } else {
        this.openTab(event.data);
      }
    },
    //右键菜单的操作的事件
    handleMenuOperation(ev) {
      ++id;
      var prifix =
        this.node.id.substring(0, 1) == "1" ? "" : this.node.label + "的";
      var ttid = undefined;
      switch (ev) {
        case "添加虚拟用户组":
          this.ejectForm("vUserGroup", "虚拟用户组", "");
          break;
        case "添加请求参数表":
          ttid = this.handleAddNodeToTree("3", ev.substring(2));
          this.fileData.paraTable.push({ id: ttid, tableData: [] });
          // 在tabs中追加一页并打开
          this.addTab("3" + id.toString(), prifix + "请求参数", "paraTable");
          this.tabData = JSON.stringify(this.findObj("3" + id.toString()));
          break;
        case "添加Http头部参数表":
          ttid = this.handleAddNodeToTree("4", ev.substring(2));
          this.fileData.httpHeader.push({ id: ttid, tableData: [] });
          // 在tabs中追加一页并打开
          this.addTab(
            "4" + id.toString(),
            prifix + "Http头部参数",
            "httpHeader"
          );
          this.tabData = JSON.stringify(this.findObj("4" + id.toString()));
          break;
        case "添加随机变量表":
          ttid = this.handleAddNodeToTree("8", "随机变量");
          this.fileData.randomVars = { id: ttid, tableData: [] };
          // 在tabs中追加一页并打开
          this.addTab("8" + id.toString(), "随机变量", "randomVars");
          this.tabData = JSON.stringify(this.findObj("8" + id.toString()));
          break;
        case "添加Http请求":
          this.ejectForm("httpRequest", "http请求", "");
          break;
        case "删除":
          this.handleDelete();
          break;
        case "重命名":
          this.handleRename();
          break;
        case "编辑":
          var ch = this.node.id.charAt(0);
          if (ch == "1" || ch == "2" || ch == "5" || ch == "7") {
            this.openTab({
              id: "0000005",
              label: "测试计划信息",
              content: "mainView"
            });
          } else {
            this.handleEdit(this.node);
          }
          break;
        default:
          break;
      }
      setTimeout(() => {
        this.reflesh();
      }, 100);
    },
    //添加一个tab页
    addTab(tabName, title, content) {
      this.editableTabs.push({
        title: title,
        name: tabName,
        content: content
      });
      this.editableTabsValue = tabName;
    },
    //删除指定tab页
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    },
    //递归删除该节点以及其子节点对应的所有tab页
    removeTabs(object) {
      if (object.children.length != 0) {
        //先删除改节点下的子节点
        for (let i = 0; i < object.children.length; i++) {
          this.removeTabs(object.children[i]);
        }
        this.removeTab(object.id);
      } else {
        this.removeTab(object.id);
      }
    },
    //打开指定tab页
    openTab(ndata) {
      //判断当前节点对应的页面是否已经存在
      let tabs = this.editableTabs;
      let hasExist = false;
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].name == ndata.id) {
          hasExist = true;
          break;
        }
      }
      if (hasExist) {
        //存在，则打开此页面
        this.editableTabsValue = ndata.id;
      } else {
        //不存在，则新建tab并打开
        let tcontent;
        let ttitle;
        switch (ndata.id.charAt(0)) {
          case "3":
            tcontent = "paraTable";
            ttitle = ndata.label;
            break;
          case "4":
            tcontent = "httpHeader";
            ttitle = ndata.label;
            break;
          case "8":
            tcontent = "randomVars";
            ttitle = ndata.label;
            break;
          case "0":
            tcontent = ndata.content;
            ttitle = ndata.label;
            break;
          default:
            break;
        }
        if (ttitle && tcontent) this.addTab(ndata.id, ttitle, tcontent);
      }
      this.tabData = JSON.stringify(this.findObj(ndata.id));
    },
    //弹出表单
    ejectForm(type, title) {
      this.dialogTableVisible = true;
      this.dialogForm = type;
      this.dialogTitle = title;
    },
    findObj(id) {
      var t = {};
      t.id = id;
      switch (id.charAt(0)) {
        case "0":
          if (id == "0000000") {
            t.path = this.fileData.settings.logPath;
          } else if (id == "0000001") {
            t.settings = this.fileData.settings;
          } else if (id == "0000002") {
            t.result = this.result;
          } else if (id == "0000003") {
            t.time = this.responseTime;
          } else if (id == "0000004") {
            t.report = this.report;
          } else if (id == "0000005") {
            t.fileData = this.fileData;
          } else {
            t.serverStatue = this.serverStatue;
          }
          break;
        case "1":
          t.testPlan = this.fileData.testPlan;
          break;
        case "2":
          t.vuser = {};
          for (let i = 0; i < this.fileData.vUserGroup.length; i++) {
            if (this.fileData.vUserGroup[i].id == id) {
              t.vuser = this.fileData.vUserGroup[i];
              break;
            }
          }
          break;
        case "3":
          t.para = {};
          for (let i = 0; i < this.fileData.paraTable.length; i++) {
            if (this.fileData.paraTable[i].id == id) {
              t.para = this.fileData.paraTable[i];
              break;
            }
          }
          break;
        case "4":
          t.header = {};
          for (let i = 0; i < this.fileData.httpHeader.length; i++) {
            if (this.fileData.httpHeader[i].id == id) {
              t.header = this.fileData.httpHeader[i];
              break;
            }
          }
          break;
        case "7":
          t.vuser = {};
          for (let i = 0; i < this.fileData.vUserGroup.length; i++) {
            if (this.fileData.vUserGroup[i].id == id) {
              t.vuser = this.fileData.vUserGroup[i];
              break;
            }
          }
          break;
        case "8":
          t.vars = this.fileData.randomVars;
          break;
        default:
          break;
      }
      return t;
    },
    //查看日志
    handleViewLog() {
      this.openTab({ id: "0000000", label: "log.log", content: "log" });
    },
    //设置
    handleSettings() {
      this.openTab({
        id: "0000001",
        label: "htest-user.settings",
        content: "settings"
      });
    },
    handleViewResult() {
      this.openTab({
        id: "0000002",
        label: "测试结果",
        content: "result"
      });
    },
    handleViewReport() {
      this.openTab({
        id: "0000004",
        label: "汇总报告",
        content: "report"
      });
    },
    handleViewResponseTime() {
      this.openTab({
        id: "0000003",
        label: "响应时间",
        content: "responseTime"
      });
    },
    handleViewServerStatue() {
      this.openTab({
        id: "0000006",
        label: "服务器性能",
        content: "serverStatue"
      });
    },
    //表单提交事件
    handleSubmitOrCancel(ev) {
      let op = ev.substring(0, 1);
      let value = ev.substring(1);
      let vjson = undefined;
      let ttid = undefined;
      if (op != "0") {
        vjson = JSON.parse(value);
      }
      switch (op) {
        case "0":
          this.dialogTableVisible = false;
          break;
        case "1":
          if (!this.hasPlan) {
            this.dialogTableVisible = false;
            this.data.push({ id: "1" + ++id, label: vjson.name, children: [] });
            this.fileData.testPlan = this.jsonAddId(vjson, "1" + id);
            this.hasPlan = true;
          } else {
            this.handlePlanSave(() => {
              this.clean();
              this.dialogTableVisible = false;
              this.data.push({
                id: "1" + ++id,
                label: vjson.name,
                children: []
              });
              this.fileData.testPlan = this.jsonAddId(vjson, "1" + id);
              this.hasPlan = true;
            });
          }
          break;
        case "2":
          this.dialogTableVisible = false;
          ttid = this.handleAddNodeToTree(op, vjson.name);
          this.fileData.vUserGroup.push(this.jsonAddId(vjson, ttid));
          break;
        case "5":
          this.dialogTableVisible = false;
          ttid = this.handleAddNodeToTree(op, vjson.name);
          this.fileData.httpRequest.push(this.jsonAddId(vjson, ttid));
          if (vjson.random == "use") {
            // 判断是否存在随机变量表
            let randomflag = true;
            for (let i = 0; i < this.data[0].children.length; i++) {
              if (this.data[0].children[i].id.charAt(0) == "8") {
                randomflag = false;
                break;
              }
            }
            if (randomflag) {
              // 不存在则需要添加到根节点
              ++id;
              this.$refs.tree.append(
                { id: "8" + id, label: "随机变量", children: [] },
                this.data[0].id
              );
              // 在tabs中追加一页并打开
              this.addTab("8" + id, "随机变量", "randomVars");
            }
          }
          break;
        case "7":
          this.dialogTableVisible = false;
          ttid = this.handleAddNodeToTree(op, vjson.name);
          this.fileData.vUserGroup.push(this.jsonAddId(vjson, ttid));
          break;
        default:
          break;
      }
      this.reflesh();
    },
    //表格数据更新
    handleUpdateTableData(ev) {
      let t = JSON.parse(ev);
      if (t.id.charAt(0) == "3") {
        for (let i = 0; i < this.fileData.paraTable.length; i++) {
          if (t.id == this.fileData.paraTable[i].id) {
            this.fileData.paraTable[i] = t;
            break;
          }
        }
      } else if (t.id.charAt(0) == "4") {
        for (let i = 0; i < this.fileData.httpHeader.length; i++) {
          if (t.id == this.fileData.httpHeader[i].id) {
            this.fileData.httpHeader[i] = t;
            break;
          }
        }
      } else if (t.id.charAt(0) == "8") {
        this.fileData.randomVars = t;
      } else if (t.id == "0000005") {
        this.fileData = t.tableData;
        //更新树
      }
      this.reflesh();
    },
    //按钮组点击事件
    handleButtonOperation(ev) {
      switch (ev) {
        case "新建":
          this.handleCreate();
          break;
        case "打开":
          this.handleOpen();
          break;
        case "保存":
          if (this.hasPlan) this.handleSave();
          break;
        case "启动":
          if (this.hasPlan) this.handleStart();
          break;
        case "停止":
          if (this.hasPlan) this.handleStop();
          break;
        case "重新启动":
          if (this.hasPlan) this.handleRestart();
          break;
        case "查看结果":
          if (this.hasPlan) this.handleViewResult();
          break;
        case "查看响应时间":
          if (this.hasPlan) this.handleViewResponseTime();
          break;
        case "查看汇总报告":
          if (this.hasPlan) this.handleViewReport();
          break;
        case "查看服务器状态":
          if (this.hasPlan) this.handleViewServerStatue();
          break;
        case "查看日志":
          if (this.hasPlan) this.handleViewLog();
          break;
        case "设置":
          if (this.hasPlan) this.handleSettings();
          break;
        case "帮助":
          const { shell } = require("electron");
          shell.openExternal("https://www.baidu.com");
          break;
        default:
          break;
      }
    },
    //清空数据
    clean() {
      id = 100000;
      this.hasPlan = false;
      this.data = [];
      this.savePath = "";
      this.node = {};
      this.editableTabs = [];
      this.editableTabsValue = "";
      this.fileData = {
        settings: {
          logPath: "",
          responsePath: ""
        },
        testPlan: {},
        vUserGroup: [],
        httpRequest: [],
        paraTable: [],
        httpHeader: [],
        randomVars: {}
      };
      this.tabData = "";
      (this.responseTime = { xdata: [], ydata: [] }),
        (this.result = []),
        (this.serverStatue = { xdata: [], memory: [], disk: [] }),
        (this.report = {
          time: {
            number: "0",
            min: "0",
            max: "0",
            avg: "0",
            middle: "0",
            error: "0"
          },
          result: {
            number: "0",
            correct: "0",
            incorrect: "0",
            accuracy: "0"
          },
          code: {
            one: "0",
            two: "0",
            three: "0",
            four: "0",
            five: "0"
          }
        });
      this.footData = {
        errorNum: 0,
        warningNum: 0,
        isRunning: false
      };
    },
    // json字符串中添加id
    jsonAddId(json, id) {
      json.id = id;
      return json;
    },
    //删除当前选中的树节点
    handleDelete() {
      this.$confirm("删除所选节点？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          this.$refs.tree.remove(this.node.id);
          //删除该节点对应的数据
          switch (this.node.id.charAt(0)) {
            case "2":
              for (let i = 0; i < this.fileData.vUserGroup.length; i++) {
                if (this.fileData.vUserGroup[i].id == this.node.id) {
                  this.fileData.vUserGroup.splice(i, 1);
                  break;
                }
              }
              break;
            case "3":
              for (let i = 0; i < this.fileData.paraTable.length; i++) {
                if (this.fileData.paraTable[i].id == this.node.id) {
                  this.fileData.paraTable.splice(i, 1);
                  break;
                }
              }
              break;
            case "4":
              for (let i = 0; i < this.fileData.httpHeader.length; i++) {
                if (this.fileData.httpHeader[i].id == this.node.id) {
                  this.fileData.httpHeader.splice(i, 1);
                  break;
                }
              }
              break;
            case "5":
              for (let i = 0; i < this.fileData.httpRequest.length; i++) {
                if (this.fileData.httpRequest[i].id == this.node.id) {
                  this.fileData.httpRequest.splice(i, 1);
                  break;
                }
              }
              break;
            case "7":
              for (let i = 0; i < this.fileData.vUserGroup.length; i++) {
                if (this.fileData.vUserGroup[i].id == this.node.id) {
                  this.fileData.vUserGroup.splice(i, 1);
                  break;
                }
              }
              break;
            case "8":
              this.fileData.randomVars = {};
              break;
            default:
              break;
          }
          //更新
          this.reflesh();
          // 需要递归删除该节点所有的子节点对应的tab

          this.removeTabs(this.node);
          if (this.node.id.charAt(0) == "1") {
            this.clean();
          }
          if (this.data.length == 0) {
            this.hasPlan = false;
            id = 100000;
          }
        })
        .catch(() => {});
    },
    //重命名
    handleRename() {
      this.openTab({
        id: "0000005",
        label: "测试计划信息",
        content: "mainView"
      });
    },
    //编辑
    handleEdit(data) {
      this.openTab(data);
    },
    //新建
    handleCreate() {
      this.ejectForm("testPlan", "测试计划");
    },
    //打开
    handleOpen() {
      dialog.showOpenDialog(
        { filters: [{ name: "HTEST", extensions: ["hest"] }] },
        event => {
          if (event != undefined) {
            if (this.hasPlan) {
              this.handlePlanSave(() => {
                var obj = utils.planFileRead(event[0]);
                if (obj == undefined) {
                  const options = {
                    type: "error",
                    title: app.getName(),
                    message: "文件内容损坏，无法识别"
                  };
                  dialog.showMessageBox(options);
                } else {
                  this.clean();
                  this.handleAssign(obj);
                  this.savePath = event[0];
                }
              });
            } else {
              var obj = utils.planFileRead(event[0]);
              if (obj == undefined) {
                const options = {
                  type: "error",
                  title: app.getName(),
                  message: "文件内容损坏，无法识别"
                };
                dialog.showMessageBox(options);
              } else {
                this.handleAssign(obj);
                this.savePath = event[0];
              }
            }
          }
        }
      );
    },
    //保存
    handleSave(callback) {
      var t = {
        settings: this.fileData.settings,
        testPlan: this.fileData.testPlan,
        vUserGroup: this.fileData.vUserGroup,
        httpRequest: this.fileData.httpRequest,
        paraTable: this.fileData.paraTable,
        httpHeader: this.fileData.httpHeader,
        randomVars: this.fileData.randomVars,
        start: {
          data: this.data,
          staticId: id
        }
      };
      console.log(JSON.stringify(t));
      if (utils.planFileCheck(JSON.stringify(t)) == 0) {
        if (this.savePath == "") {
          dialog.showSaveDialog(
            { filters: [{ name: "HTEST", extensions: ["hest"] }] },
            event => {
              if (event != undefined) {
                this.savePath = event;
                utils.fileSave(JSON.stringify(t), event);
                if (callback) callback();
              }
            }
          );
        } else {
          utils.fileSave(JSON.stringify(t), this.savePath);
          if (callback) callback();
        }
      } else {
        const options = {
          type: "error",
          title: app.getName(),
          message: "文件格式错误" + utils.planFileCheck(JSON.stringify(t))
        };
        dialog.showMessageBox(options);
      }
    },
    //另存为
    handleSaveAs() {
      var t = {
        settings: this.fileData.settings,
        testPlan: this.fileData.testPlan,
        vUserGroup: this.fileData.vUserGroup,
        httpRequest: this.fileData.httpRequest,
        paraTable: this.fileData.paraTable,
        httpHeader: this.fileData.httpHeader,
        randomVars: this.fileData.randomVars,
        start: {
          data: this.data,
          staticId: id
        }
      };
      if (utils.planFileCheck(JSON.stringify(t)) == 0) {
        dialog.showSaveDialog(
          { filters: [{ name: "HTEST", extensions: ["hest"] }] },
          event => {
            if (event != undefined) {
              utils.fileSave(JSON.stringify(t), event);
            }
          }
        );
      } else {
        const options = {
          type: "error",
          title: app.getName(),
          message: "文件格式错误"
        };
        dialog.showMessageBox(options);
      }
    },
    //启动
    handleStart() {
      if (this.savePath == "") {
        this.handleSave(() => {
          this.startAndAssign();
        });
      } else {
        this.startAndAssign();
      }
      // bat.stderr.on("data", data => {
      // });
    },
    startAndAssign() {
      (this.responseTime = { xdata: [], ydata: [] }),
        (this.result = []),
        (this.serverStatue = { xdata: [], memory: [], disk: [] }),
        (this.report = {
          time: {
            number: "0",
            min: "0",
            max: "0",
            avg: "0",
            middle: "0",
            error: "0"
          },
          result: {
            number: "0",
            correct: "0",
            incorrect: "0",
            accuracy: "0"
          },
          code: {
            one: "0",
            two: "0",
            three: "0",
            four: "0",
            five: "0"
          }
        });
      try {
        this.footData.isRunning = true;
        const { spawn } = require("child_process");
        var path;
        if (process.env.NODE_ENV !== "development") {
          path = require("path")
            .join(__static, "/java/client.jar")
            .replace(/\\/g, "\\\\");
        } else {
          path = require("path").join(
            __static,
            "/java/client.jar " + this.savePath
          );
        }
        const bat = spawn("cmd.exe", [
          "/c",
          "java -jar -Dfile.encoding=UTF-8 " + path
        ]);

        bat.stdout.on("data", data => {
          this.temp += data.toString();
        });

        bat.stderr.on("data", data => {
          const options = {
            type: "error",
            title: app.getName(),
            message: data.toString()
          };
          dialog.showMessageBox(options);
          this.handleStop();
        });
        bat.on("exit", code => {
          try {
            var obj = JSON.parse(this.temp);
            let status = obj.server;
            if (status != undefined) {
              let t = status.split(",");
              //服务器监控数据
              let t1 = [],
                t2 = [],
                t0 = [];
              for (let i = 0; i < (t.length - 1) / 2; i++) {
                t0.push(i + 1);
                t1.push(t[i]);
              }
              for (let i = (t.length - 1) / 2; i < t.length - 1; i++) {
                t2.push(t[i]);
              }
              this.serverStatue.xdata = t0;
              this.serverStatue.memory = t1;
              this.serverStatue.disk = t2;
            }

            let requests = obj.requests;
            //请求数量
            let numRequest = requests.length - 1;
            //出错数量
            let errNum;
            //请求时间
            let reTimes = [];
            let reTimeSum = 0;
            //请求名称
            let reNames = [];
            //响应码
            let reCodes = [];
            //响应码数量统计
            let one = 0,
              two = 0,
              three = 0,
              four = 0,
              five = 0;
            //响应体
            let reBody = [];
            let j = 1;
            for (let i = 0; i < requests.length; i++) {
              if (requests[i].name == "error") {
                errNum = requests[i].result;
              } else {
                //正确的响应体
                let reString = JSON.stringify(requests[i].result);
                if (reString.charAt(1) == "{") {
                  let reJson = JSON.parse(JSON.parse(reString));
                  reBody.push(reJson.body);
                  reCodes.push(reJson.statusCode);
                  if (JSON.stringify(reJson.statusCode).charAt(0) == "1") {
                    one++;
                  } else if (
                    JSON.stringify(reJson.statusCode).charAt(0) == "2"
                  ) {
                    two++;
                  } else if (
                    JSON.stringify(reJson.statusCode).charAt(0) == "3"
                  ) {
                    three++;
                  } else if (
                    JSON.stringify(reJson.statusCode).charAt(0) == "4"
                  ) {
                    four++;
                  } else {
                    five++;
                  }

                  this.responseTime.xdata.push(j++);
                  this.responseTime.ydata.push(reJson.responseTime);
                  reTimes.push(reJson.responseTime);
                  reTimeSum += reJson.responseTime;
                } else {
                  //异常的响应体
                  reBody.push(requests[i].result);
                }
                reNames.push(requests[i].name);
              }
            }
            var compare = function(x, y) {
              //比较函数
              if (x < y) {
                return -1;
              } else if (x > y) {
                return 1;
              } else {
                return 0;
              }
            };
            reTimes.sort(compare);
            this.report.time = {
              number: numRequest,
              min: reTimes[0],
              max: reTimes[reTimes.length - 1],
              avg: (reTimeSum * 1.0) / (numRequest - errNum),
              middle: reTimes[Math.round(reTimes.length / 2)],
              error: errNum
            };
            this.report.result = {
              number: numRequest,
              correct: numRequest - errNum,
              incorrect: errNum,
              accuracy: ((numRequest - errNum) / numRequest) * 100 + "%"
            };
            this.report.code = {
              one: one,
              two: two,
              three: three,
              four: four,
              five: five
            };
            this.footData.isRunning = false;
            this.footData.errorNum = errNum;

            for (let i = 0; i < reNames.length; i++) {
              this.result.push({
                rename: reNames[i],
                rebody: reBody[i]
              });
            }
          } catch (error) {
            const options = {
              type: "error",
              title: app.getName(),
              message: error.toString()
            };
            dialog.showMessageBox(options);
          }
        });
      } catch (error) {
        const options = {
          type: "error",
          title: app.getName(),
          message: error.toString()
        };
        dialog.showMessageBox(options);
      }
      this.temp = "";
    },
    // 停止
    handleStop() {
      this.footData.isRunning = false;
      const { spawn } = require("child_process");
      const bat = spawn("cmd.exe", [
        "/c",
        "wmic process where caption='java.exe' get processid"
      ]);

      let pid;
      bat.stdout.on("data", data => {
        if (data.toString().trim() != "") {
          pid = data.toString().replace(/[^0-9]/g, "");
        }
      });
      setTimeout(() => {
        if (pid != undefined) {
          const t = spawn("cmd.exe", ["/c", "taskkill /pid " + pid + " /F"]);
        }
      }, 500);
    },
    // 重新启动
    handleRestart() {
      this.handleStop();
      setTimeout(() => {
        this.handleStart();
      }, 500);
    },
    //刷新mainview数据
    reflesh() {
      let t = {};
      t.id = "0000005";
      t.fileData = this.fileData;
      this.tabData = JSON.stringify(t);
    },
    // 赋值
    handleAssign(obj) {
      this.data = obj.start.data;
      this.fileData.settings = obj.settings;
      this.fileData.testPlan = obj.testPlan;
      this.fileData.vUserGroup = obj.vUserGroup;
      this.fileData.httpRequest = obj.httpRequest;
      this.fileData.paraTable = obj.paraTable;
      this.fileData.httpHeader = obj.httpHeader;
      this.fileData.randomVars = obj.randomVars;
      this.hasPlan = true;
      id = obj.start.staticId;
    },
    //存在多个plan的处理
    handlePlanSave(fun) {
      this.$confirm("将会关闭当前测试计划, 是否保存?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          this.handleSave(() => {
            fun();
          });
        })
        .catch(() => {
          fun();
        });
    },
    //向树中追加节点
    handleAddNodeToTree(type, label) {
      var t = {
        id: "",
        label: "",
        children: []
      };
      t.id = type + id.toString();
      t.label = label;
      this.$refs.tree.append(t, this.node.id);
      //展开父节点
      this.$refs.tree.store.nodesMap[this.node.id].expanded = true;
      return t.id;
    },
    handleClosePlan() {
      this.clean();
    },
    //导出报告
    handleExportReport() {
      var t =
        "响应时间汇总: {\r\n数量:" +
        this.report.time.number +
        ",\r\n最小值:" +
        this.report.time.min +
        ",\r\n最大值:" +
        this.report.time.max +
        ",\r\n平均值:" +
        this.report.time.avg +
        ",\r\n中位数:" +
        this.report.time.middle +
        ",\r\n未响应:" +
        this.report.time.error +
        "\r\n},\r\n" +
        "响应结果汇总:{\r\n数量:" +
        this.report.result.number +
        ",\r\n正常数量:" +
        this.report.result.correct +
        ",\r\n异常数量:" +
        this.report.result.incorrect +
        ",\r\n正确率:" +
        this.report.result.accuracy +
        "\r\n},\r\n" +
        "响应码统计:{\r\n1**:" +
        this.report.code.one +
        ",\r\n2**:" +
        this.report.code.two +
        ",\r\n3**:" +
        this.report.code.three +
        ",\r\n4**:" +
        this.report.code.four +
        ",\r\n5**:" +
        this.report.code.five +
        "\r\n}\r\n";

      dialog.showSaveDialog(
        { filters: [{ name: "HTEST", extensions: ["txt"] }] },
        event => {
          if (event != undefined) {
            utils.fileSave(t, event);
          }
        }
      );
    }
  },
  mounted: function() {
    ipcRenderer.on("main-to-start", (event, arg) => {
      // 与主进程通信
      if (!this.dialogTableVisible) {
        switch (arg) {
          case "create plan":
            this.handleCreate();
            break;
          case "open plan":
            this.handleOpen();
            break;
          case "save plan":
            if (this.hasPlan) this.handleSave();
            break;
          case "save plan as":
            if (this.hasPlan) this.handleSaveAs();
            break;
          case "view result":
            if (this.hasPlan) this.handleViewResult();
            break;
          case "view respond time":
            if (this.hasPlan) this.handleViewResponseTime();
            break;
          case "view report":
            if (this.hasPlan) this.handleViewReport();
            break;
          case "view server statue":
            if (this.hasPlan) this.handleViewServerStatue();
            break;
          case "view log":
            if (this.hasPlan) this.handleViewLog();
            break;
          case "start test":
            if (this.hasPlan) this.handleStart();
            break;
          case "stop test":
            if (this.hasPlan) this.handleStop();
            break;
          case "restart test":
            if (this.hasPlan) this.handleRestart();
            break;
          case "settings":
            if (this.hasPlan) this.handleSettings();
            break;
          case "export report":
            if (this.hasPlan) this.handleExportReport();
          case "close plan":
            if (this.hasPlan) this.handleClosePlan();
          default:
            break;
        }
      }
    });
  }
};
</script>