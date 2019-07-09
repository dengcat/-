import request from '@/utils/request'

export function loginByUsername(usernameOrEmailAddress, password) {
  const data = {
    usernameOrEmailAddress,
    password
  }
  return request({
    url: '/api/Account/GetOAuth2Token',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/api/services/app/session/GetCurrentLoginInformations',
    method: 'post',
    params: { token }
  })
}

