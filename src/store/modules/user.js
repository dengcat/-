import { loginByUsername, logout, getUserInfo } from '@/api/login'
import {
  getToken,
  setToken,
  removeToken,
  setKeyToken,
  removeKeyToken,
  getKeyToken
} from '@/utils/auth'
import userGif from '@/assets/avatar_images/user.gif'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    refresh_token: getKeyToken('refresh_token'),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_REFTOKEN: (state, token) => {
      state.refresh_token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.usernameOrEmailAddress.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.result.access_token)
          commit('SET_REFTOKEN', data.result.refresh_token)
          setToken(data.result.access_token)
          setKeyToken('refresh_token', data.result.refresh_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (!response.data.success) {
            reject('error')
          }
          const data = response.data.result
          if (data.functions) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.functions)
          }
          commit('SET_NAME', data.user.name)
          commit('SET_AVATAR', userGif)
          commit('SET_INTRODUCTION', data.user.name)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', undefined)
        commit('SET_REFTOKEN', undefined)
        commit('SET_ROLES', [])
        removeToken()
        removeKeyToken('refresh_token')
        resolve()
        // logout(state.token).then(() => {
        //   commit('SET_TOKEN', '')
        //   commit('SET_ROLES', [])
        //   removeToken()
        //   removeKeyToken('refresh_token')
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', undefined)
        commit('SET_REFTOKEN', undefined)
        removeToken()
        removeKeyToken('refresh_token')
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    },

    UpdateToken({ commit }, token, refresh_token) {
      commit('SET_TOKEN', token)
      commit('SET_REFTOKEN', refresh_token)
    }
  }
}

export default user
