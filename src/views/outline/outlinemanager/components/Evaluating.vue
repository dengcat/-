<template>
  <el-card class="editCard">
    <div
      slot="header"
      class="clearfix"
    >
      <i
        class="el-icon-news"
        style="color:RGB(255,204,102)"
      ></i>
      <span style="margin-left:10px;">评价指标</span>
    </div>
    <template>
      <div v-if="mpiEvaluatingInfo" class="formitemdiv eva">
        <form-item label="内部收益率（IRR）" type="number" v-model="mpiEvaluatingInfo.nbsyl"></form-item>
        <form-item label="项目累计经营性现金流转正时间" type="DatePicker" v-model="mpiEvaluatingInfo.xmljsj"></form-item>
        <form-item label="项目累计经营性（含融资）现金流转正时间" type="DatePicker" v-model="mpiEvaluatingInfo.xmljrzsj"></form-item>
        <form-item label="资金峰值" type="number" v-model="mpiEvaluatingInfo.zjfz"></form-item>
      </div>
    </template>
  </el-card>

</template>

<script>
import { mapState } from "vuex";
import mixin_commom from "@/utils/mixin_commom";
import EditGridItem from "./EditGridItem";
import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import accounting from 'accounting'
import FormItem from "./FormItem";
import { treeToArrayNoParent } from "@/utils";


export default {
  name: "Evaluating",
  components: { EditGridItem, FormItem },
  mixins: [mixin_commom],
  data() {
    return {
      year: 4,
      wd: "季度",
      data: [],
      showRate: false,
      currEditRow: undefined, // 当前选中编辑行
      dialogVisible: false,
      editRowInfo: undefined,
    };
  },
  filters: {
    dateFormat(val, type) {
      if (!type) {
        type = "YYYY-MM-DD";
      }
      if (val) {
        return moment(val).format(type);
      } else {
        return "";
      }
    },
    numberFormat(val) {
      if (val !== undefined && val !== null) {
        return accounting.formatNumber(val, 2);
      } else {
        return val;
      }
    }
  },
  computed: {
    showData() {
      const data = this.mpiEvaluatingInfo;
      if (data) {
        const showData = data.map(item => {
          this.updateRowNode(item);
          return item;
        });
        return showData;
      } else {
        return [];
      }
    },
    arrData() {
      return treeToArrayNoParent(this.showData)
    },
    tableHeight: function() {
      return this.clientHeight - 340;
    },
    ...mapState({
      outline_stepInfo: state => state.outline_stepInfo,
      mpiEvaluatingInfo: state => state.outline_info.mpiEvaluatingInfo
    }),
    wdArr() {
      if (this.wd === "年度") {
        return [];
      } else if (this.wd === "季度") {
        return ["一季度", "二季度", "三季度", "四季度"];
      } else {
        return [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月"
        ];
      }
    }
  },
  methods: {
    handleEdit(row) {
      this.currEditRow = row;
      this.editRowInfo = cloneDeep(row);
      this.dialogVisible = true;

    },
    handleChange() {
      // const dynamicsData = {}
      // this.$set(dynamicsData)
      // this.data = Object.assign({},this.data,)
    },
    // 递归增加子级节点
    updateRowNode(row) {
      const dynamicsObj = {};
      row.datas.forEach(datasItem => {
        const key_ghmj = datasItem.quarterOrMonth
          ? `${datasItem.year}_${datasItem.quarterOrMonth}`
          : `${datasItem.year}`;
        dynamicsObj[key_ghmj] = datasItem.price;
      });
      row = Object.assign(row, dynamicsObj);
      if (row.children && Array.isArray(row.children)) {
        row.children.forEach(childrenitem => {
          this.updateRowNode(childrenitem);
        });
      }
    },
    handleSave(type) {
      this.currEditRow.datas.forEach((item, $index) => {
        this.$set(item, "price", this.editRowInfo.datas[$index].price);
      });
      // 更新父级
      // 父节点
      const currIndex = this.arrData.findIndex(item => {
          return item.id === this.currEditRow.id;
        });
      this.updateParentNodes(this.arrData[currIndex])
      
      // 保存后清空或者继续下一条
      if (type === "next") {
        if (currIndex + 1 < this.arrData.length) {
          const nextRow = this.arrData.find((item,index)=>{
            return index > currIndex && (!item.children || item.children.length<= 0)
          });
          this.currEditRow = nextRow;
          this.editRowInfo = cloneDeep(nextRow);
        } else {
          // 全部填写完成
        }
      } else {
        this.currEditRow = undefined;
        this.editRowInfo = undefined;
        this.dialogVisible = false;
      }
    },
    // 更新父级的合计
    updateParentNodes(row){
      // 是否有父级
      if(!row.parentCode || row.parentCode===''){
        return
      }
      // 更新当前行的父级
      // const sumObj = {
      //   payRate: 0,
      //   price: 0,
      // }
      // this.arrData.forEach(element=>{
      //   if(element.parentCode === row.parentCode){
      //     Object.keys(sumObj).forEach(item=>{
      //       if(element[item]){
      //         sumObj[item] = sumObj[item] + element[item]
      //       }
      //     })
      //   }
      // })

      let parentNode = this.arrData.find(element=>{
        return element.priceCode === row.parentCode
      })
      // 更新父级的合计
      parentNode.datas.forEach(parentItem=>{
        let price = 0;
        parentNode.children.forEach(item => {
          item.datas.forEach(datasItem => {
            if (
              datasItem.year === parentItem.year &&
              datasItem.quarterOrMonth === parentItem.quarterOrMonth
            ) {
              if (datasItem["price"]) {
                price = price + datasItem["price"];
              }
            }
          });
        });
        this.$set(parentItem, "price", price);
      })

      // 递归更新
      this.updateParentNodes(parentNode)
      
    }
  }
};
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
  width: calc(50% - 40px);
}

.formitem_div {
  line-height: 28px;
  flex: 0 0 240px;
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
.date_width {
  width: 245px;
}
</style>

<style lang="scss">
.eva{
  .formitem_div{
    line-height: 28px;
    flex: 0 0 280px;
    font-size: small;
  }
}
</style>