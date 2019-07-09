<template>
  <el-card
    class="editCard"
    shadow="never"
    v-loading="pageLoading"
  >
    <div
      slot="header"
      class="clearfix"
    >
      <i
        class="el-icon-news"
        style="color:RGB(255,204,102)"
      ></i>
      <span style="margin-left:10px;">回款计划</span>
      <span style="float:right;height:21px;padding:0px">销售年限:
        <el-select
          size="mini"
          style="width:150px;height:21px"
          v-model="year"
          @change="settingChange()"
          placeholder="请选择"
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
          @change="settingChange()"
          placeholder="请选择"
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
        :key="`${year}_${wd}`"
        :data="showData"
        style="width: 100%"
        stripe
        :isTree="true"
        row-key="id"
        :isTreeExpandAll="true"
        :highlight-current-row="false"
        :show-summary="true"
        :summary-method="getSummaries"
      >
        <el-table-column
          file-icon="icon icon-file"
          folder-icon="icon icon-folder"
          prop="sectionName"
          label="标段"
          width="150"
          treeKey="sectionName"
          :expandAll="true"
          fixed
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="productType"
          label="产品类型"
          width="110"
          fixed
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="productName"
          label="产品名称"
          width="120"
          fixed
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          label="总可售面积/个数"
          width="120"
          :show-overflow-tooltip="true"
          header-align="center"           align="right" 
          prop="totalArea"
        >
        <template slot-scope="scope">
          {{scope.row.totalArea | numberFormat}}
        </template>
        </el-table-column>
        <el-table-column
          label="总可售金额"
          width="120"
          :show-overflow-tooltip="true"
          header-align="center"           align="right"
          prop="totalPrice"
        >
        <template slot-scope="scope">
          {{scope.row.totalPrice | numberFormat}}
        </template>
        </el-table-column>
        <el-table-column
          label="总可售均价"
          width="120"
          :show-overflow-tooltip="true"
          header-align="center"           align="right"
          prop="totalAvgPrice"
        >
        <template slot-scope="scope">
          {{scope.row.totalAvgPrice | numberFormat}}
        </template>
        </el-table-column>

        
        <!-- 供货金额 -->
        <el-table-column :label="`合同销售回款（万元）`" :key="`合同销售回款_${year}_${wd}`">
          <el-table-column
            :label="`${currentYear}年前已回款`"
            :width="120"
            header-align="center"           align="right"
            :show-overflow-tooltip="true"
            :prop="`contractPrice_${currentYear}年前`"
          >
            <template slot-scope="scope">
              {{scope.row[`contractPrice_${currentYear}年前`] | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column
            v-for="yearindex in year"
            :key="`contractPrice_${currentYear+yearindex-1}_${year}_${wd}`"
            :label="`${currentYear+yearindex-1}年`"
            :prop="`contractPrice_${currentYear+yearindex-1}年`"
            header-align="center"           align="right" 
            :width="120"
            :show-overflow-tooltip="true"
          >
            <template v-if="wdArr.length === 0" slot-scope="scope">
              {{scope.row[`contractPrice_${currentYear+yearindex-1}年`] | numberFormat}}
            </template>
            <el-table-column
              v-for="wditem in wdArr"
              :key="`contractPrice_${currentYear+yearindex-1}年_${wditem}_${year}_${wd}`"
              :label="wditem"
              :width="120"
              header-align="center"           align="right"
              :prop="`contractPrice_${currentYear+yearindex-1}年_${wditem}`"
              :show-overflow-tooltip="true"
            >
            <template slot-scope="scope">
              {{scope.row[`contractPrice_${currentYear+yearindex-1}年_${wditem}`] | numberFormat}}
            </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            :prop="`contractPrice_${currentYear+year-1}年后`"
            :label="`${currentYear+year-1}年后及以后`"
            :width="120"
            header-align="center"           align="right"
            :show-overflow-tooltip="true"
          >
           <template slot-scope="scope">
              {{scope.row[`contractPrice_${currentYear+year-1}年后`] | numberFormat}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row)"
              type="text"
            >填写</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 编辑填写页面 -->
    <el-dialog
      :close-on-click-modal="false"
      :key="`${editRowInfo.sectionName}-${editRowInfo.productType}-${editRowInfo.productName}`"
      top="50px"
      v-if="editRowInfo"
      :title="`${editRowInfo.productType ? `${editRowInfo.sectionName}-${editRowInfo.productType}-${editRowInfo.productName}` : `${editRowInfo.sectionName}`}`"
      :visible="dialogVisible"
      :before-close="handleClose"
      width="900px"
    >
      <div class="formitemdiv">
        <form-item
          label="标段"
          v-model="editRowInfo.sectionName"
          :disabled="true"
        ></form-item>
        <form-item
          label="产品类型"
          v-model="editRowInfo.productType"
          :disabled="true"
        ></form-item>
        <form-item
          label="产品名称"
          v-model="editRowInfo.productName"
          :disabled="true"
        ></form-item>
        <form-item
          label="总可售面积/个数"
          v-model="editRowInfo.totalArea"
          :disabled="true"
          type="number"
        ></form-item>
        <form-item
          label="总可售金额"
          v-model="editRowInfo.totalPrice"
          :disabled="true"
          type="number"
        ></form-item>
        <form-item
          label="总可售均价"
          v-model="editRowInfo.totalAvgPrice"
          :disabled="true"
          type="number"
        ></form-item>
      </div>
      <el-table
        :data="editRowInfo.datas"
        height="500"
        stripe
        style="width: 100%"
      >
        <el-table-column
          label="年份"
          prop="year"
          width="180"
        >
        </el-table-column>
        <el-table-column
          label="季度/月度"
          prop="quarterOrMonth"
          width="180"
        >
        </el-table-column>
        <el-table-column label="合同销售回款(万元)">
          <template slot-scope="scope">
            <edit-grid-item
              :value="scope.row.contractPrice"
              type='number'
              @input="val => scope.row.contractPrice = val"
              :isEdit="(currEditRow.children && currEditRow.children.length > 0) ? false : true"
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
import { mapState, mapActions } from "vuex";
import mixin_commom from "@/utils/mixin_commom";
import EditGridItem from "./EditGridItem";
import numeral from "numeral";
import FormItem from "./FormItem";
import { treeToArrayNoParent } from "@/utils";
import cloneDeep from "lodash/cloneDeep";
import { VclTable } from "vue-content-loading";
import moment from 'moment'

const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

export default {
  name: "ReturnedPlan",
  components: { EditGridItem, FormItem, VclTable },
  mixins: [mixin_commom],
  data() {
    return {
      price: undefined,
      year: 4,
      wd: "季度",
      data: [],
      width: 130,
      currEditRow: undefined, // 当前选中编辑行
      dialogVisible: false,
      editRowInfo: undefined,
      pageLoading: true      
      // showData:[]
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
    numberFormat(val){
      if(val!==undefined && val!==null){
        return accounting.formatNumber(val, 2);
      }else{
        return val
      }
    }
  },
  computed: {
    showData: function() {
      const data = this.mpiReturnPlanInfo;
      if (data) {
        const showData = data.map(item => {
          this.updateRowNode(item)
          return item
        });
        return showData;
      } else {
        return [];
      }
    },
    arrData: function() {
      return treeToArrayNoParent(this.mpiReturnPlanInfo);
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
      mpiReturnPlanInfo: state => state.outline_info.mpiReturnPlanInfo,
      mpiTableSettingInfo: state => state.outline_info.mpiTableSettingInfo
    }),
    setting() {
      const setting = this.mpiTableSettingInfo.find(item => {
        return item.typeName === "回款计划";
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
  watch: {
    year: function(val) {
      this.$forceUpdate();
    },
    wd: function(val) {
      this.$forceUpdate();
    },
  },
  created() {
    this.pageLoading = false;
    this.year = this.setting.years;
    this.wd = this.setting.dimension;      
  },
  methods: {
    ...mapActions([
      "outline_stepInfo_UpdateStepInfo",
      "SaveOutlineInfo",
      "SetOutlineInfo",
      "ChangeYearDimension"
    ]),
    handleClose(){
      this.editRowInfo = undefined
      this.currEditRow = undefined
      this.dialogVisible = false
    },    
    // 修改数值
    handleInput(val, row, type){
      row[type] = val
      // 计算可售面积个数，金额，合计
      this.calcTotal(this.editRowInfo)
    },
    // 计算可售面积个数，金额，合计
    calcTotal(row){
      let totalPrice = 0
      let totalArea = 0
      let totalAvgPrice = 0
      row.datas.forEach(item=>{
        const itemTotalPrice = numeral(item.contractPrice)
        const itemTotalArea = numeral(item.contractArea)
        const itemTotalAvgPrice = 0
        if(itemTotalPrice.value() !== null &&
            itemTotalPrice.value() !== undefined &&
            !isNaN(itemTotalPrice.value())){
          totalPrice = itemTotalPrice.add(totalPrice).value()
        }
        if(itemTotalArea.value() !== null &&
            itemTotalArea.value() !== undefined &&
            !isNaN(itemTotalArea.value())){
          totalArea = itemTotalArea.add(totalArea).value()
        }
        if(numeral.isNumeral(numeral(totalPrice)) && numeral.isNumeral(numeral(totalArea)) && totalArea!==0){
          totalAvgPrice = numeral(totalPrice).divide(totalArea).format('0,0.00')
        }
      })
      row.totalPrice = totalPrice
      row.totalArea = totalArea
      row.totalAvgPrice = totalAvgPrice
      row.datas.forEach(element=>{
        element.totalPrice = totalPrice
        element.totalArea = totalArea
        element.totalAvgPrice = totalAvgPrice
        element.cerSourceDate =row.cerSourceDate
      })
    },
    handleEdit(row) {
      this.currEditRow = row;
      this.editRowInfo = cloneDeep(row);
      this.dialogVisible = true;
    },
    handleChange(row, column, val, prop) {
      // 重算父级节点累加值,只有两级，简单处理不用递归
      let isCalc = false;
      for (let i = 0; i < this.data.length; i++) {
        const item = this.data[i];
        isCalc = false;
        let sum = 0;
        item.children.forEach(childrenItem => {
          const value = numeral(childrenItem[prop]);
          if (
            value.value() !== null &&
            value.value() !== undefined &&
            !isNaN(value.value())
          ) {
            sum = value.add(sum).value();
          }
          if (childrenItem.id === row.id) {
            isCalc = true;
          }
        });
        if (isCalc) {
          item[prop] = sum;
          break;
        }
      }
      // const dynamicsData = {}
      // this.$set(dynamicsData)

      // this.data = Object.assign({},this.data,)
    },
    validate() {
      this.$validator.validate().then(result => {
        if (result) {
        } else {
        }
      });
    },
    handleSave(type) {
      this.currEditRow.datas.forEach(
        (item,$index) => {
          this.$set(item,'contractPrice',this.editRowInfo.datas[$index].contractPrice)
          this.$set(item, "totalPrice", this.editRowInfo.totalPrice);
        }
      )
      // 更新父级
      // 父节点
      const parentNode = this.mpiReturnPlanInfo.find(item => {
        return item.children.some(childrenItem => {
          return childrenItem.id === this.editRowInfo.id;
        });
      });
      if (parentNode && parentNode.children) {
        // 所有子节点的合计
        parentNode.datas.forEach(parentItem => {
          let sumContractPrice = 0;
          parentNode.children.forEach(item => {
            item.datas.forEach(datasItem =>{
              if(datasItem.year === parentItem.year && datasItem.quarterOrMonth === parentItem.quarterOrMonth){
                if (datasItem['contractPrice']) {
                  sumContractPrice = sumContractPrice + datasItem['contractPrice'];
                }
              }
            })
          });
          this.$set(parentItem,'contractPrice',sumContractPrice)
        });
      }
      // 保存后清空或者继续下一条
      if (type === "next") {
        const currIndex = this.arrData.findIndex(item => {
          return item.id === this.currEditRow.id;
        });
        if (currIndex + 1 < this.arrData.length) {
          const nextRow = this.arrData[currIndex + 1];
          this.currEditRow = this.arrData[currIndex + 1];
          this.editRowInfo = cloneDeep(this.arrData[currIndex + 1]);
        } else {
          // 全部填写完成
        }
      } else {
        this.currEditRow = undefined;
        this.editRowInfo = undefined;
        this.dialogVisible = false;
      }
    },
    // 递归增加子级节点
    updateRowNode(row) {
      const dynamicsObj = {};
      row.datas.forEach(datasItem => {
        const key_contractPrice = datasItem.quarterOrMonth
          ? `contractPrice_${datasItem.year}_${datasItem.quarterOrMonth}`
          : `contractPrice_${datasItem.year}`;
        dynamicsObj[key_contractPrice] = datasItem.contractPrice;
      });
      row = Object.assign(row, dynamicsObj);
      if (row.children && Array.isArray(row.children)) {
        row.children.forEach(childrenitem => {
          this.updateRowNode(childrenitem);
        });
      }
    },
    getSummaries(param) {
      const notSumProp = ['sectionName','productType','productName','totalAvgPrice']
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        else if(notSumProp.indexOf(column.property)>=0){
          sums[index] = '';
          return;
        }else{
          const values = data.map(item => {
            if(!item.children || item.children.length === 0){
              return Number(item[column.property])
            }
            else{
              return 0
            }
          });
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] =sums[index];
          } else {
            sums[index] = null;
          }
        }
        
      });
      // 计算均价
      if(sums.length>0 && sums[4] && sums[3] && numeral.isNumeral(numeral(sums[4])) && numeral.isNumeral(numeral(sums[3])) && sums[3]!==0){
        sums[5] = numeral(sums[4]).multiply(10000).divide(sums[3]).value()
      }
      const result = sums.map(item =>{
        const value = Number(item);
        if(!isNaN(value) && numeral.isNumeral(numeral(value))){
          return this.$options.filters['numberFormat'](value)
        }
        else{
          return item
        }
      });
      return result
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
  width: calc(33.33% - 40px);
}

.formitem_div {
  line-height: 28px;
  flex: 0 0 120px;
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
  border-radius: 0px !important;
  overflow: unset;
}
.date_width {
  width: 245px;
}
</style>
<style lang="scss">
.editCard {
  margin-top: 10px;
  .el-card__header {
    padding: 10px 20px;
  }
}
.el-card {
  border-radius: 0px !important;
  overflow: unset;
}
</style>


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
  flex: 0 0 160px;
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
.developmentplan {
  .formitem_div {
    line-height: 28px;
    flex: 0 0 160px;
    font-size: small;
  }
}
.editCard {
  margin-top: 10px;
  .el-card__header {
    padding: 10px 20px;
  }
}
.el-card {
  border-radius: 0px !important;
  overflow: unset;
}
</style>
