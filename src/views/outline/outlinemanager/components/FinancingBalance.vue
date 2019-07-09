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
      <span style="margin-left:10px;">融资余额表</span>
      <span style="margin-left:10px; float:right"><YearDimension label="融资年限" type="融资余额表" :setting="setting" @loadingShow="val => tableLoading = val"></YearDimension></span>
    </div>
    <template v-if="setting" >
      <el-table
        v-loading="tableLoading"
        :data="showData"
        border
        fit
        style="width: 100%"
        :isTree="true"
        row-key="id"
        :isTreeExpandAll="true"
        :highlight-current-row="false"
        stripe
        :key="`${year}_${wd}`"
      >
        <el-table-column
          file-icon="icon icon-file"
          folder-icon="icon icon-folder"
          prop="financingCategory1"
          label="融资类别"
          width="150"
          :show-overflow-tooltip="true"
          fixed
        >
        </el-table-column>
        <el-table-column
          prop="financingCategory2"
          label="小类"
          width="80"
          :tree="true"
          fixed
        ></el-table-column>
        <el-table-column
            label="合计"
            header-align="center"
            :show-overflow-tooltip="true"
            align="right"
          >
            <template slot-scope="scope">
              {{scope.row.totalBalance | numberFormat}}
            </template>
          </el-table-column>
        <el-table-column
          label="小计"
          header-align="center"
          :show-overflow-tooltip="true"
          align="right"
        >
          <el-table-column
            :label="`${currentYear}年前`"
            header-align="center"
            :show-overflow-tooltip="true"
            align="right"
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
            :show-overflow-tooltip="true"
            align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`小计${currentYear+yearindex-1}年`] | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            :show-overflow-tooltip="true"
            align="right"
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
          :show-overflow-tooltip="true"
          align="right"
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
          :show-overflow-tooltip="true"
          align="right"
        >
          <el-table-column
            v-for="wditem in wdArr"
            :key="`${currentYear+yearindex-1}年_${wditem}`"
            :label="wditem"
            header-align="center"
            :show-overflow-tooltip="true"
            align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`${currentYear+yearindex-1}年_${wditem}`] | numberFormat}}
            </template>
          </el-table-column>
          <template
            v-if="wd==='年度'"
            slot-scope="scope"
          >
            {{scope.row[`${currentYear+yearindex-1}年`] | numberFormat}}
          </template>
        </el-table-column>
        <el-table-column
          :label="`${currentYear+year-1}年后`"
          header-align="center"
          :show-overflow-tooltip="true"
          align="right"
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
      top="50px"
      v-if="editRowInfo"
      :title="`${editRowInfo.financingCategory1}-${editRowInfo.financingCategory2}`"
      :visible="dialogVisible"
      :before-close="handleClose"
      width="1000px"
    >
      <el-table
        :data="editRowInfo.datas"
        height="400"
        stripe
        style="width: 100%; margin-top:10px"
        :key="`dialog_${year}_${wd}`"
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
        <el-table-column label="融资" align="right">
          <template slot-scope="scope">
            <edit-grid-item
              :value="scope.row.balance"
              type='number'
              @input="val => handleCost(val, scope.row)"
              :isEdit="((currEditRow.children && currEditRow.children.length > 0) || scope.row.year.indexOf('小计') >= 0) ? false : true"              
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
import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import accounting from "accounting";
import FormItem from "./FormItem";
import { treeToArrayNoParent } from "@/utils";
import {myNumeral, calcTotal} from './util'
import YearDimension from './YearDimension'

const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

