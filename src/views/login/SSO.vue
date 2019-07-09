<template>
</template>

<script>

import {
  getToken,
  setToken,
  removeToken,
  setKeyToken,
  removeKeyToken
} from '@/utils/auth'
import store from '@/store'


export default {
  name: 'SSO',
  methods: {
    
  },
  created(){
    const path = this.$route.query.path
    const token = this.$route.query.token
    const refresh_token = this.$route.query.refresh_token
    setKeyToken('token', token)
    setKeyToken('refresh_token', refresh_token)
    store.dispatch('UpdateToken', token, refresh_token)
    this.$router.push({ path: `/${path ? escape(path):''}` })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
