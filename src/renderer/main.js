// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import menu from './menu'
Vue.use(ElementUI);
Vue.config.productionTip = false

const customTitlebar = require('custom-electron-titlebar');
 
new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#252526'),
    itemBackgroundColor:customTitlebar.Color.fromHex('#094771'),
    unfocusEffect:true,
    // icon:require('path').join(__dirname, '/assets/logo.ico').replace(/\\/g, '\\\\')
    // icon:require('./assets/light_logo.png')
    icon:__static+"/logo.ico"
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
