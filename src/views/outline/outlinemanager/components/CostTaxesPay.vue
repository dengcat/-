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
      <span style="margin-left:10px;">成本税金支付</span>
      <!-- <span style="float:right;height:21px;padding:0px">支付年限:
        <el-select
          size="mini"
          style="width:150px;height:21px"
          v-model="year"
          placeholder="请选择"
          @change="handleChange"
        >
          <el-option
            :label="2"
            :value="2"
          ></el-option>
          <el-option
            :label="3"
            :value="3"
          ></el-option>
          <el-option
            :label="4"
            :value="4"
          ></el-option>
          <el-option
            :label="5"
            :value="5"
          ></el-option>
          <el-option
            :label="6"
            :value="6"
          ></el-option>

        </el-select>
        填写维度:
        <el-select
          style="width:150px;height:21px"
          size="mini"
          v-model="wd"
          placeholder="请选择"
          @change="handleChange"
        >
          <el-option
            label="年度"
            value="年度"
          ></el-option>
          <el-option
            label="季度"
            value="季度"
          ></el-option>
          <el-option
            label="月度"
            value="月度"
          ></el-option>
        </el-select>
        <el-checkbox v-model="showRate">显示支付比例</el-checkbox>
      </span> -->
      <ag-grid-vue
      style="width: 100%; height: 500px;"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :rowData="showData"
      :getNodeChildDetails="getNodeChildDetails"
      :animateRows ="true"

     >
      </ag-grid-vue>
    </div>

    <!-- 编辑填写页面 -->
    <el-dialog
      :close-on-click-modal="false"
      top="50px"
      v-if="editRowInfo"
      :title="`${editRowInfo.costName}`"
      :visible="dialogVisible"
      :before-close="handleClose"
      width="1000px"
    >
      <div class="formitemdiv">
        <form-item
          label="科目"
          v-model="editRowInfo.costName"
          :disabled="true"
        ></form-item>
        <form-item
          label="科目编号"
          v-model="editRowInfo.costCode"
          :disabled="true"
        ></form-item>
        <form-item
          label="目标成本"
          v-model="editRowInfo.targetCost"
          type="number"
          :disabled="true"
        ></form-item>
        <form-item
          label="合计比例"
          v-model="editRowInfo.sumRate"
          type="number"
          :disabled="true"
        ></form-item>
        <form-item
          label="进项税率（%）"
          :value="editRowInfo.taxRate"
          @input="val=> handleChangeRate(val.id)"
          type="select"
          :options="rate"
        ></form-item>
        <form-item
          label="进项税"
          v-model="editRowInfo.taxation"
          :disabled="true"
          type="number"
        ></form-item>
        <form-item
          label="合计金额(万元)"
          v-model="editRowInfo.totalSum"
          type="number"
          :disabled="true"
        ></form-item>
      </div>
      <el-table
        :data="editRowInfo.datas"
        height="400"
        stripe
        style="width: 100%; margin-top:10px"
      >
        <el-table-column
          label="年份"
          prop="year"
          width="180"
        >
        </el-table-column>
        <el-table-column
          :label="`季度/月度`"
          prop="quarterOrMonth"
          width="180"
        >
        </el-table-column>
        <el-table-column label="支付比例">
          <template slot-scope="scope">
            <edit-grid-item
              :value="scope.row.payRate"
              type='number'
              @input="val => scope.row.payRate = val"
              :isEdit="false"
            ></edit-grid-item>
          </template>

        </el-table-column>
        <el-table-column label="支付税额">
          <template slot-scope="scope">
            <edit-grid-item
              :value="scope.row.payTaxes"
              type='number'
              @input="val => scope.row.payTaxes = val"
              :isEdit="false"
            ></edit-grid-item>
          </template>

        </el-table-column>
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleSave()"
        >确定</el-button>
        <el-button
          type="primary"
          @click="handleSave('next')"
        >确定并填写下一条</el-button>
      </span>
    </el-dialog>
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
import { VclTable } from 'vue-content-loading';
import numeral from "numeral";
import { myNumeral } from './util';
import { AgGridVue } from "ag-grid-vue";
import "ag-grid-enterprise";




const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

