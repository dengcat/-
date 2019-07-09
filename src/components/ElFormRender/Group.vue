<template>
  <el-dialog width="900px" ref="select" v-el-drag-dialog :visible="visible" :show-close="true" @close="handleCancel()" :title="currEditGroup.name" @dragDialog="handleDrag">
    <div class="formitemdiv">
      <div :class="[o.isOneLine===true? 'formitemoneline' : 'formitem','formiteminline']" v-for="o in currEditGroup.children" :key="o.id">
        <div style="line-height: 28px;flex: 0 0 180px;">
          <tool-tip v-if="o.remark!=''" :remark="o.remark">
            <font :color="[o.isMustFill==false? '#666':'#b3450e']">{{ o.name }}</font>
          </tool-tip>
          <font v-else :color="[o.isMustFill==false? '#666':'#b3450e']">{{ o.name }}</font>
          <el-tooltip v-if="o.formulaConditionText!==undefined && o.formulaConditionText!==null && o.formulaConditionText!=='' " :content="o.formulaConditionText" class="item" effect="dark" placement="top-start">
            <svg-icon icon-class="fx" />
          </el-tooltip>
          <template v-if="isDisabled">：</template>
        </div>
        
        <div style="width:100%">
          <render-input :data-vv-delay="500" :textVal="form[`${toLowerCaseFirst(o.fieldName || o.name)}__text`]" :disabled="isDisabled" 
           :name="o.fieldName || o.name" v-validate="getValidate(o.isMustFill,o.valueType)"
            v-model="form[o.fieldName || o.name]" @UpdateSelectText="handUpdateSelectText"
             @NumValuechanged="handNumValueEvent" @TextValuechanged="textValuechanged"
              :data="o" :row="currEditGroup" 
              :setData="setData[o.businessParamName || o.businessObjectName]"
              :isVaild="errors.has(o.fieldName || o.name)" />
          <span v-show="errors.has(o.fieldName || o.name)" class="error_span">{{ errors.first(o.fieldName || o.name) }}</span>
        </div>
      </div>
      
    </div>
    <el-row style="margin-top:20px;text-align:center" >
        <el-col :span="24" align="middle">
          <el-button v-if="!isDisabled" type="primary" ref="btnSave" @click="handleSave()">保存</el-button>
          <el-button @click="handleCancel()">取消</el-button>
        </el-col>
      </el-row>
  </el-dialog>
</template>

<script>
import { Form } from "element-ui";
import RenderInput from "./renderinput";
import ToolTip from "./ToolTip";
import { deepClone } from "@/utils/index.js";
import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
import mixincommom from "./mixin-commom";


export default {
  name: "Group",
  directives: { elDragDialog },
  mixins: [mixincommom],
  components: {
    RenderInput,
    ToolTip
  },
  // model: {
  //   prop: 'formData',
  //   event: 'updateRow'
  // },
  filters: {
    LabelColor(isMustFill) {
      const intMap = {
        0: "#303133",
        1: "#b3450e"
      };
      return intMap[isMustFill];
    }
  },
  props: {
    currEditGroup: {
      type: Object,
      required: true
    },
    // 禁用所有表单
    disabled: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object
    },
    groupMode:{
      type: String
    },
    visible:{
      type: Boolean
    },
    setData:{
      
    },
    isDisabled:{}
  },
  data() {
    return {
      form:this.formData
    }
  },
  computed: {
  },
  watch: {
    formData: function(val){
      this.form = val
    }
  },
  methods: {
    handleDrag(){
      //this.$refs.select.blur();
    },
    getValidate(isMustFill, valueType) {
      const arrResult = []
      if (isMustFill == true) {
        arrResult.push('required')
      }
      if (valueType == '数值') {
        arrResult.push('isNumber')
      }
      return arrResult.join('|')
    },
    handleSave(){
      this.$validator.validate().then(
        (result) => {
          if(!result){
            this.$message({
                message: "表单校验不通过，请检查",
                type: "error",
                duration: 3 * 1000
              });
            return
          }
          else{
            this.$emit('updateRow',this.form,this.groupMode,this.currEditGroup)
          }
        }
      )
    },
    textValuechanged(data,val,row){
      this.$emit('TextValuechanged',data, val, row)
    },
    handNumValueEvent(data,val,row){
      this.$emit('NumValuechanged',data, val, row)
    },
    handleCancel(){
      this.$emit('closeWin')
    },
    handUpdateSelectText(textname,text){
      this.form[textname] = text
    },
    // handleNumDisplayChange(textname,text){
    //   this.form[textname] = text
    // }
  },
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
  margin: 2px 10px;
  width: calc(50% - 20px);
}
.formitemoneline {
  align-items: flex-start;
  margin: 2px 10px;
  width: calc(100% - 20px);
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
.el-upload-list--picture .el-upload-list__item {
  overflow: hidden;
  z-index: 0;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-top: 5px;
  margin-left: 5px;
  padding: 0px 10px 0px 10px;
  height: 28px;
  width:200px;
  float: left;
}
.el-upload-list--picture .el-upload-list__item.is-success .el-upload-list__item-name{
  line-height:28px;
  margin-top: 0;
}
.el-upload-list--picture .el-upload-list__item-thumbnail{
  vertical-align: middle;
  text-align: left;
  display: inline-block;
  width: 20px;
  height: 70px;
  float: left;
  position: relative;
  z-index: 1;
  margin-left: 0px;
  line-height: 28px;
}
.el-upload-list{
  width:calc(100% - 400px)
}
.error_span{
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      left: 0;
    }
</style>
