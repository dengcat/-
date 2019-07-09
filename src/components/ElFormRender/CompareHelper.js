
  const ns = {
    compare: function(operator, vLeft, vRight, ruleType) {
      switch (ruleType) {
        case 'date':
          return this.compareDate(operator, vLeft, vRight)
        case 'string':
          return this.compareString(operator, vLeft, vRight)
        case 'double':
          return this.compareNumber(operator, vLeft, vRight)
        default:
          // dialog.alert('不支持的数据类型!')
      }
      return false
    },
    isDate: function(value) {
      return !!(value && value.getFullYear)
    },
    /**
     *日期类型的字段比较
     *@operator {string} 比较类型(相等、不相等、...)
     *vLeft {string} left value
     *vRight {string} right value
     *return {bool} 比较结果
     */
    compareDate: function(operator, vLeft, vRight) {
      var d1, d2
      if (this.isDate(vLeft)) {
        d1 = new Date(vLeft)
      }
      if (this.isDate(vRight)) {
        d1 = new Date(vRight)
      }

      switch (operator) {
        case 'equal':
          if (d1 === undefined && d2 === undefined) {
            return true
          }
          if (d1 !== undefined && d2 !== undefined) {
            return d1 == d2
          }
          return false
        case 'not_equal':
          if (d1 === undefined && d2 === undefined) {
            return false
          }
          if (d1 !== undefined && d2 !== undefined) {
            return d1 != d2
          }
          return true
        case 'is_empty':
          return d1 === undefined
        case 'is_not_empty':
          return d1 !== undefined
        case 'greater':
          if (d1 === undefined || d2 === undefined) {
            return false
          }
          return d1 > d2
        case 'less':
          if (d1 === undefined || d2 === undefined) {
            return false
          }
          return d1 < d2
        case 'greater_or_equal':
          if (d1 === undefined || d2 === undefined) {
            return false
          }
          return d1 >= d2
        case 'less_or_equal':
          if (d1 === undefined || d2 === undefined) {
            return false
          }
          return d1 <= d2
      }
    },

    isType: function(type) {
      return function(obj) {
        return {}.toString.call(obj) == '[object ' + type + ']'
      }
    },

    /**
     *字符串类型的字段比较
     *@operator {string} 比较类型(相等、不相等、...)
     *vLeft {string} left value
     *vRight {string} right value
     *return {bool} 比较结果
     */
    compareString: function(operator, vLeft, vRight) {
      // eslint-disable-next-line one-var
      var d1 = '',
        d2 = ''
      if (this.isType('String')(vLeft)) {
        d1 = vLeft
      }
      if (this.isType('String')(vRight)) {
        d2 = vRight
      }

      switch (operator) {
        case 'equal':
          return d1 == d2
        case 'not_equal':
          return d1 != d2
        case 'is_empty':
          return !d1
        case 'is_not_empty':
          return !!d1
        case 'contains':
          return d1.indexOf(d2) > -1
        case 'not_contains':
          return d1.indexOf(d2) == -1
      }
    },

    /**
     *数值类型的字段比较
     *@operator {string} 比较类型(相等、不相等、...)
     *vLeft {string} left value
     *vRight {string} right value
     *return {bool} 比较结果
     */
    compareNumber: function(operator, vLeft, vRight) {
      var d1 = parseFloat(vLeft)
      var d2 = parseFloat(vRight)
      if (vLeft === '') {
        d1 = 0
      }
      if (vRight === '') {
        d2 = 0
      }

      switch (operator) {
        case 'equal':
          return d1 == d2
        case 'not_equal':
          return d1 != d2
        case 'is_empty':
          return d1 == 0
        case 'is_not_empty':
          return d1 != 0
        case 'greater':
          return d1 > d2
        case 'less':
          return d1 < d2
        case 'greater_or_equal':
          return d1 >= d2
        case 'less_or_equal':
          return d1 <= d2
      }
    }
  }

export default ns
