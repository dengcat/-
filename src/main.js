import 'babel-polyfill'

import Vue from 'vue'

import VeeValidate, {
  Validator
} from 'vee-validate'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import 'clusterize'
// import './assets/custom-theme/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import VueAreaLinkage from 'vue-area-linkage'
import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
// import './mock' // simulation data
import zh_CN from 'vee-validate/dist/locale/zh_CN'
import * as filters from './filters' // global filters
import numeral from 'numeral'
import permission from '@/directive/permission/index.js' // 权限判断指令
import LyTreeTable from '@/components/LyTreeTable'
// import Fragment from 'vue-fragment'
import LazyRender from 'vue-lazy-render'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import 'ag-grid-enterprise'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'

Vue.use(VXETable, {
  size: 'small',
  tooltipConfig: {
    zIndex: 3000
  }
})
Vue.use(LazyRender)

// Vue.use(Fragment.Plugin)

// 时间
Vue.use(require('vue-moment'))

// 表单验证
Validator.localize('zh_CN', zh_CN)
const dictionary = {
  zh_CN: {
      messages: {
          required: () => '请填写内容',
      }
  }
}

Validator.localize(dictionary)

const config = {
  // errorBagName: 'errorBags', // change if property conflicts.
  fieldsBagName: 'fieldBags',
  locale: 'zh_CN',
}
// 表单填写数字验证
const isNumber = {
  getMessage: field => '数字格式不正确',
  validate: (value, args) => {
    if (numeral(value).value() !== undefined && numeral(value).value() !== null && !isNaN(numeral(value).value())) {
      return true
    } else {
      return false
    }
  }
}
Validator.extend('isNumber', isNumber)

Vue.use(VeeValidate, config)

// 其他全局组件
Vue.use(VueAreaLinkage)
Vue.use(permission)

Vue.use(Element, {
  size: Cookies.get('size') || 'mini', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.component(LyTreeTable.name, LyTreeTable)

// Vue.config.performance = true
// const accounting = window.accounting
// Vue.prototype.accounting = accounting

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
