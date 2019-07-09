<template>
  <div :class="isVaild?'renderinput':''" style="width:100%">
    <template v-if="!disabled">
      <el-input
        :disabled="data.isReadonly"
        v-if="data.valueType=='数值'"
        class="inputerror"
        :value="numFormat"
        v-on:input="handleNumInput"
        v-on:blur="handleNumBlur"
        :name="data.name"
        @focus="handleNumFocus"
      >
        <div
          v-if="data.unit!=null && data.unit!=''"
          slot="append"
          class="input-unit"
        >{{ data.unit }}</div>
      </el-input>
      <!-- <el-input :disabled="data.isReadonly"  v-if="data.valueType=='数值'"  class="inputerror"
        v-model="displayVal"
        v-on:blur="handleNumBlur"
        :name="data.name">
        <div v-if="data.unit!=null && data.unit!=''" slot="append" class="input-unit">{{ data.unit }}</div>
      </el-input> -->
      <el-input
        :disabled="data.isReadonly"
        v-if="data.valueType=='文本' && data.name!='所在城市'"
        :value="inputVal"
        v-on:input="inputValChange"
        :name="data.name"
      />
      <el-date-picker
        :disabled="data.isReadonly"
        v-if="data.valueType=='日期'"
        v-model="inputVal"
        :name="data.name"
        style="width:100%"
      />
      <treeselect
        v-if="data.valueType=='枚举'"
        v-model="inputVal"
        :name="data.name"
        style="width:100%"
        placeholder="请选择"
        :disabled="data.isReadonly"
        :multiple="data.isMulti"
        :append-to-body="appendToBody"
        :normalizer="normalizer"
        :options="enumItem"
        v-on:select="selectItem"
      />
      <treeselect
        v-if="data.valueType=='业务参数'"
        v-model="inputVal"
        :name="data.name"
        style="width:100%"
        placeholder="请选择"
        :disabled="data.isReadonly"
        :multiple="data.isMulti"
        :append-to-body="appendToBody"
        :normalizer="normalizer"
        :options="setData"
        v-on:select="selectItem"
      />

      <treeselect
        v-if="data.valueType=='业务对象' && data.name=='项目负责人' "
        v-model="displayVal"
        :name="data.name"
        style="width:100%"
        placeholder="请选择"
        :disabled="data.isReadonly"
        :multiple="false"
        :append-to-body="appendToBody"
        :async="true"
        :normalizer="normalizer"
        :load-options="loadOptions"
        v-on:select="selectItem"
        searchPromptText="输入信息搜索"
        noResultsText="未搜索到结果"
        value-format="object"
      />
      <treeselect
        v-if="data.valueType=='业务对象' && data.name=='产品类型' && data.groupType===1 "
        v-model="inputVal"
        :name="data.name"
        style="width:100%"
        placeholder="请选择"
        :disabled="data.isReadonly"
        :multiple="false"
        :options="selectOption"
        :normalizer="productTypeNormalizer"
        :disable-branch-nodes="true"
        v-on:select="selectItem"
      />
      <!-- <treeselect v-if="data.valueType=='业务对象' && data.name=='产品类型' && data.businessObjectName!=='产品类型' " v-model="inputVal" :name="data.name" style="width:100%" placeholder="请选择"
        :multiple="false"
        :options="selectOption"
        :normalizer="normalizer"
        :disable-branch-nodes="true"
        v-on:select = "selectItem" 
      /> -->
      <div
        v-if="data.valueType=='业务对象' && data.name=='产品类型' && data.groupType!==1 "
        :value="inputVal"
        style="line-height:28px;font-size:12px"
      >
        {{textVal}}
      </div>

      <treeselect
        v-if="data.valueType=='业务对象' && data.name=='所属产品' "
        v-model="inputVal"
        :name="data.name"
        style="width:100%"
        placeholder="请选择"
        :disabled="data.isReadonly"
        :multiple="false"
        :append-to-body="appendToBody"
        :normalizer="productNormalizer"
        :options="setData"
        v-on:select="selectItem"
      />

      <div
        style="display:flex"
        v-if="data.valueType=='业务对象' && data.name=='详细地址'"
      >
        <el-cascader
          :disabled="data.isReadonly"
          :readonly="disabled"
          :name="data.name"
          :options="options"
          v-model="inputVal"
          change-on-select
          style="min-width:200px;display:inline-block;"
        />
        <el-input
          :disabled="data.isReadonly"
          v-model="pertainVal"
          style="min-width:150px;display:inline-block;margin-left:10px"
        />
      </div>

      <el-input
        :disabled="data.isReadonly"
        v-if="data.valueType=='备注'"
        :name="data.name"
        :rows="3"
        style="width:100%;"
        type="textarea"
        placeholder="请输入"
      />
    </template>
    <template v-if="disabled">
      <div class="formreadonly">
        <el-input
          :disabled="disabled"
          class="inputerror"
          :value="numFormat || textVal || displayVal || inputVal"
        >
          <div
            v-if="data.unit!=null && data.unit!=''"
            slot="append"
            class="input-unit"
          >{{ data.unit }}</div>
        </el-input>
      </div>
    </template>

  </div>
