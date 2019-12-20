import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import  Cookies from 'js-cookie'
//hqpimport il8n from './lang'
import  ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI,{
  // size:Cookies.get('size') || 'medium',
 //hqp i18n: (key,value)=>il8n.t(key,value)
});


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
