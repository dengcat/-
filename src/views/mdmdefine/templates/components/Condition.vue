<template>
  <div style="display:inline">
    <el-select v-model="rule.id" @change="handleChangeSelect($event)" style="min-width:200px" placeholder="请选择">
      <el-option
        v-for="itemRule in formulaRule"
        :key="itemRule.id"
        :label="itemRule.label"
        :value="itemRule.id">
      </el-option>
    </el-select>
    <el-select v-model="rule.operator" style="min-width:100px" placeholder="请选择">
      <el-option
        v-for="item in currRule.operators"
        :key="item"
        :label="item  | operatorFilter"
        :value="item">
      </el-option>
    </el-select>
    <el-select v-if="currRule.values!=null && rule.operator!='is_empty' && rule.operator!='is_not_empty'" v-model="rule.value" style="min-width:200px" placeholder="请选择">
      <el-option
        v-for="item in Object.keys(currRule.values)"
        :key="item"
        :label="currRule.values[item]"
        :value="item">
      </el-option>
    </el-select>
    <el-input style="max-width:200px" v-if="currRule.values==null && rule.operator!='is_empty' && rule.operator!='is_not_empty' "  v-model="rule.value"></el-input>
    <el-button type="danger" circle icon="el-icon-delete" @click="handDelete()"></el-button>
  </div>
</template>

<script>
export default {
  name: "Condition",
  filters: {
    operatorFilter(operator){
      const operatorMap = {
        'equal': '等于',
        'not_equal': '不等于',
        'contains': '包含',
        'not_contains': '不包含',
        'is_empty': '为空',
        'is_not_empty': '不为空',
      }
      return operatorMap[operator]
    }
  },
  props: {
    formulaRule: {
      type: Array
    },
    rule: {
      type: Object
    },
    index:{
      type: Number
    }
  },
  data() {
    const tempData = Object.assign({},this.rule)
    const tempRule = Object.assign({},this.formulaRule.find(item => item.id === this.rule.id))
    return {
      currRule:tempRule,
      currData:tempData
    };
  },
  watch: {
    rule:function(val){
      this.$emit("update:rule", val);
    }
  },
  computed: {},
  created() {},
  methods: {
    handleChangeSelect(val) {
      const currVal = this.formulaRule.find((item) => {
        return item.id===val
      })
      this.currRule = currVal
      this.rule = Object.assign(this.rule,{
        id : currVal.id,
        normId : currVal.normId,
        type : currVal.type,
        operator : null,
        value : null,
        input : currVal.input,
        label : currVal.label
      })
      
    },
    handDelete(){
      this.$emit("deleteRule", this.index);
    }
  }
};
</script>

<style>
.sumcalc .el-card__header {
  padding: 3px 3px;
}
</style>