const { Menu, dialog, app } = require("electron").remote;
const { shell } = require("electron");
const ipcRenderer = require("electron").ipcRenderer;
var os = require("os")
var tmp = "";
const isMac = process.platform === "darwin";
const template = [
  {
    label: "文件(&F)",
    submenu: [
      { label: "新建计划", click: () => { ipcRenderer.send("menu-to-main", "create plan") }, accelerator: "CmdOrCtrl+N" },
      { label: "打开计划", click: () => { ipcRenderer.send("menu-to-main", "open plan") }, accelerator: "CmdOrCtrl+O" },
      { label: "关闭计划", click: () => { ipcRenderer.send("menu-to-main", "close plan") }, accelerator: "CmdOrCtrl+W"},
      { type: "separator" },
      { label: "保存计划", click: () => { ipcRenderer.send("menu-to-main", "save plan") }, accelerator: "CmdOrCtrl+S" },
      { label: "另存为", click: () => { ipcRenderer.send("menu-to-main", "save plan as") }, accelerator: "CmdOrCtrl+Shift+S" },
      // { label: "自动保存", type:"checkbox",click: () => { console.log("auto save") }},
      { type: "separator" },
      { label: "导出报告", click: () => { ipcRenderer.send("menu-to-main", "export report") } },
      // { type: "separator" },
      // {
      //   label: "在线查看报告",
      //   click: async () => {
      //     await shell.openExternal("https://www.baidu.com");
      //   }
      // },
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
      { label: "查看请求结果", click: () => { ipcRenderer.send("menu-to-main", "view result") } },
      { label: "查看响应时间", click: () => { ipcRenderer.send("menu-to-main", "view respond time") } },
      { label: "查看汇总报告", click: () => { ipcRenderer.send("menu-to-main", "view report") } },
      { label: "查看服务器状态", click: () => { ipcRenderer.send("menu-to-main", "view server statue") } },
      { label: "查看日志", click: () => { ipcRenderer.send("menu-to-main", "view log") } },
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
      {
        label: "启动测试", click: () => {
          ipcRenderer.send("menu-to-main", "start test")
        }, accelerator: "CmdOrCtrl+R"
      },
      { label: "停止测试", click: () => { ipcRenderer.send("menu-to-main", "stop test") }, accelerator: "CmdOrShift+R" },
      { label: "重启测试", click: () => { ipcRenderer.send("menu-to-main", "restart test") }, accelerator: "CmdOrShift+Ctrl+R" },
      { type: "separator" },
      {
        label: "检查工作环境", click: (item, focusedWindow) => {
          const { spawn } = require("child_process");
          const bat = spawn("cmd.exe", [
            "/c",
            "java -version"
          ]);
          // bat.stdout.on("data", data => {
          //   let start = data.toString().indexOf("\"") + 1;
          //   let end = data.toString().lastIndexOf("\"");
          //   let string = data.toString().substring(start, end);
          //   let strings = string.split(".");
          //   if (strings[1] >= 8) {
          //     const options = {
          //       type: "info",
          //       title: app.getName(),
          //       message: "环境符合要求"
          //     }
          //     dialog.showMessageBox(focusedWindow, options);
          //   }else{
          //     const options = {
          //       type: "error",
          //       title: app.getName(),
          //       message: "java版本过低或者未安装jdk"
          //     }
          //     dialog.showMessageBox(focusedWindow, options);
          //   }
          // });
          bat.stderr.on("data", data => {
            tmp += data.toString();
          })
          bat.on("exit",()=>{
            let start = tmp.indexOf("\"") + 1;
            let end = tmp.lastIndexOf("\"");
            let string = tmp.substring(start, end);
            let strings = string.split(".");
            if (strings[1] >= 8) {
              const options = {
                type: "info",
                title: app.getName(),
                message: "环境符合要求"
              }
              dialog.showMessageBox(focusedWindow, options);
            }else{
              const options = {
                type: "error",
                title: app.getName(),
                message: "java版本过低或者未安装jdk"
              }
              dialog.showMessageBox(focusedWindow, options);
            }
          })
        }
      },
    ]
  },
  {
    label: "帮助(&H)",
    submenu: [
      {
        label: "帮助文档",
        click: async () => {
          await shell.openExternal("https://www.baidu.com");
        }
      },
      {
        label: "本工具github地址",
        click: async () => {
          await shell.openExternal("https://github.com/CN-light/stress-test-tool");
        }
      },
      {
        type: "separator"
      },
      {
        label: "联系作者",
        click: async () => {
          await shell.openExternal("https://www.baidu.com");
        }
      },
      {
        label: "报告bug",
        click: async () => {
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
        click: () => { ipcRenderer.send("menu-to-main", "settings") }
      },
      {
        type: "separator"
      },
      {
        label: "关于",
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            const options = {
              type: "info",
              title: app.getName(),
              message: "版本: " + process.env.npm_package_version + "\r\n" +
                "日期: " + "2020-04-22\r\n" +
                "开发者: " + "hanguang\r\n" +
                "node: " + process.version + "\r\n" +
                "electron: " + process.versions.electron + "\r\n" +
                "chrome: " + process.versions.chrome + "\r\n" +
                "v8: " + process.versions.v8 + "\r\n" +
                "os: " + os.type() + " " + os.arch() + " " + os.release() + "\r\n"
            }
            dialog.showMessageBox(focusedWindow, options);
          }
        }
      },
      {
        type: "separator"
      },
      {
        label: "检查更新",
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            const options = {
              type: "info",
              title: "HTEST",
              message: "暂未实现"
            }
            dialog.showMessageBox(focusedWindow, options);
          }
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

export { menu };