export default {
  name: "CostTaxesPay",
  components: { EditGridItem, FormItem, VclTable,AgGridVue},
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
      pageLoading: true,

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
  created() {
    this.pageLoading = false;
    this.year = this.setting.years;
    this.wd = this.setting.dimension;
    console.log(this.columnDefs)

  },
  computed: {
     columnDefs(){
      const subtotalChildren=[{headerName:`${currentYear}年前`}]
      for(let i=1;i<=this.year;i++){
      subtotalChildren.push({headerName:`${currentYear+i-1}年`})
      }

       const columnDefs=[
       {headerName: '科目', field:'costName',cellRenderer: "agGroupCellRenderer",pinned:'left'},
       {headerName: '科目编号', field:'costCode',pinned:'left'},
       {headerName: '目标成本', field:'targetCost'},
       {headerName: '合计比例', field:'sumRate'},
       {headerName: '进项税率(%)', field:'taxRate'},
       {headerName: '进项税万元', field:'taxation'},
       {headerName: '合计金额(万元)', field:'totalSum'},
       {headerName: '小计支付税额',children:subtotalChildren,
        },
        {headerName:`${currentYear}年后`}
      ]

    return  columnDefs

     },
   showData() {
      const data = this.mpiCostPayPlanInfo;
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
    currentYear: function(){
      if(this.mpiVersionInfo.year){
        return this.mpiVersionInfo.year
      }
      else{
        return currentYear
      }
    },
    ...mapState({
      mpiVersionInfo: state => state.outline_info.mpiVersionInfo,
      outline_stepInfo: state => state.outline_stepInfo,
      mpiCostPayPlanInfo: state => state.outline_info.mpiCostPayPlanInfo,
      mpiTableSettingInfo: state => state.outline_info.mpiTableSettingInfo,
      rate: state => state.outline_info.rate,
    }),
    setting() {
      const setting = this.mpiTableSettingInfo.find(item => {
        return item.typeName === "成本支付计划";
      });
      return setting;
    },
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
     getNodeChildDetails(rowItem) {
      if (rowItem.children) {
        return {
          group: true,
          expanded: true,
          children: rowItem.children,
          key: rowItem.id
        };
      } else {
        return null;
      }
    },
    handleClose(){
      this.editRowInfo = undefined
      this.currEditRow = undefined
      this.dialogVisible = false
    },
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
        dynamicsObj[key_ghmj] = datasItem.payTaxes;
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
        this.$set(item, "payTaxes", this.editRowInfo.datas[$index].payTaxes);
        this.$set(item, "taxRate", this.editRowInfo.taxRate);
        this.$set(item, "taxation", this.editRowInfo.taxation);

      });
      // this.currEditRow.totalSum = this.editRowInfo.totalSum
      this.currEditRow.taxRate = this.editRowInfo.taxRate
      this.currEditRow.taxation = this.editRowInfo.taxation
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
      //   payTotal: 0,
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
        return element.costCode === row.parentCode
      })
      // 更新父级的合计
      parentNode.datas.forEach(parentItem=>{
        let payTaxes = 0;
        parentNode.children.forEach(item => {
          item.datas.forEach(datasItem => {
            if (
              datasItem.year === parentItem.year &&
              datasItem.quarterOrMonth === parentItem.quarterOrMonth
            ) {
              if (datasItem["payTaxes"]) {
                payTaxes = payTaxes + datasItem["payTaxes"];
              }
            }
          });
        });
        this.$set(parentItem, "payTaxes", payTaxes);
      })

      this.calcTotal(parentNode)

      // 递归更新
      this.updateParentNodes(parentNode)

    },
    handleChangeRate(val){
      this.editRowInfo.taxRate = val
      if(val || val === 0){
        if(this.editRowInfo.targetCost){
          this.editRowInfo.taxation = numeral(this.editRowInfo.targetCost).divide(numeral(val).divide(100).add(1).value()).multiply(val).divide(100).value()
        }
        this.editRowInfo.datas.forEach(item=>{
          if(item.payTotal){
            item.payTaxes = numeral(item.payTotal).divide(numeral(val).divide(100).add(1).value()).multiply(val).divide(100).value()
          }
        })
      }

      this.calcTotal(this.editRowInfo)

    },
    calcTotal(row){
      let taxation = 0
      row.datas.forEach(item=>{
        if(item.year.indexOf('小计')>=0 && item.payTaxes){
          taxation = myNumeral(item.payTaxes).add(taxation).value()
        }
      })
      row.taxation = taxation
      row.datas.forEach(item=>{
        item.taxation = taxation
      })
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
  width: calc(50% - 50px);
}

.formitem_div {
  line-height: 28px;
  flex: 0 0 120px;
  font-size: small;
}
.formitemoneline {
  align-items: flex-start;
  margin: 2px 20px;
  width: calc(100% - 50px);
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
  border-radius: 0px !important;
  overflow: unset;
}
.date_width {
  width: 245px;
}
</style>
