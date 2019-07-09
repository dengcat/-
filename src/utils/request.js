import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import {
  getToken,
  getKeyToken,
  setToken,
  setKeyToken
} from '@/utils/auth'
import router from '@/router'

// create an axios instance
// ajax 对象  $.ajax
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 50000, // request timeout
  isRetryRequest: false,
})

// request interceptor
service.interceptors.request.use(
  config => {
    // if (store.getters.isAtRefreshToken) {
    //   console.log(store.getters.isAtRefreshToken, config)
    //   const interval = setInterval(
    //     () => {
    //       if (!store.getters.isAtRefreshToken) {
    //         // Do something before request is sent
    //         if (getToken()) {
    //           // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    //           config.headers['Authorization'] = 'Bearer ' + getToken()
    //         }
    //         clearInterval(interval)
    //         return config
    //       }
    //     }, 100
    //   )
    // } else {
      // Do something before request is sent
      if (getToken() || store.getters.token) {
        // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        config.headers['Authorization'] = 'Bearer ' + (getToken() || store.getters.token)
      }
      return config
    // }
  },
  error => {
    // Do something with request error
    // console.log(error) // for debug
    Promise.reject(error)
  }
)

// 刷新token的请求方法
function getRefreshToken() {
  // refresh_token使用vuex存在本地的localstorage，之后会详细说
  const refresh_token = getKeyToken('refresh_token') || store.getters.refresh_token

  // qs的使用主要是因为该接口需要表单提交的方式传数据，具体使用方法自行百度
  return axios.get(process.env.BASE_API + '/api/Account/GetOAuth2TokenByRefreshToken?refreshToken=' + refresh_token)
}

// respone interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const status = response.status
    const res = response.data
    if (status !== 200 && res && res.success && res.success !== true) {
      Message({
        message: res.error.message,
        type: 'error',
        duration: 10 * 1000
      })
      return Promise.reject('error')
    } else {
      return response
    }
  },
  error => {
    // console.log('response', store.getters.isAtRefreshToken, error)
    if (store.getters.isAtRefreshToken) {
      return new Promise(
        (resolve) => {
          const interval = setInterval(
            () => {
              if (!store.getters.isAtRefreshToken) {
                const authToken = getToken() || store.getters.token
                error.config.headers.Authorization = `Bearer ` + authToken
                error.config.baseURL = ''
                // 重新请求
                clearInterval(interval)
                resolve(service(error.config))
              }
            }, 100
          )
        }
      )
    } else {
      if (error.response.status === 401 && (getKeyToken('refresh_token') || store.getters.refresh_token) !== undefined && !error.config.isRetryRequest) {
        store.dispatch('setAtRefreshToken', true)
        return getRefreshToken()
          .then(function(res) {
            const data = res.data
            if (data.success) {
              store.dispatch('UpdateToken', data.result.access_token, data.result.refresh_token)
              setToken(data.result.access_token)
              setKeyToken('refresh_token', data.result.refresh_token)
              // 修改flag
              error.config.isRetryRequest = true
              // 修改原请求的token
              const authToken = data.result.access_token
              error.config.headers.Authorization = `Bearer ` + authToken
              /* 这边不需要baseURL是因为会重新请求url
               *url中已经包含baseURL的部分了
               *如果不修改成空字符串，会变成'api/api/xxxx'的情况*/
              error.config.baseURL = ''
              store.dispatch('setAtRefreshToken', false)
              // 重新请求
              return new Promise((resolve) => {
                resolve(service(error.config))
              })
            } else {
              // 刷新token失败只能跳转到登录页重新登录
              store.dispatch('LogOut').then(() => {
                router.replace({
                  path: '/login',
                  // query: {
                  //   redirect: router.currentRoute.fullPath
                  // }
                })
              })
              return Promise.reject('登录超时')
            }
          })
          // .catch(function(err) {
          //   // 刷新token失败只能跳转到登录页重新登录
          //   store.dispatch('LogOut').then(() => {
          //     router.replace({
          //       path: '/login',
          //       // query: {
          //       //   redirect: router.currentRoute.fullPath
          //       // }
          //     })
          //   })
          //   return Promise.reject(err)
          // })
      }
      // console.log('err', error) // for debug
      Message({
        message: error.response.data.error.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(error)
    }
  }
)

export default service
function newFunction() {
  return `&{getToken}`
}

