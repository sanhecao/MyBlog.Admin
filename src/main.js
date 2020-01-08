import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router/index'
import '../util/global.js'//全局
import './promissionRouter.js'//这里进行路由后台获取的模拟
// import  Cookies from 'js-cookie'
//hqpimport il8n from './lang'
import  ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI,{
  // size:Cookies.get('size') || 'medium',
 //hqp i18n: (key,value)=>il8n.t(key,value)
});

import 'font-awesome/css/font-awesome.min.css'
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
