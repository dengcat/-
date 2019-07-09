import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getKeyToken(TokenKey) {
  return Cookies.get(TokenKey)
}

export function setKeyToken(TokenKey, token) {
  return Cookies.set(TokenKey, token)
}

export function removeKeyToken(TokenKey) {
  return Cookies.remove(TokenKey)
}
