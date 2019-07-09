<template>
  <div  style="width:100%">  
      <el-input
        :value="inputVal"
        v-on:input="handleInput"
      />
  </div>
</template>

<script>

export default {
  name: "ModelTest",
  filters: {},
  model: {
    prop: "value",
    event: "updateValue"
  },
  props: [
    "value"
  ],
  data() {
    return {
      inputVal:undefined
    }
  },
  created() {
    
  },
  beforeUpdate(){
    console.log('开始渲染', this.data.name)
  },
  watch: {
    // value(val) {
      
    // },
    // inputVal(val) {
    //   this.$emit("updateValue", val);
    // },
   
  },
  methods: {
    handleInput(val){
      console.log('val',val)
      this.ttt(val)
      
    },
    ttt(val){
      this.$emit('updateValue', val)
    },
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
      }
      else{
        this.inputVal = e;
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
    }
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
        } else {
          this.inputVal = val;
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