</template>

<script>
// import { regionData,CodeToText } from 'element-china-area-data'
import { regionData, CodeToText } from "chinaData";
import numeral from "numeral";
import { ValidationProvider } from "vee-validate";
import { arrayTransTree } from "@/utils";
// import the component
import Treeselect, { ASYNC_SEARCH } from "@riophae/vue-treeselect";
import { getMdmUserList } from "@/api/basicdata";

const simulateAsyncOperation = fn => {
  setTimeout(fn, 1000);
};

export default {
  name: "RenderInput",
  components: { ValidationProvider, Treeselect },
  filters: {},
  model: {
    prop: "value",
    event: "updateValue"
  },
  props: [
    "data",
    "itemValue",
    "value",
    "disabled",
    "row",
    "setData",
    "textVal",
    "isVaild"
  ],
  data() {
    let inputTempVal;
    let pertainTempVal;
    if (
      this.data.name &&
      this.data.name === "详细地址" &&
      this.value &&
      JSON.parse(this.value)
    ) {
      inputTempVal = JSON.parse(this.value).addressBook;
      pertainTempVal = JSON.parse(this.value).pertainVal;
    } else {
      // 其他逻辑
      if (this.data.isMulti && this.value && !Array.isArray(this.value)) {
        inputTempVal = [this.value];
      } else {
        inputTempVal = this.value;
      }
    }

    return {
      options: regionData,
      inputVal: inputTempVal,
      pertainVal: pertainTempVal,
      appendToBody: false,
      // 控件值对象，用于对外传值
      valueObjiect: undefined,
      // 数值格式化显示值
      numFormat: undefined,
      // 数字控件焦点
      numFocus:false
    };
  },
  beforeUpdate(){
    console.log('重新渲染',this.value)
  },
  created() {
    console.log('重新创建',this.value)
    // 数值处理
    let tempNumFormat;
    if (this.data.valueType == "数值") {
      const tempval = numeral(this.value);
      if (
        this.data.valueType == "数值" &&
        this.value !== undefined &&
        this.value !== "" &&
        tempval.value() !== null &&
        tempval.value() !== undefined &&
        !isNaN(tempval.value())
      ) {
        if (
          typeof this.data.dec !== undefined &&
          this.data.dec !== "" &&
          this.data.dec > 0
        ) {
          tempNumFormat = tempval.format(`0,0.${"0".repeat(this.data.dec)}`);
        } else if (this.data.dec === 0) {
          tempNumFormat = tempval.format(`0,0`);
        } else {
          tempNumFormat = tempval.format(`0,0.00`);
        }
        this.numFormat = tempNumFormat;
      }
    }
  },
  watch: {
    // value(val) {
    //   if (
    //     this.data.name &&
    //     this.data.name === "详细地址" &&
    //     val &&
    //     JSON.parse(this.value)
    //   ) {
    //     this.inputVal = JSON.parse(this.value).addressBook;
    //     this.pertainVal = JSON.parse(this.value).pertainVal;
    //     this.inputValChange(JSON.parse(this.value).addressBook);
    //   } else {
    //     if (this.data.isMulti && !Array.isArray(val)) {
    //       // 处理上一版本是单选，下一版本是多选的情况
    //       this.inputVal = [val];
    //       this.inputValChange([val]);
    //     } else {
    //       this.inputVal = val;
    //       this.inputValChange(val);
    //     }
    //   }
    // },
    // inputVal(val) {
    //   if (this.data.name && this.data.name === "详细地址") {
    //     this.$emit("TextValuechanged", this.data, val, this.row);
    //     this.$emit(
    //       "updateValue",
    //       JSON.stringify({
    //         addressBook: this.inputVal,
    //         pertainVal: this.pertainVal
    //       })
    //     ); // 触发input事件，并传入新的值
    //     // 更新编码
    //     // this.$emit('CodeValuechanged')
    //   } else {
    //     this.$emit("updateValue", val); // 触发input事件，并传入新的值
    //   }
    //   if (this.data.valueType == "数值") {
    //     const tempval = numeral(val);
    //     let tempNumFormat;
    //     if (
    //       val !== undefined &&
    //       val !== "" &&
    //       tempval.value() !== null &&
    //       tempval.value() !== undefined &&
    //       !isNaN(tempval.value())  && !this.numFocus
    //     ) {
    //       if (
    //         typeof this.data.dec !== undefined &&
    //         this.data.dec !== "" &&
    //         this.data.dec > 0
    //       ) {
    //         tempNumFormat = tempval.format(`0,0.${"0".repeat(this.data.dec)}`);
    //       } else if (this.data.dec === 0) {
    //         tempNumFormat = tempval.format(`0,0`);
    //       } else {
    //         tempNumFormat = tempval.format(`0,0.00`);
    //       }
    //       this.numFormat = tempNumFormat;
    //     }
    //     this.$emit("NumValuechanged", this.data, val, this.row);
    //   }
    //   if (this.data.valueType == "文本" || this.data.valueType == "业务参数") {
    //     this.$emit("TextValuechanged", this.data, val ? val : "", this.row);
    //   }
    // },
    pertainVal(val) {
      if (this.data.name && this.data.name === "详细地址") {
        this.$emit(
          "updateValue",
          JSON.stringify({
            addressBook: this.inputVal,
            pertainVal: this.pertainVal
          })
        ); // 触发input事件，并传入新的值
        this.$emit("TextValuechanged", this.data, val, this.row);
      }
    },
    numFormat(val){
      this.$emit(
        "NumDisplayChange",
        `${this.data.fieldName || this.data.name}__text`,
        val
      );
    }
  },
  methods: {
    typeValidate(type, isMustFill) {
      const validate = [];
      if (isMustFill === 1) {
        validate.push("required");
      }
      if (type === "数值") {
        validate.push("decimal");
      }
      return validate.join("|");
    },
    handleChange(value) {},

    handleInput(value) {
      this.$emit("input", value); // 触发input事件，并传入新的值
    },
    handleNumBlur(e) {
      // 数值处理 
      this.numFocus = false
      const tempval = numeral(e.target.value);
      this.$nextTick(() => {
        let tempNumFormat;
        if (
          e.target.value !== undefined &&
          e.target.value !== "" &&
          tempval.value() !== null &&
          tempval.value() !== undefined &&
          !isNaN(tempval.value())  && !this.numFocus
        ) {
          if (
            typeof this.data.dec !== undefined &&
            this.data.dec !== "" &&
            this.data.dec > 0
          ) {
            tempNumFormat = tempval.format(`0,0.${"0".repeat(this.data.dec)}`);
          } else if (this.data.dec === 0) {
            tempNumFormat = tempval.format(`0,0`);
          } else {
            tempNumFormat = tempval.format(`0,0.00`);
          }
          this.numFormat = tempNumFormat;
        }
      })
      
      
    },
    handleNumInput(e) {
      const tempval = numeral(e);
      if(e !== undefined &&
          e !== "" &&
          tempval.value() !== null &&
          tempval.value() !== undefined &&
          !isNaN(tempval.value())  && !this.numFocus)
      {
        this.inputVal = tempval.value();
        this.inputValChange(tempval.value());
        // this.$emit("NumValuechanged", this.data, tempval.value(), this.row);
      }
      else{
        this.inputVal = e;
        this.inputValChange(e);
        // this.$emit("NumValuechanged", this.data, e, this.row);
      }
    },
    normalizer(node) {
      return {
        id: node.value,
        label: node.text,
        children: node.children
      };
    },
    productTypeNormalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    productNormalizer(node) {
      return {
        id: node.businessDataGuid,
        label: node.name,
        children: node.children
      };
    },
    selectItem(node, instanceId) {
      this.$emit(
        "UpdateSelectText",
        `${this.data.fieldName || this.data.name}__text`,
        node.name || node.text
      );
      this.$emit(
        "SelectNode",
        `${this.data.fieldName || this.data.name}`,
        node
      );
    },
    loadOptions({ action, searchQuery, callback }) {
      if (action === ASYNC_SEARCH) {
        getMdmUserList(searchQuery).then(response => {
          const options = response.data.result.map(i => ({
            value: `${i.userId}`,
            text: `${i.userName}`
          }));
          callback(null, options);
        });
      }
    },
    handleNumFocus(e){
      console.log('numFocus',this.numFocus)
      this.numFocus = true
    },
    inputValChange(val) {
      if (this.data.name && this.data.name === "详细地址") {
        this.$emit("TextValuechanged", this.data, val, this.row);
        this.$emit(
          "updateValue",
          JSON.stringify({
            addressBook: this.inputVal,
            pertainVal: this.pertainVal
          })
        ); // 触发input事件，并传入新的值
        // 更新编码
        // this.$emit('CodeValuechanged')
      } else {
        this.$emit("updateValue", val); // 触发input事件，并传入新的值
      }
      // if (this.data.valueType == "数值") {
      //   const tempval = numeral(val);
      //   let tempNumFormat;
      //   if (
      //     val !== undefined &&
      //     val !== "" &&
      //     tempval.value() !== null &&
      //     tempval.value() !== undefined &&
      //     !isNaN(tempval.value())  && !this.numFocus
      //   ) {
      //     if (
      //       typeof this.data.dec !== undefined &&
      //       this.data.dec !== "" &&
      //       this.data.dec > 0
      //     ) {
      //       tempNumFormat = tempval.format(`0,0.${"0".repeat(this.data.dec)}`);
      //     } else if (this.data.dec === 0) {
      //       tempNumFormat = tempval.format(`0,0`);
      //     } else {
      //       tempNumFormat = tempval.format(`0,0.00`);
      //     }
      //     this.numFormat = tempNumFormat;
      //   }
      //   this.$emit("NumValuechanged", this.data, val, this.row);
      // }
      // if (this.data.valueType == "文本" || this.data.valueType == "业务参数") {
      //   this.$emit("TextValuechanged", this.data, val ? val : "", this.row);
      // }
    },
  },
  computed: {
    displayVal: {
      get: function() {
        const tempval = numeral(this.inputVal);
        if (
          this.data.valueType == "数值" &&
          this.inputVal !== undefined &&
          this.inputVal !== "" &&
          tempval.value() !== null &&
          tempval.value() !== undefined &&
          !isNaN(tempval.value())
        ) {
          // if(typeof(this.data.dec)!==undefined && this.data.dec!=='' && this.data.dec>0){
          //   return tempval.format(`0,0.${'0'.repeat(this.data.dec)}`)
          // }
          // else if(this.data.dec===0){
          //   return tempval.format(`0,0`)
          // }
          // else{
          //   return tempval.format(`0,0.00`)
          // }
        } else if (this.data.valueType == "日期") {
          return this.$moment(this.inputVal).format("YYYY-MM-DD");
        } else if (this.data.name && this.data.name === "详细地址") {
          let address = "";
          this.inputVal.forEach(item => {
            address =
              address === ""
                ? `${CodeToText[item]}`
                : `${address}-${CodeToText[item]}`;
          });
          address = `${address}-${this.pertainVal}`;
          return address;
        } else if (
          this.data.valueType == "业务对象" &&
          this.data.name == "项目负责人"
        ) {
          if (!this.inputVal && !this.textVal) {
            return null;
          } else {
            return { value: this.inputVal, text: this.textVal };
          }
        } else {
          return this.inputVal;
        }
      },
      set: function(val) {
        const tempval = numeral(val);
        if (
          this.data.valueType == "数值" &&
          val !== undefined &&
          val !== "" &&
          tempval.value() !== null &&
          tempval.value() != undefined &&
          !isNaN(tempval.value())
        ) {
          // this.inputVal = tempval.value()
        } else if (
          this.data.valueType == "业务对象" &&
          this.data.name == "项目负责人"
        ) {
          this.inputVal = val.value;
          this.inputValChange(val.value);
        } else {
          this.inputVal = val;
          this.inputValChange(val);
        }
      }
    },
    selectOption() {
      if (this.data.valueType == "业务对象" && this.data.name == "产品类型") {
        return this.setData;
      } else if (
        this.data.valueType == "业务对象" &&
        this.data.name == "项目负责人"
      ) {
        return [{ value: this.inputVal, text: this.textVal }];
      }
    },
    enumItem() {
      const arrItem = this.data.dataItems.replace(/，/g, ",").split(",");
      let result = [];
      if (arrItem.length > 0) {
        result = arrItem.map(item => {
          return { value: item, text: item };
        });
      }
      return result;
    }
  }
};
</script>
<style lang="scss">
.formreadonly {
  .el-input.is-disabled .el-input__inner{
    color:rgba(94, 91, 91, 0.65) !important;
  }
}
.renderinput{
  .el-input__inner, .vue-treeselect__control{
    border-color: #f56c6c;
  }
}
</style>


<style rel="stylesheet/scss" lang="scss" scoped>
.formitemdiv {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.formitem {
  margin: 10px;
  width: 40%;
}
.cell-edit-input .el-input,
.el-input__inner {
  width: 100%;
}
.cell-icon {
  cursor: pointer;
  color: #fff;
}
.input-unit {
  border: none;
  padding: 0;
  height: 26px;
  width: auto;
  line-height: 28px;
}
.error_span {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  left: 0;
}
.inputerror {
  border-color: #f56c6c;
}
.formlabel {
  line-height: 30px;
}

</style>


