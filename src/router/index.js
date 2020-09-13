import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '../views/layout/Layout'

export const constantRouterMap = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    children: [
      {
        path: 'dashboard',
        meta: {
          title: '个人中心',
          icon: 'el-icon-menu'
        },
        component: () => import('@/views/dashboard')
      }
    ]
  },
  // {
  //   path: '/user',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '',
  //       name: 'user',
  //       meta: {
  //         title: '用户管理',
  //         icon: 'el-icon-s-custom'
  //       },
  //       component: () => import('@/views/user')
  //     }
  //   ]
  // },
  // {
  //   path: '/employee',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '',
  //       name: 'employee',
  //       meta: {
  //         title: '员工管理',
  //         icon: 'el-icon-user-solid'
  //       },
  //       component: () => import('@/views/employee')
  //     }
  //   ]
  // },
  // {
  //   path: '/company',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '',
  //       name: 'company',
  //       meta: {
  //         title: '企业管理',
  //         icon: 'el-icon-s-home'
  //       },
  //       component: () => import('@/views/company')
  //     }
  //   ]
  // },
  // {
  //   path: '/position',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '',
  //       name: 'position',
  //       meta: {
  //         title: '职位管理',
  //         icon: 'el-icon-s-cooperation'
  //       },
  //       component: () => import('@/views/position')
  //     }
  //   ]
  // },
  // {
  //   path: '/setting',
  //   redirect: '/setting/admin',
  //   component: Layout,
  //   meta: {
  //     title: '设置',
  //     icon: 'el-icon-setting'
  //   },
  //   children: [
  //     {
  //       path: 'admin',
  //       name: 'admin',
  //       meta: {
  //         title: '后台用户管理',
  //       },
  //       component: () => import('@/views/setting/admin')
  //     },
  //     {
  //       path: 'role',
  //       name: 'role',
  //       meta: {
  //         title: '角色管理',
  //       },
  //       component: () => import('@/views/setting/role')
  //     },
  //     {
  //       path: 'permission',
  //       name: 'permission',
  //       meta: {
  //         title: '资源权限管理',
  //       },
  //       component: () => import('@/views/setting/permission')
  //     }
  //   ]
  // },
  
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
