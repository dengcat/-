<template>
  <div style="width:100%">
    <!-- 数值 -->
    <el-form-item
      v-if="data.valueType=='数值'"
      :label="data.name"
      :key="data.id"
      :prop="inputVal"
      :rules="getRule(data)"
    >
      <el-input v-model="inputVal">
        <div v-if="data.unit!=null" slot="suffix" class="input-unit">{{ data.unit }}</div>
      </el-input>
    </el-form-item>
    <!-- 文本 -->
    <el-form-item
      v-if="data.valueType=='文本' && data.name!='所在城市' "
      :label="data.name"
      :key="data.id"
      :prop="inputVal"
      :rules="getRule(data)"
    >
      <el-input v-model="inputVal"/>
    </el-form-item>
    <!-- 日期 -->
    <el-form-item
      v-if="data.valueType=='日期' "
      :label="data.name"
      :key="data.id"
      :prop="inputVal"
      :rules="getRule(data)"
    >
      <el-date-picker v-if="data.valueType=='日期'" v-model="inputVal" :name="data.name" style="width:100%" />
    </el-form-item>
    <!-- 枚举 -->
    <el-form-item
      v-if="data.valueType=='枚举' || data.valueType=='业务参数' || data.valueType=='业务对象'"
      :label="data.name"
      :key="data.id"
      :prop="inputVal"
      :rules="getRule(data)"
    >
      <el-select v-model="inputVal" :name="data.name" style="width:100%" placeholder="请选择"/>
    </el-form-item>
    <!-- 城市 -->
    <el-form-item
      v-if="data.valueType=='文本' && data.name=='所在城市'"
      :label="data.name"
      :key="data.id"
      :prop="inputVal"
      :rules="getRule(data)"
    >
      <el-cascader
        :name="data.name"
        :options="options"
        v-model="inputVal"
        style="width:100%"
      />
    </el-form-item>

    <!-- 备注 -->
    <el-form-item
      v-if="data.valueType=='备注'"
      :label="data.name"
      :key="data.id"
      :prop="inputVal"
      :rules="getRule(data)"
    >
      <el-input
        :name="data.name"
        v-model="inputVal"
        :rows="3"
        style="width:100%"
        type="textarea"
        placeholder="请输入"/>
    </el-form-item>
  </div>
</template>

<script>
import { regionData } from 'element-china-area-data'

export default {
  name: 'RenderFormItem',
  filters: {
  },
  model: {
    prop: 'value',
    event: 'updateValue'
  },
  props: {
    data: Object,
    itemValue: {},
    value: Object,
    disabled: Boolean
  },
  data() {
    return {
      options: regionData,
      inputVal: this.value,
    }
  },
  watch: {
    inputVal(val) {
      this.$emit('updateValue', val)// 触发input事件，并传入新的值
    }
  },
  methods: {
    typeValidate(type, isMustFill) {
      const validate = []
      if (isMustFill === 1) {
        validate.push('required')
      }
      if (type === '数值') {
        validate.push('decimal')
      }
      return validate.join('|')
    },
    handleChange(value) {
      },
    getValidate(isMustFill, valueType) {
      const arrResult = []
      if (isMustFill == true) {
        arrResult.push('required')
      }
      if (valueType == '数值') {
        arrResult.push('decimal')
      }
      console.log('isMustFill', isMustFill)
      console.log('valueType', valueType)
      console.log('arrResult', arrResult.join('|'))
      return arrResult.join('|')
    },
    handleInput(value) {
      this.$emit('input', value)// 触发input事件，并传入新的值
    },
    getRule(o) {
      const rule = []
      if (o.isMustFill === true) {
        rule.push({ required: true, message: '请输入' + o.name, trigger: ['blur', 'change'] })
      }
      // if(valueType=='数值'){
      //   rule.push({})
      // }
      return rule
    }

  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .formitemdiv{
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction:row;
    flex-wrap:wrap;
    justify-content:center;
    align-items:center;
  }
  .formitem{
    margin: 10px;
    width: 40%;
  }
  .cell-edit-input .el-input, .el-input__inner {
    width:100%;
    }
    .cell-icon{
    cursor:pointer;
    color:#fff;
    }
    .input-unit{
      border: none;
      right: -20px;
      top: 1px;
      padding: 0;
      height: 28px;
      width: 100px;
      line-height: 28px;
    }
    .error_span{
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      left: 0;
    }
    .inputerror{
      border-color: #f56c6c;
    }
</style>
