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
            @keydown.ctrl.e.native="handleEdit"
            @keydown.F2.native="handleRename"
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
            <component :is="item.content" :tabData="tabData"></component>
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
      <component
        :is="dialogForm"
        ref="dialog"
        @submitOrCancel="handleSubmitOrCancel"
        :dialogData="dialogData"
      ></component>
    </el-dialog>

    <el-footer>
      <footer-buttons></footer-buttons>
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
import mainView from "../components/MainView";
import httpManager from "../components/HttpManager";
import footerButtons from "../components/Footer";

import testPlan from "../views/TestPlan";
import assert from "../views/Assert";
import httpRequest from "../views/HttpRequest";
import vUserGroup from "../views/VUserGroup";
import welcome from "../views/Welcome";

const ipcRenderer = require("electron").ipcRenderer;
const { dialog } = require("electron").remote;
/*树节点id规则
以i开头对节点类型分类，最高为9，即9种分类
1：代表测试计划节点
2：代表虚拟用户组节点（不同请求）
7：代表虚拟用户组节点（相同请求）
3：代表用户自定义变量节点
4：代表http管理器节点
5：代表http请求节点
6：代表断言节点
同时tab的名字与节点id一致*/
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
      //相关配置数据
      testPlanData: {},
      vUserGroupData: [],
      httpRequestData: [],
      assertData: [],
      paraTableData: [],
      httpManagerData: [],
      //表单对应数据
      dialogData: [],
      //tab页对应数据
      tabData: []
    };
  },
  components: {
    testPlan,
    assert,
    httpRequest,
    vUserGroup,
    rightClickMenu,
    paraTable,
    headerButtons,
    log,
    mainView,
    httpManager,
    footerButtons,
    welcome
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
          //一个测试计划只允许有一个全局的请求参数表和http管理
          if (vflag && !hflag) this.options = "110000";
          if (!vflag && hflag) this.options = "101000";
          if (!vflag && !hflag) this.options = "100000";
          if (vflag && hflag) this.options = "111000";
          break;
        case "7":
          //选择了执行同一请求的用户组只能添加一个http请求并且一个虚拟用户组只允许一个参数表和http管理器
          let rflag = true;
          for (let i = 0; i < this.node.children.length; i++) {
            if (this.node.children[i].id.charAt(0) == "5") {
              rflag = false;
              break;
            }
          }
          if (!rflag) {
            if (vflag && !hflag) this.options = "010000";
            if (!vflag && hflag) this.options = "001000";
            if (!vflag && !hflag) this.options = "000000";
            if (vflag && hflag) this.options = "011000";
          } else {
            if (vflag && !hflag) this.options = "010100";
            if (!vflag && hflag) this.options = "001100";
            if (!vflag && !hflag) this.options = "000100";
            if (vflag && hflag) this.options = "011100";
          }
          break;
        case "2":
          //一个虚拟用户组下只允许有一个全局的请求参数表和http管理
          if (vflag && !hflag) this.options = "010100";
          if (!vflag && hflag) this.options = "001100";
          if (!vflag && !hflag) this.options = "000100";
          if (vflag && hflag) this.options = "011100";
          break;
        case "3":
          this.options = "000000";
          break;
        case "4":
          this.options = "000000";
          break;
        case "5":
          //一个http请求只允许添加一个参数表和管理器并且只允许设置一个断言
          let aflag = true;
          for (let i = 0; i < this.node.children.length; i++) {
            if (this.node.children[i].id.charAt(0) == "6") {
              aflag = false;
              break;
            }
          }
          if (!aflag) {
            if (vflag && !hflag) this.options = "010000";
            if (!vflag && hflag) this.options = "001000";
            if (!vflag && !hflag) this.options = "000000";
            if (vflag && hflag) this.options = "011000";
          } else {
            if (vflag && !hflag) this.options = "010010";
            if (!vflag && hflag) this.options = "001010";
            if (!vflag && !hflag) this.options = "000010";
            if (vflag && hflag) this.options = "011010";
          }
          break;
        case "6":
          this.options = "000001";
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
      this.openTab(event.data);
    },
    //右键菜单的操作的事件
    handleMenuOperation(ev) {
      ++id;
      switch (ev) {
        case "添加虚拟用户组":
          this.ejectForm("vUserGroup", "虚拟用户组", "");
          break;
        case "添加请求参数表":
          this.handleAddNodeToTree("3", ev.substring(2));
          // 在tabs中追加一页并打开
          this.addTab("3" + id.toString(), "请求参数", "paraTable");
          break;
        case "添加Http管理器":
          this.handleAddNodeToTree("4", ev.substring(2));
          // 在tabs中追加一页并打开
          this.addTab("4" + id.toString(), "http管理器", "httpManager");
          break;
        case "添加Http请求":
          this.ejectForm("httpRequest", "http请求", "");
          break;
        case "设置断言":
          this.ejectForm("assert", "断言", "");
          break;
        case "删除":
          this.handleDelete();
          break;
        case "重命名":
          this.handleRename();
          break;
        case "编辑":
          this.handleEdit(this.node);
          break;
        case "查看断言结果":
          // this.$refs.tree.append(t, this.node.id);
          break;
        default:
          break;
      }
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
          case "1":
            break;
          case "2":
            break;
          case "3":
            tcontent = "paraTable";
            ttitle = ndata.label;
            break;
          case "4":
            tcontent = "httpManager";
            ttitle = ndata.label;
            break;
          case "6":
            break;
          case "7":
            break;
          default:
            break;
        }
        if (ttitle && tcontent) this.addTab(ndata.id, ttitle, tcontent);
      }
    },
    //弹出表单
    ejectForm(type, title, dialogData) {
      this.dialogTableVisible = true;
      this.dialogForm = type;
      this.dialogTitle = title;
      this.dialogData = dialogData;
    },
    //表单提交事件
    handleSubmitOrCancel(ev) {
      let op = ev.substring(0, 1);
      switch (op) {
        case "0":
          this.dialogTableVisible = false;
          break;
        case "1":
          if (!this.hasPlan) {
            this.dialogTableVisible = false;
            this.data.push({
              id: "1" + ++id,
              label: ev.substring(1),
              children: []
            });
            this.hasPlan = true;
          } else {
            this.$confirm("将会关闭当前测试计划, 是否保存?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
              closeOnClickModal: false
            })
              .then(() => {
                //保存当前计划
                this.handleSave(() => {
                  this.clean();
                  this.dialogTableVisible = false;
                  this.data.push({
                    id: "1" + ++id,
                    label: ev.substring(1),
                    children: []
                  });
                  this.hasPlan = true;
                });
              })
              .catch(() => {});
          }
          break;
        default:
          this.dialogTableVisible = false;
          this.handleAddNodeToTree(op, ev.substring(1));
          break;
      }
      console.log(ev);
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
          break;
        case "查看响应时间":
          break;
        case "查看汇总报告":
          break;
        case "查看服务器状态":
          break;
        case "查看日志":
          break;
        case "设置":
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
      this.data = [];
      this.savePath = "";
      this.node = {};
      this.editableTabs = [];
      this.editableTabsValue = "";
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
          // 需要递归删除该节点所有的子节点对应的tab
          this.removeTabs(this.node);
          if (this.data.length == 0) this.hasPlan = false;
        })
        .catch(() => {});
    },
    //重命名
    handleRename() {
      console.log("重命名");
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
              this.$confirm("将会关闭当前测试计划, 是否保存?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: false
              })
                .then(() => {
                  //保存当前计划
                  this.handleSave(() => {
                    this.clean();
                    var obj = utils.fileRead(event[0]);
                    this.data = obj.start.data;
                    this.hasPlan = true;
                    id = obj.start.staticId;
                    this.savePath = event[0];
                  });
                })
                .catch(() => {});
            } else {
              var obj = utils.fileRead(event[0]);
              this.data = obj.start.data;
              this.hasPlan = true;
              id = obj.start.staticId;
            }
          }
        }
      );
    },
    //保存
    handleSave(callback) {
      if (this.savePath == "") {
        dialog.showSaveDialog(
          { filters: [{ name: "HTEST", extensions: ["hest"] }] },
          event => {
            if (event != undefined) {
              utils.fileSave("aa", event);
              this.savePath = event;
              if (callback) callback();
            }
          }
        );
      } else {
        utils.fileSave("aa", this.savePath);
        if (callback) callback();
      }
    },
    //另存为 
    handleSaveAs(callback) {
      dialog.showSaveDialog(
        { filters: [{ name: "HTEST", extensions: ["hest"] }] },
        event => {
          if (event != undefined) {
            utils.fileSave("aa", event);
            if (callback) callback();
          }
        }
      );
    },
    //启动
    handleStart() {
      console.log("启动");
    },
    handleStop() {
      console.log("停止");
    },
    handleRestart() {
      console.log("重新启动");
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
            console.log(arg);
            break;
          case "view respond time":
            console.log(arg);
            break;
          case "view report":
            console.log(arg);
            break;
          case "view server statue":
            console.log(arg);
            break;
          case "view log":
            console.log(arg);
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
            console.log(arg);
            break;
          default:
            break;
        }
      }
    });
  }
};
</script>