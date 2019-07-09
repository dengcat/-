<template>
  <el-card class="editCard" v-loading="pageLoading">
    <div
      slot="header"
      class="clearfix"
    >
      <i
        class="el-icon-news"
        style="color:RGB(255,204,102)"
      ></i>
      <span style="margin-left:10px;">税金计算表</span>
      <span style="height:21px;padding:0px;margin-left:10px"><AutoCalc v-if="tableManual" type="税金计算表" @reCalc="calcShareholderTradingModelInfo()" :value="tableManual.isManual"></AutoCalc></span>
      <span style="float:right;height:21px;padding:0px">支付年限:
        <el-select
          size="mini"
          style="width:150px;height:21px"
          v-model="year"
          placeholder="请选择"
          @change="settingChange()"
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
          @change="settingChange()"
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
      </span>
    </div>
    <template>
      <el-table
        :height="tableHeight"
        :data="showData"
        border
        fit
        style="width: 100%"
        :isTree="true"
        row-key="id"
        :isTreeExpandAll="true"
        :highlight-current-row="false"
        :row-class-name="rowclass"
        :key="`${year}_${wd}`"
      >
        <el-table-column
          file-icon="icon icon-file"
          folder-icon="icon icon-folder"
          prop="costCode"
          label="序号"
          width="60"
          :show-overflow-tooltip="true"
          fixed
          type="other"
        >
        </el-table-column>
        <el-table-column
          file-icon="icon icon-file"
          folder-icon="icon icon-folder"
          prop="costName"
          label="科目"
          width="220"
          treeKey="costName"
          :expandAll="true"
          :show-overflow-tooltip="true"
          fixed
        >
        <template slot-scope="scope">
          {{scope.row.costName}}
        </template>
        </el-table-column>
        <el-table-column
          prop="rate"
          label="税率说明"
          width="80"
          fixed
          header-align="center"
          align="right"
        >
        <template slot-scope="scope">
          {{scope.row.rate | numberFormat}}
        </template>
        </el-table-column>
        <el-table-column
          label="合计"
          width="100"
          header-align="center"
          align="right"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{scope.row.sumTaxes | numberFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="小计"
          header-align="center"
          align="right"
          :show-overflow-tooltip="true"
        >
          <el-table-column
            :label="`${currentYear}年前`"
            header-align="center"
            align="right"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{scope.row[`小计${currentYear}年前`] | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column
            v-for="yearindex in year"
            :key="`小计${currentYear+yearindex-1}年`"
            :label="`${currentYear+yearindex-1}年`"
            header-align="center"
            align="right"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{scope.row[`小计${currentYear+yearindex-1}年`] | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="right"
            :show-overflow-tooltip="true"
            :label="`${currentYear+year-1}年后`"
          >
            <template slot-scope="scope">
              {{scope.row[`小计${currentYear+year-1}年后`] | numberFormat}}
            </template>
          </el-table-column>
        </el-table-column>

        <!-- 年份详细 -->
        <el-table-column
          :label="`${currentYear}年前`"
          header-align="center"
          align="right"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{scope.row[`${currentYear}年前`] | numberFormat}}
          </template>
        </el-table-column>
        <el-table-column
          v-for="yearindex in year"
          :key="`${currentYear+yearindex-1}年_详细`"
          :label="`${currentYear+yearindex-1}年`"
          header-align="center"
          align="right"
          :show-overflow-tooltip="true"
        >
          <el-table-column
            v-for="wditem in wdArr"
            :key="`${currentYear+yearindex-1}年_${wditem}`"
            :label="wditem"
            header-align="center"
            align="right"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
                {{scope.row[`${currentYear+yearindex-1}年_${wditem}`] | numberFormat}}
              </template>
          </el-table-column>
          <template v-if="wd==='年度'" slot-scope="scope">
                {{scope.row[`${currentYear+yearindex-1}年`] | numberFormat}}
              </template>
        </el-table-column>
        <el-table-column
          :label="`${currentYear+year-1}年后`"
          header-align="center"
          align="right"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
              {{scope.row[`${currentYear+year-1}年后`] | numberFormat}}
            </template>
        </el-table-column>

        <el-table-column
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <template v-if="editrows.indexOf(scope.$index)>=0" >
            <!-- <template> -->
              <svg-icon icon-class="edit1" style="color:#66b1ff" /><el-button
              @click="handleEdit(scope.row, 'edit')"
              type="text"
            >填写</el-button>
            </template>
            <template v-else>
            <el-button
              @click="handleEdit(scope.row, 'read')"
              type="text"
            >查看</el-button>
          </template>
          </template>
          
        </el-table-column>
      </el-table>
    </template>
    <!-- 编辑填写页面 -->
    <el-dialog
      :close-on-click-modal="false"
      top="50px"
      v-if="editRowInfo"
      :title="`${editRowInfo.costName}`"
      :visible="dialogVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <div class="formitemdiv">
        <form-item
          label="科目"
          v-model="editRowInfo.costName"
          :disabled="true"
        ></form-item>
        <form-item
          label="税率（%）"
          :value="editRowInfo.rate"
          @input="val=> handleChangeRate(val.id)"
          type="select"
          :options="rate"
        ></form-item>
        <form-item
          label="合计"
          v-model="editRowInfo.sumTaxes"
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
        <el-table-column label="税金" align="right">
          <template slot-scope="scope">
            <edit-grid-item
              :value="scope.row.taxes"
              type='number'
              @input="val => handleTaxes(val, scope.row)"
              :isEdit="((currEditRow.children && currEditRow.children.length > 0) || scope.row.year.indexOf('小计') >= 0) ? false : true"
            ></edit-grid-item>
          </template>

        </el-table-column>
              <!-- :isEdit="((currEditRow.children && currEditRow.children.length > 0) || scope.row.year.indexOf('小计') >= 0) ? false : true" -->

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
import { mapState, mapActions } from "vuex";
import mixin_commom from "@/utils/mixin_commom";
import EditGridItem from "./EditGridItem";
import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import accounting from 'accounting'
import FormItem from "./FormItem";
import { treeToArrayNoParent } from "@/utils";
import mixin_calc from './mixin_calc'
import AutoCalc from './AutoCalc'




const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

export default {
  name: "TaxesCalc",
  components: { EditGridItem, FormItem, AutoCalc },
  mixins: [mixin_commom, mixin_calc],
  data() {
    return {
      year: 4,
      wd: "季度",
      data: [],
      showRate: false,
      currEditRow: undefined, // 当前选中编辑行
      dialogVisible: false,
      editRowInfo: undefined,
      // editrows : [3,7,8,9,11,12,13,14,17,18,19,21,22,23,24,25,26,27,28,31,32,34,36,37,39,41,45],
      editrows : [3,7,8,9,11,12,13,14,17,18,19,21,22,23,24,25,26,27,28,31,32,34,36,37,39,41,45],

      editType:'read',
      pageLoading: true
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
      const data = this.mpiTaxesCalcInfo;
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
    tableManual() {
      const setting = this.mpiTableManualInfo.find(item => {
        return item.typeName === '税金计算表';
      });
      return setting;
    },
    ...mapState({
      mpiVersionInfo: state => state.outline_info.mpiVersionInfo,
      outline_stepInfo: state => state.outline_stepInfo,
      mpiTaxesCalcInfo: state => state.outline_info.mpiTaxesCalcInfo,
      mpiTableSettingInfo: state => state.outline_info.mpiTableSettingInfo,
      rate: state => state.outline_info.rate,
      mpiTableManualInfo: state => state.outline_info.mpiTableManualInfo,
    }),
    setting() {
      const setting = this.mpiTableSettingInfo.find(item => {
        return item.typeName === "税金计算表";
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
  created() {
    this.pageLoading = false;
    this.year = this.setting.years;
    this.wd = this.setting.dimension;      
  },   
  methods: {
    ...mapActions(['SetOutlineInfo',"ChangeYearDimension"]),
    handleClose(){
      this.editRowInfo = undefined
      this.currEditRow = undefined
      this.dialogVisible = false
    },     
    handleEdit(row, type) {
      this.currEditRow = row;
      this.editRowInfo = cloneDeep(row);
      this.dialogVisible = true;
      this.editType = type
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
        dynamicsObj[key_ghmj] = datasItem.taxes;
      });
      row = Object.assign(row, dynamicsObj);
      if (row.children && Array.isArray(row.children)) {
        row.children.forEach(childrenitem => {
          this.updateRowNode(childrenitem);
        });
      }
    },
    handleSave(type) {
      this.currEditRow.rate = this.editRowInfo.rate
      this.currEditRow.sumTaxes = this.editRowInfo.sumTaxes
      this.currEditRow.datas.forEach((item, $index) => {
        this.$set(item, "taxes", this.editRowInfo.datas[$index].taxes);
        this.$set(item, "sumTaxes", this.editRowInfo.sumTaxes);
        this.$set(item, "rate", this.editRowInfo.rate);
      });
      // 更新父级
      // 父节点
      const currIndex = this.arrData.findIndex(item => {
          return item.id === this.currEditRow.id;
        });
      // this.updateParentNodes(this.arrData[currIndex])
      const mpiTaxesCalcInfo = this.calcTax()
      this.SetOutlineInfo({mpiTaxesCalcInfo})
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
      //   taxes: 0,
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
        let taxes = 0;
        parentNode.children.forEach(item => {
          item.datas.forEach(datasItem => {
            if (
              datasItem.year === parentItem.year &&
              datasItem.quarterOrMonth === parentItem.quarterOrMonth
            ) {
              if (datasItem["taxes"]) {
                taxes = taxes + datasItem["taxes"];
              }
            }
          });
        });
        this.$set(parentItem, "taxes", taxes);
      })
      // 递归更新
      this.updateParentNodes(parentNode)
      
    },
    handleTaxes(value,row){
      row.taxes = value
      
      this.calcTotal(this.editRowInfo)
    },
    // 计算小计
    calcTotal(row){
      const xj = row.datas.filter(item=>{
        return item.year.indexOf('小计')>=0
      })
      xj.forEach(item=>{
        item.taxes = 0
      })
      row.datas.forEach(element=>{
        if(element.year.indexOf('小计')<0){
          const curxj = xj.find(xjitem=>{
            return xjitem.year.replace('小计','') === element.year
          })
          if(!curxj.taxes){
            curxj.taxes = element.taxes
          }
          else{
            curxj.taxes = curxj.taxes + element.taxes
          }
        }
      })

      let sumTaxes = 0
      xj.forEach(item=>{
        const taxesnum = Number(item.taxes)
        if(item.taxes && !isNaN(taxesnum)){
          sumTaxes = sumTaxes + taxesnum
        }
      })
      row.sumTaxes = sumTaxes
    },
    handleChangeRate(val){
      this.editRowInfo.rate = val
    },
    rowclass(row){
      if(this.editrows.indexOf(row.rowIndex)<0){
        return 'row_noedit'
      }
      else{
        // 暂时都可以编辑
        return ''
      }
    },
    settingChange() {
      const setting = this.setting;
      setting.years = this.year;
      setting.dimension = this.wd;
      
      this.pageLoading = true;
      this.ChangeYearDimension(setting).then(response => {
        this.pageLoading = false;
      });
    }
  },
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