export default {
  name: "FinancingBalance",
  components: { EditGridItem, FormItem, YearDimension },
  mixins: [mixin_commom],
  data() {
    return {
      // year: 3,
      // wd: "季度",
      data: [],
      showRate: false,
      currEditRow: undefined, // 当前选中编辑行
      dialogVisible: false,
      editRowInfo: undefined,
      tableLoading: false,
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
  watch: {
    // mpiFinancingPlanInfo: {
    //   handler(newval, oldval) {
    //     let year;
    //     if (newval) {
    //       newval.forEach(item => {
    //         if (
    //           item.financingPeriod &&
    //           ((year && year < item.financingPeriod) || !year)
    //         ) {
    //           year = item.financingPeriod;
    //         }
    //       });
    //     }
    //     if (year) {
    //       this.year = Number(year);
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // year(val) {
    //   this.tableLoading = true;
    //   const setting = this.mpiTableSettingInfo.find(item => {
    //     return item.typeName === "融资余额表";
    //   });
    //   if(setting){
    //     setting.years = this.year;
    //     setting.dimension = this.wd;
    //     this.pageLoading = true;
    //     this.ChangeYearDimension(setting).then(response => {
    //       this.tableLoading = false;
    //     });
    //   }
      
    // }
    
  },
  computed: {
    showData() {
      const data = this.mpiFinancingBalanceInfo;
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
      return treeToArrayNoParent(this.showData);
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
      mpiFinancingBalanceInfo: state =>
        state.outline_info.mpiFinancingBalanceInfo,
      mpiFinancingPlanInfo: state => state.outline_info.mpiFinancingPlanInfo,
      mpiTableSettingInfo: state => state.outline_info.mpiTableSettingInfo,
    }),
    setting() {
      const setting = this.mpiTableSettingInfo.find(item => {
        return item.typeName === "融资余额表";
      });
      return setting;
    },
    year(){
      if(this.setting){
        return this.setting.years
      }else{
        return undefined
      }
    },
    wd(){
      if(this.setting){
        return this.setting.dimension
      }else{
        return undefined
      }
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
    ...mapActions([
      "ChangeYearDimension"
    ]),
    handleClose(){
      this.editRowInfo = undefined
      this.currEditRow = undefined
      this.dialogVisible = false
    },      
    handleCost(value,row){
      row.balance = value
      calcTotal(this.editRowInfo, 'balance', 'totalBalance')
    },
    // settingChange() {
    //   const setting = this.setting;
    //   setting.years = this.year;
    //   setting.dimension = this.wd;
      
    //   this.pageLoading = true;
    //   this.ChangeYearDimension(setting).then(response => {
    //     this.pageLoading = false;
    //   });
    // },
      // 计算小计
    // calcTotal(row){
    //   const xj = row.datas.filter(item=>{
    //     return item.year.indexOf('小计')>=0
    //   })
    //   xj.forEach(item=>{
    //     item.balance = 0
    //   })
    //   row.datas.forEach(element=>{
    //     if(element.year.indexOf('小计')<0){
    //       const curxj = xj.find(xjitem=>{
    //         return xjitem.year.replace('小计','')=== element.year
    //       })
    //       if(!curxj.balance){
    //         curxj.balance = element.balance
    //       }
    //       else{
    //         curxj.balance = curxj.balance + element.balance
    //       }
    //     }
    //   })
    //   let totalBalance = 0
    //   row.datas.forEach(item=>{
    //     if(item.balance){
    //       totalBalance = totalBalance + item.balance
    //     }
    //   })
    //   row.totalBalance = totalBalance
    // },
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
        dynamicsObj[key_ghmj] = datasItem.balance;
      });
      row = Object.assign(row, dynamicsObj);
      if (row.children && Array.isArray(row.children)) {
        row.children.forEach(childrenitem => {
          this.updateRowNode(childrenitem);
        });
      }
    },
    // 计算余额
    calcYe(){
      this.mpiFinancingBalanceInfo.forEach(item => {
        let tkTotal = 0
        let hkTotal = 0
        if(item.financingCategory2 === '余额'){
          const tkrow = this.mpiFinancingBalanceInfo.find(finditem => finditem.financingCategory1 === item.financingCategory1 && finditem.financingCategory2 === '提款')
          const hkrow = this.mpiFinancingBalanceInfo.find(finditem => finditem.financingCategory1 === item.financingCategory1 && finditem.financingCategory2 === '还款')
          item.datas.forEach((datasitem, index)=>{
            const tk = tkrow.datas[index].balance ? tkrow.datas[index].balance : 0
            const hk = hkrow.datas[index].balance ? hkrow.datas[index].balance : 0
            datasitem.balance = tk - hk
          })
          tkTotal = tkrow.totalBalance ? tkrow.totalBalance : 0
          hkTotal = hkrow.totalBalance ? hkrow.totalBalance : 0
          // 余额
          item.totalBalance = tkTotal - hkTotal
        }
      })
    },
    handleSave(type) {
      this.currEditRow.totalBalance = this.editRowInfo.totalBalance
      this.currEditRow.datas.forEach((item, $index) => {
        this.$set(
          item,
          "balance",
          this.editRowInfo.datas[$index].balance
        );
        this.$set(
          item,
          "totalBalance",
          this.editRowInfo.totalBalance
        );
      });
      this.calcYe()
      // 更新父级
      // 父节点
      // const currIndex = this.arrData.findIndex(item => {
      //   return item.id === this.currEditRow.id;
      // });
      // this.updateParentNodes(this.arrData[currIndex]);

      // 保存后清空或者继续下一条
      if (type === "next") {
        if (currIndex + 1 < this.arrData.length) {
          const nextRow = this.arrData.find((item, index) => {
            return (
              index > currIndex && (!item.children || item.children.length <= 0)
            );
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
    updateParentNodes(row) {
      // 是否有父级
      if (!row.parentCode || row.parentCode === "") {
        return;
      }
      // 更新当前行的父级
      // const sumObj = {
      //   payRate: 0,
      //   totalBalance: 0,
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

      let parentNode = this.arrData.find(element => {
        return element.costCode === row.parentCode;
      });
      // 更新父级的合计
      parentNode.datas.forEach(parentItem => {
        let totalBalance = 0;
        parentNode.children.forEach(item => {
          item.datas.forEach(datasItem => {
            if (
              datasItem.year === parentItem.year &&
              datasItem.quarterOrMonth === parentItem.quarterOrMonth
            ) {
              if (datasItem["totalBalance"]) {
                totalBalance = totalBalance + datasItem["totalBalance"];
              }
            }
          });
        });
        this.$set(parentItem, "totalBalance", totalBalance);
      });

      // 递归更新
      this.updateParentNodes(parentNode);
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
