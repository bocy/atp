import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/apitest',
    name: '/',
    hidden: true,
    meta: { title: 'atp', icon: 'example' }
    // children: [{
    //   path: 'dashboard',
    //   component: () => import('@/views/dashboard/index')
    // }]
  },

  {
    path: '/apitest',
    component: Layout,
    redirect: '/apitest/testrun',
    name: '接口测试',
    meta: { title: '接口测试', icon: 'example' },
    children: [
      {
        path: 'envManage',
        name: 'envManage',
        component: () => import('@/views/apitest/envManage'),
        meta: { title: '环境管理', icon: 'table' }
      },
      {
        path: 'testEdit',
        name: 'testEdit',
        component: () => import('@/views/apitest/apitest'),
        meta: { title: '用例编辑', icon: 'tree' }
      },
      {
        path: 'testRun',
        name: 'testRun',
        component: () => import('@/views/apitest/testrun'),
        meta: { title: '测试执行', icon: 'tree' }
      },
      {
        path: 'testresult',
        name: 'testresult',
        component: () => import('@/views/apitest/TestResult'),
        meta: { title: '测试结果', icon: 'tree' }
      },
      {
        path: 'suiteresult',
        name: 'suiteresult',
        component: () => import('@/views/apitest/suiteResult'),
        meta: { title: '测试集结果', icon: 'tree' }
      }
    ]
  },

  {
    path: '/performanceTest',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '性能测试', icon: 'form' }
      }
    ]
  },
  {
    path: '/tools',
    component: Layout,
    name: '测试工具',
    meta: { title: '测试工具', icon: 'form' },
    children: [
      {
        path: 'idcard',
        name: 'idcard',
        component: () => import('@/views/tools/idcard'),
        meta: { title: '身份证号码生成', icon: 'form' }
      },
      {
        path: 'funtion',
        name: 'funtion',
        component: () => import('@/views/tools/idcard'),
        meta: { title: '函数工具', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

