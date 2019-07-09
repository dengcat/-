/**
 * 该 mixin 负责处理渲染时需要使用的公共函数
 */
export default {
  methods: {
    toLowerCaseFirst(str) {
      if (str === undefined || str === null) {
        return str
      }
      return str[0].toLowerCase() + str.substr(1)
    },
  }
}
