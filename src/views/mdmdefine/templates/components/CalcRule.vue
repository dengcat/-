<template>
<div>
  <el-card class="box-card sumcalc" style="margin-top:5px" >
    <div slot="header" class="clearfix">
      <span>
        <el-radio-group @change="handleChangeAndOr()" v-model="condition">
          <el-radio-button label="AND">且</el-radio-button>
          <el-radio-button label="OR">或</el-radio-button>
        </el-radio-group>
      </span>
      <el-button style="float: right;margin-right:10px" type="text" @click="handleAddGroup()">新增组合</el-button>
      <el-button style="float: right;margin-right:10px" type="text" @click="handleAddRule()">新增条件</el-button>
      <el-button v-if="index!==undefined" style="float: right;margin-right:10px" type="text" @click="handleDeleteGroup()">删除组合</el-button>
    </div>
    <div>
      <el-row v-for="(item,$index) in rules" :key="$index">
        <calc-rule v-if="item.condition && item.condition!==null" :key="$index" :formulaRule="formulaRule" @deleteGroup="deleteGroup" :index="$index" v-bind.sync="item"></calc-rule>
        <el-col v-if="item.condition===undefined || item.condition===null" :span="24">
          <condition :formulaRule="formulaRule" @deleteRule ="handleDeleteRule" :index="$index" :rule.sync="item"></condition>
        </el-col>
      </el-row>
    </div>
  </el-card>
  </div>
</template>

<script>
import Condition  from './Condition'

export default {
  name: "CalcRule",
  components:{Condition},
  filters: {},
  props: {
    condition: {
      type: String
    },
    rules: {
      type: Array
    },
    formulaRule: {
      type: Array
    },
    index:{
      type: Number
    }
  },
  data() {
    return {
      radio3: "且"
    };
  },
  watch: {},
  computed: {},
  created() {},
  methods: {
    handleAddRule() {
      this.rules.push({
        id: "",
        normId: "",
        type: "",
        operator: "",
        value: "",
        input: "",
        label: ""
      });
      this.$emit("update:rules", this.rules);
    },
    handleAddGroup() {
      this.rules.push({
        condition: "AND",
        rules: []
      });
      this.$emit("update:rules", this.rules);
    },
    handleDeleteGroup() {
      this.$emit("deleteGroup", this.index);
    },
    handleChangeAndOr() {
      this.$emit("update:condition", this.condition);
    },
    handleDeleteRule(index){
      this.rules.splice(index,1);
      this.$emit("update:rules", this.rules);
    },
    deleteGroup(index){
      this.rules.splice(index,1);
      this.$emit("update:rules", this.rules);
    }
  }
};
</script>

<style>
.sumcalc .el-card__header {
  padding: 3px 3px;
}
</style>