const { app, Menu } = require("electron");

const isMac = process.platform === "darwin";

const template = [
  {
    label: "文件(&F)",
    submenu: [
      { label: "新建计划", click: () => { console.log("new plan") }, accelerator: "CmdOrCtrl+N" },
      { label: "打开计划", click: () => { console.log("opne plan") }, accelerator: "CmdOrCtrl+O" },
      { label: "保存计划", click: () => { console.log("save plan") }, accelerator: "CmdOrCtrl+S" },
      { label: "另存为", click: () => { console.log("save as") }, accelerator: "CmdOrCtrl+Shift+S" },
      { type: "separator" },
      {
        label: "导出报告",
        submenu: [
          { label: "以word格式" },
          { label: "以pdf格式" },
          { label: "以html格式" }
        ]
      },
      {
        label: "在线查看报告",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://www.baidu.com");
        }
      },
      { type: "separator" },
      isMac ? { label: "退出", role: "close" } : { label: "退出", role: "quit" },
    ]
  },
  {
    label: "编辑(&E)",
    submenu: [
      { label: "撤消", role: "undo" },
      { label: "恢复", role: "redo" },
      { type: "separator" },
      { label: "剪切", role: "cut" },
      { label: "复制", role: "copy" },
      { label: "粘贴", role: "paste" },
      { type: "separator" },
      { label: "全选", role: "selectAll" },
    ]
  },
  {
    label: "查看(&V)",
    submenu: [
      {
        label: "查看",
        submenu: [
          { label: "请求结果", click: () => { console.log("view result") } },
          { label: "响应时间", click: () => { console.log("view respond time") } },
          { label: "汇总报告", click: () => { console.log("view report") } },
          { label: "服务器状态", click: () => { console.log("view server statue") } },
          { label: "日志", click: () => { console.log("view log") } }
        ]
      },
      { type: "separator" },
      { label: "放大", role: "zoomin" },
      { label: "缩小", role: "zoomout" },
      { label: "重置缩放", role: "resetzoom" },
      { label: "最小化", role: "minimize" },
      { type: "separator" },
      { label: "进入/退出全屏", role: "togglefullscreen" }
    ]
  },
  {
    label: "运行(&R)",
    submenu: [
      { label: "启动测试", click: () => { console.log("start test") }, accelerator: "CmdOrCtrl+R" },
      { label: "停止测试", click: () => { console.log("stop test") }, accelerator: "CmdOrShift+R" },
      { label: "重启测试", click: () => { console.log("restart test") }, accelerator: "CmdOrShift+Ctrl+R" },
      { type: "separator" },
      { label: "检查工作环境", click: () => { console.log("check environment") } },
    ]
  },
  {
    label: "帮助(&H)",
    submenu: [
      {
        label: "帮助文档",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://www.baidu.com");
        }
      },
      {
        label: "本工具github地址",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://github.com/CN-light/stress-test-tool");
        }
      },
      {
        type: "separator"
      },
      {
        label: "联系作者",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://www.baidu.com");
        }
      },
      {
        label: "报告bug",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://www.baidu.com");
        }
      },
      {
        type: "separator"
      },
      {
        label: "切换开发者工具", role: "toggledevtools"
      },
      {
        label: "设置",
        click: () => {
          console.log("settings");
        }
      },
      {
        type: "separator"
      },
      {
        label: "关于",
        click: () => {
          console.log("stress test tool");
        }
      },
      {
        type: "separator"
      },
      {
        label: "检查更新",
        enabled: false,
        click: () => {
          console.log("do not immplement");
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

export { menu };
