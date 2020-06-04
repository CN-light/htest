import { app, BrowserWindow, globalShortcut, webContents, ipcMain } from 'electron'
import path from 'path'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const isWindows = process.platform === "win32";

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1050,
    height: 800,
    webPreferences: {
      //  preload: path.join(__dirname, 'preload.js'),
       nodeIntegration: true
    },
    frame: isWindows ? false : true, //移除默认菜单  
    useContentSize: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.webContents.closeDevTools()//默认不打开开发者工具

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 屏蔽系统某些快捷键并添加自己的事件
  globalShortcut.register('CommandOrControl+R', () => {
    mainWindow.webContents.send("main-to-start","start test")
  })

  globalShortcut.register('Shift+R', () => {
    mainWindow.webContents.send("main-to-start","stop test") 
  })

  globalShortcut.register('CommandOrControl+Shift+R', () => {
    mainWindow.webContents.send("main-to-start","restart test")
  })

  globalShortcut.register('CommandOrControl+Shift+C', () => {
    
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.setName("HTEST")

//主进程作为中转站转发菜单的请求 
ipcMain.on('menu-to-main', (event, arg) => {
  event.sender.send('main-to-start', arg)
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
