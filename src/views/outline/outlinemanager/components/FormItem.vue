<template>
  <div :class="['formitem',userClass? userClass:'']">
    <div class="formitem_div">
      <font>{{label}}</font>
    </div>
    <div style="width:100%">
      <el-input v-bind="$attrs"  v-if="type==='text'" :value="value" @input="(value) => this.$emit('input',value)">
      <div
          v-if="unit!=null && unit!=''"
          slot="append"
          class="input-unit"
        >{{ unit }}</div>
      </el-input>
      <div v-else-if="type==='none'"></div>
      <NumberInput v-else-if="type==='number'" v-bind="$attrs" :unit="unit" :precision="2" separator="," :value="value" @input="(value) => this.$emit('input',value)" @blur="handleChange" />
      <el-date-picker v-bind="$attrs"
        style="width:100%"
        v-else-if="type==='DatePicker'"
        :value="value" @input="(value) => this.$emit('input',value)"
        :readonly="readonly"
        type="date"
        >
      </el-date-picker>
      <el-input v-bind="$attrs"
        v-else-if="type==='textarea'"
        type="textarea"
        :rows="2"
        :readonly="readonly"
        :value="value" @input="(value) => this.$emit('input',value)">
      </el-input>
      <treeselect
        v-else-if="type==='select'"
        :value="value" 
        v-on:select="(value) => this.$emit('input',value)"
        style="width:100%"
        placeholder="请选择"
        v-bind="$attrs"
        :multiple="false"
        :append-to-body="false"
        :normalizer="normalizer"
        searchPromptText="输入信息搜索"
        noResultsText="未搜索到结果"
        :options="options"
        :disable-branch-nodes="true"
      />
      <el-input v-bind="$attrs" v-else :value="value" @input="(value) => this.$emit('input',value)">
        <div
          v-if="unit!=null && unit!=''"
          slot="append"
          class="input-unit"
        >{{ unit }}</div>
      </el-input>
    </div>
  </div>
</template>

<script>
import NumberInput from '@/components/NumberInput'
import Treeselect, { ASYNC_SEARCH } from "@riophae/vue-treeselect";

export default {
  name: "FormItem",
  components:{NumberInput, Treeselect},
  props:{
    label:{
      type:String
    },
    type:{
      type:String
    },
    value:{
    },
    readonly:{
      type:Boolean,
      default:false
    },
    userClass:{
      type:String
    },
    unit:{
      type:String
    },
    options:{
      type:Array
    },
    normalizer:{
      type:Function,
      default:function(node) {
        return {
          id: node.id,
          label: node.label,
          children: node.children
        };
      }
    }
  },
  data() {
    return {
    };
  },
  methods: {
    handleChange(val){
      this.$emit('change',val)
    },
    // normalizer(node) {
    //   return {
    //     id: node.buCode,
    //     label: node.buName,
    //     children: node.children
    //   };
    // },
    
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.formitemdiv {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  // justify-content:center;
  margin-left: 20px;
  margin-right: 20px;
}
.formitem {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 2px 20px;
  width: calc(33.33% - 40px);
}

.formitem_div {
  line-height: 28px;
  flex: 0 0 140px;
  font-size: small;
}
.formitemoneline {
  align-items: flex-start;
  margin: 2px 20px;
  width: calc(100% - 40px);
}
.cell-edit-input .el-input,
.el-input__inner {
  width: 100%;
}
.cell-icon {
  cursor: pointer;
  color: #fff;
}
.el-row {
  margin-bottom: 5px;
}
.formiteminline {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  // justify-content:center;
  align-items: flex-start;
}
.fixButton {
  right: 0px;
  left: 0px;
  position: fixed;
  bottom: 0;
  background: #fff;
  z-index: 300;
  height: 47px;
  margin-top: 10px;
  padding-top: 18px;
  border: 0;
  border-top: solid 1px #e9ebee;
}
.error_span {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  left: 0;
}
.el-card {
  overflow: unset;
}
.date_width{
  width:245px;
}
.input-unit {
  border: none;
  padding: 0;
  height: 26px;
  width: auto;
  line-height: 28px;
}
</style>
<style lang="scss">
.editCard {
  .el-card__header {
    padding: 10px 20px;
  }
}
</style>
