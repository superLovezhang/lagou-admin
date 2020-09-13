import router from '@/router'

import {
  login,
  logout,
  getInfo
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  tree
} from '@/api/permission'
import {
  getRouter
} from '@/utils'
import data from '@/assets/menu'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: 'http://5b0988e595225.cdn.sohucs.com/images/20180118/77a99ec22f84495c917965b246b8f969.jpeg',
    routerList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROUTER_LIST: (state, list) => {
      state.routerList = list
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data)
          commit('SET_TOKEN', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const userInfo = response.data.userInfo
          let data = response.data.permissionList
          let dynamicRouter = getRouter(data)
          let defaultRouter = router.options.routes
          router.addRoutes(dynamicRouter)
          router.options.routes = defaultRouter.concat(dynamicRouter)
          commit('SET_ROUTER_LIST', dynamicRouter)
          commit('SET_NAME', userInfo.adminName)
          // commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态设置前端菜单
    DynamicRouter({
      commit
    }) {
      // let data = res.data.rows
      let dynamicRouter = getRouter(data)
      console.log(dynamicRouter)
      let defaultRouter = router.options.routes
      router.addRoutes(dynamicRouter)
      router.options.routes = defaultRouter.concat(dynamicRouter)
      // router.options.routes = defaultRouter.concact(dynamicRouter)
      // commit('SET_ROUTER_LIST', dynamicRouter)
      // return new Promise((resolve, reject) => {
      // tree().then(res => {
      // let data = res.data.permissionList
      // let dynamicRouter = getRouter(data)
      // let defaultRouter = router.options.routes
      // router.addRoutes(dynamicRouter)
      // router.options.routes = defaultRouter.concat(dynamicRouter)
      // commit('SET_ROUTER_LIST', dynamicRouter)
      // resolve(data)
      // }).catch(err => {
      // reject(err)
      // })
      // })
    }
  }
}

export default user
