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
      <span style="margin-left:10px;">资金峰值</span>
    </div>
    <ul class="tjList">
      <li><span>融资第一笔收入时间:</span><span style="color:#40a9ff">{{firstFinDate | dateFormat}}</span></li>
    </ul>
    <template>
      <el-table
        :data="showData"
        border
        fit
        style="width: 100%"
        row-key="id"
        :highlight-current-row="false"
        :key="`${year}_${wd}`"
        :row-class-name="rowclass"
      >
        <el-table-column
          file-icon="icon icon-file"
          folder-icon="icon icon-folder"
          prop="costName"
          label="费用名称"
          width="220"
          :show-overflow-tooltip="true"
          fixed
        >
        </el-table-column>
        <el-table-column
          prop="sumTaxes"
          label="金额(万元)"
          width="120"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        ></el-table-column>

        <!-- 年份详细 -->
        <el-table-column
          :label="`${currentYear}年前`"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
          <template slot-scope="scope">
            {{scope.row[`${currentYear}年前`] | numberFormat}}
          </template>
        </el-table-column>
        <el-table-column
          v-for="yearindex in year"
          :key="`${currentYear+yearindex-1}年_详细`"
          :label="`${currentYear+yearindex-1}年`"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
          <el-table-column
            v-for="wditem in wdArr"
            :key="`${currentYear+yearindex-1}年_${wditem}`"
            :label="wditem"
            header-align="center"    :show-overflow-tooltip="true"       align="right"
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
          header-align="center"    :show-overflow-tooltip="true"       align="right"
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
            <template v-if="readrow.indexOf(scope.$index)<0" >
              <svg-icon icon-class="edit1" style="color:#66b1ff" /><el-button
              @click="handleEdit(scope.row)"
              type="text"
            >填写</el-button>
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
        <el-table-column label="现金流">
          <template slot-scope="scope">
            <edit-grid-item
              :value="scope.row.price"
              type='number'
              @input="val => scope.row.price = val"
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
import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import accounting from 'accounting'
import FormItem from "./FormItem";
import { treeToArrayNoParent } from "@/utils";
import mixin_calc from './mixin_calc'


const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

export default {
  name: "CapitalPeak",
  components: { EditGridItem, FormItem },
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
      readrow:[11,12,13]
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
      const data = this.mpiCapitalPeakInfo;
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
      mpiCapitalPeakInfo: state => state.outline_info.mpiCapitalPeakInfo,
      mpiDevPlanInfo: state => state.outline_info.mpiDevPlanInfo,
      mpiTableSettingInfo: state => state.outline_info.mpiTableSettingInfo
    }),
    firstFinDate:function(){
      let firstFinDate
      this.mpiDevPlanInfo.forEach(item=>{
        if(!firstFinDate|| (item.firstFinDate && item.firstFinDate < firstFinDate)){
          firstFinDate = item.firstFinDate
        }
      })
      return firstFinDate
    },
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
  created() {
    this.year = this.setting.years;
    this.wd = this.setting.dimension;      
  },    
  methods: {
    ...mapActions(['SetOutlineInfo']),
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
      
      const mpiCashFlowCalcInfo = this.calcXmxjl()
      const mpiCapitalPeakInfo = this.calcZjfz()
      this.SetOutlineInfo({mpiCashFlowCalcInfo, mpiCapitalPeakInfo})


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
      
    },
    rowclass(row){
      if(this.readrow.indexOf(row.rowIndex)>=0){
        return 'row_noedit'
      }
      else{
        return ''
      }
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
<style lang="scss" scoped>
.tjList {
  list-style: none;
  margin: 0px;
  font-size: 12px;
}
.tjList li {
  height: 28px;
  padding: 5px;
  span {
    margin: 5px;
  }
}
</style>
