import mixinOptionExtensions from './mixin-package-option'
import mixinEnableWhen from './mixin-enable-when'
import { toCamelCase, isObject } from './utils'

function validator(data) {
  if (!data) {
    throw new Error('item data must be an Object.')
  } else if (!data.id) {
    throw new Error('item id is unvalidated.')
  } else if (!data.valueType) {
    throw new Error('item valueType is unvalidated.')
  }
}

export default {
  mixins: [mixinOptionExtensions, mixinEnableWhen],
  props: {
    data: Object,
    prop: {
      type: String,
      default() {
        return this.data.id
      }
    },
    itemValue: {},
    value: Object,
    disabled: Boolean
  },
  filters: {
  },
  computed: {
    // 是否显示
    _show() {
      return this.getEnableWhenSatatus()
    }
  },
  render(h) {
    validator(this.data) // 对数据进行简单校验
    return this.renderFormItemContent(h, this.data, this.itemValue)
  },
  methods: {
    /**
     * 渲染表单项的内容
     * @param  {Object} data 表单属性定义
     * @param  {All} value 单项表单数据值
     */
    renderFormItemContent(h, data, value) {
      const obj = isObject(data.$el) ? data.$el : {}
      const elType = this.typeFilter(data.valueType) === 'checkbox-button' ? 'checkbox-group' : this.typeFilter(data.valueType)
      const props = Object.assign({}, obj, { value }, { width: '100%' })
      console.log('props', props)
      this.disabled && (props.disabled = this.disabled) // 只能全局禁用, false时不处理
      return h('el-' + elType, {
        attrs: props, // 用于支持placeholder等原生属性(同时造成dom上挂载一些props)
        props,
        on: {
          // 手动更新表单数据
          input: (value) => {
            this.$emit('updateValue', { id: data.id, value })
          }
        },
      }, [
        (() => {
          const optRenderer = this[`${toCamelCase(this.typeFilter(data.valueType))}_opt`]
          if (typeof optRenderer === 'function' && Array.isArray(data.$options)) {
            return data.$options.map(optRenderer)
          }
        })()
      ])
    },
    typeFilter(type) {
      const statusMap = {
        '数值': 'input',
        '文本': 'input',
        '日期': 'date-picker',
        '枚举': 'select',
        '备注': 'input',
        '附件': 'input',
        '业务参数': 'select'
      }
      return statusMap[type]
    },
    typeValidate(type, isMustFill) {
      const validate = []
      if (isMustFill === 1) {
        validate.push('required')
      }
      if (type === '数值') {
        validate.push('decimal')
      }
      return validate.join('|')
    }
  }
}
