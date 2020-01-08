import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Welcome from '../views/Welcome.vue'
const _import = require('@/router/_import_' + process.env.NODE_ENV);//获取组件的方法

import Layout from '../views/Layout/Layout.vue';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Welcome,
    name: 'weclome',
    iconCls: 'fa-qq',

    meta: {
      title: 'QQ欢迎页',
      requireAuth: true
    }
  },
  {
    path: '/login',
    component: Login,
    name: 'login',
    iconCls: 'fa-address-card',
    meta: {
      title: '登录',
      NoTabPage: true,
      NoNeedHome: true
    },
    hidden: true
  }
];
const createRouter = () =>new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});
const router = createRouter();

export function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters =  asyncRouterMap.filter(route => {
    if (route.path && !route.IsButton) {
      if (route.path === '/' || route.path === '-') {
        route.component = Layout
      } else {
        try {
          route.component = _import(route.path.replace('/:id', ''))
        } catch (e) {
          try {
            route.component = () => import('@/views' + route.path.replace('/:id', '') + '.vue');
          } catch (error) {
            console.info('%c 当前路由 ' + route.path.replace('/:id', '')
                + '.vue 不存在，因此如法导入组件，请检查接口数据和组件是否匹配，并重新登录，清空缓存!',
                "color:red")
          }
        }
      }
    }
   // console.log(route);
    if (route.children && route.children.length && !route.IsButton) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  });
  return asyncRouterMap;

}
export function resetRouter(){
  const newRouter=createRouter();
  router.matcher=newRouter.matcher;
}
router.$addRoutes=(params)=>{
  //console.log('$addRoutes' + params);
  var f = item => {

    if (item['children']) {
      item['children'] = item['children'].filter(f);
      return true;
    } else if (item['IsButton']) {
      return item['IsButton']===false;
    }  else {
      return true;
    }

  };

  var params1 =params.filter(f);
  console.log('addRoutes' , params1);
  router.options.routes = params1;
  router.addRoutes(params1);

};
export default router
