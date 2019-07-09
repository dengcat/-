<template>
  <div style="display:flex" v-if="data.valueType=='业务对象' && data.name=='详细地址'">
    <el-cascader
      :disabled="data.isReadonly"
      :readonly="disabled" 
      :name="data.name"
      :options="options"
      v-model="inputVal"
      change-on-select
      style="min-width:150px;display:inline-block;"
    />
    <el-input :disabled="data.isReadonly"  v-model="pertainVal" style="min-width:150px;display:inline-block;margin-left:10px"/>
  </div>
</template>

<script>
import { regionData,CodeToText } from 'chinaData'

export default {
  name: 'Address',
  filters: {
  },
  model: {
    prop: 'value',
    event: 'updateValue'
  },
  props: {
    data: Object,
    itemValue: {},
    value: Object|String,
    disabled: Boolean,
  },
  data() {
    return {
      options: regionData,
      inputVal: this.value,
      pertainVal:'',
    }
  },
  watch: {
    value(val){
      if(this.data.name && this.data.name==='详细地址'){
        this.inputVal =  
      }
      else{
        this.inputVal = val
      }
    },
    inputVal(val) {
      console.log('val',val)
      if(this.data.name && this.data.name==='详细地址'){
        this.$emit('updateValue', [...val,this.pertainVal])// 触发input事件，并传入新的值
      }
      else{
        this.$emit('updateValue', val)// 触发input事件，并传入新的值
      }
      if(this.data.groupType==0 && this.data.valueType=='数值'){
        this.$emit('NumValuechanged',this.data,val)
      }
    },
    pertainVal(val){
      if(this.data.name && this.data.name==='详细地址'){
        this.$emit('updateValue', [...this.inputVal,val])// 触发input事件，并传入新的值
      }

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
      // if (valueType == '数值') {
      //   arrResult.push('decimal')
      // }
      return arrResult.join('|')
    },
    handleInput(value) {
      this.$emit('input', value)// 触发input事件，并传入新的值
    },
    handleNumBlur(e){
      this.displayVal = e.target.value
    }

  },
  computed:{
    displayVal: {
      get: function() {   
        if(this.data.valueType=='数值' && this.inputVal){
          console.log('val',this.inputVal,numeral(this.inputVal).format('0,0.00'))
          return numeral(this.inputVal).format('0,0.00')
        }
        else{
          return this.inputVal
        }
      },
      set:function(val){
        if(this.data.valueType=='数值' && this.inputVal){
          this.inputVal = numeral(val).value()
        }
        else{
          this.inputVal = val
        }
      }
    }
  }
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
      padding: 0;
      height: 28px;
      width: auto;
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
