<template>
  <div :class="isVaild? 'validate_error':''">
    <template v-if="isEdit">
      <el-date-picker :value="value" @input="(value) => this.$emit('input',value)" @change="handleChange"
        style="width:100%"
        v-if="type==='DatePicker'"
        type="date"
        >
      </el-date-picker>
      <NumberInput v-else-if="type==='number'" :precision="2" separator="," :value="value" @input="(value) => this.$emit('input',value)" @blur="handleChange" />
      <treeselect
        v-else-if="type==='select'"
        :value="value" 
        v-on:input="(value) => this.$emit('input',value)"
        style="width:100%"
        placeholder="请选择"
        v-bind="$attrs"
        :multiple="false"
        :append-to-body="true"
        searchPromptText="输入信息搜索"
        noResultsText="未搜索到结果"
        :options="options"
        :disable-branch-nodes="true"
      />
      <el-input v-else :value="value" @input="(value) => this.$emit('input',value)" @change="handleChange">
        <div
          v-if="unit!=null && unit!=''"
          slot="append"
          class="input-unit"
        >{{ unit }}</div>
      </el-input>
    </template>
    <template v-else>
      <span v-if="type==='DatePicker'"> {{value | moment("YYYY-MM-DD")}}</span>
      <NumberInput v-else-if="type==='number'" :precision="2" separator="," :value="value" @input="(value) => this.$emit('input',value)" @blur="handleChange" editType='read' />
      <span v-else> {{value}}</span>
    </template>
  </div>
  
</template>


<script>
import NumberInput from '@/components/NumberInput'
import Treeselect, { ASYNC_SEARCH } from "@riophae/vue-treeselect";

export default {
  name:'EditGridItem',
  inheritAttrs: false,
  components:{NumberInput, Treeselect},
  props:{
    isEdit:{
      type:[Boolean,Object],
      default:false
    },
    type:{
      type:String
    },
    value:{
    },
    userClass:{
      type:String
    },
    unit:{
      type:String
    },
    isVaild:{
      type: Boolean,
      default: false
    },
    options:{
      type:Array
    }
  },
  data(){
    return {

    }
  },
  watch:{
    // value: {
    //   handler(val) {
    //     if(this.type === 'select' && !val){
    //       this.$emit('input', val)
    //     }
    //   },
    //   deep:true
    // }
  },
  methods:{
    handleChange(val){
      this.$emit('change',val)
    }
  }
}
</script>

<style lang="scss">
.validate_error{
  .el-input__inner, .vue-treeselect__control{
    border-color: #f56c6c;
  }
}
</style>

