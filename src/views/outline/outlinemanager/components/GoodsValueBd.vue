<template>
  <el-card
    v-loading="pageLoading"
    class="editCard"
    shadow="never"
  >
    <div
      slot="header"
      class="clearfix"
    >
      <i
        class="el-icon-news"
        style="color:RGB(255,204,102)"
      ></i>
      <span style="margin-left:10px;">供货计划表-标段汇总表</span>
    </div>
    <template>
      <lazy-render
        :time="100"
        :immediately="true"
      >
        <vcl-table
          :speed="1"
          width="100%"
          height="100%"
          slot="tip"
          :rows="10"
          :columns="10"
        ></vcl-table>
        <el-table
          :height="tableHeight"
          :data="showData"
          style="width: 100%"
          stripe
          :isTree="true"
          row-key="id"
          :isTreeExpandAll="true"
          :highlight-current-row="false"
          :key="`${year}_${wd}`"
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
            prop="bldNameList"
            label="楼栋"
            width="90"
            fixed
            :show-overflow-tooltip="true"
          >
          </el-table-column>
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
            label="预售证时间"
            width="100"
            :show-overflow-tooltip="true"
            prop="cerSourceDate"
          >
            <template slot-scope="scope">
              {{scope.row.cerSourceDate | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column
            label="项目总可售合计"
            header-align="center"
            align="right"
            :show-overflow-tooltip="true"
          >
            <el-table-column
              label="面积/个数"
              :width="120"
              header-align="center"
              align="right"
              :show-overflow-tooltip="true"
              prop="totalArea"
              :isSum="true"
            >
              <template slot-scope="scope">
                {{scope.row.totalArea | numberFormat}}
              </template>
            </el-table-column>
            <el-table-column
              label="金额(万元)"
              :width="120"
              header-align="center"
              align="right"
              :show-overflow-tooltip="true"
              prop="totalPrice"
            >
              <template slot-scope="scope">
                {{scope.row.totalPrice | numberFormat}}
              </template>
            </el-table-column>
            <el-table-column
              label="均价(元)"
              :width="120"
              header-align="center"
              align="right"
              :show-overflow-tooltip="true"
              prop="totalAvgPrice"
            >
              <template slot-scope="scope">
                {{scope.row.totalAvgPrice | numberFormat}}
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 供货面积 -->
          <el-table-column
            :label="`供货面积(平米)`"
            :key="`供货面积_${year}_${wd}`"
          >
            <el-table-column
              header-align="center"
              align="right"
              :show-overflow-tooltip="true"
              :label="`${currentYear}年前已供货面积`"
              width="120"
              :prop="`ghmj_${currentYear}年前`"
            >
              <template slot-scope="scope">
                {{scope.row[`ghmj_${currentYear}年前`] | numberFormat}}
              </template>
            </el-table-column>
            <el-table-column
              v-for="yearindex in year"
              :key="`ghmj_${currentYear+yearindex-1}_${year}_${wd}`"
              :label="`${currentYear+yearindex-1}年`"
              header-align="center"
              align="right"
              :show-overflow-tooltip="true"
              :prop="`ghmj_${currentYear+yearindex-1}年`"
            >
              <template
                v-if="wdArr.length === 0"
                slot-scope="scope"
              >
                {{scope.row[`ghmj_${currentYear+yearindex-1}年`] | numberFormat}}
              </template>
              <el-table-column
                v-for="wditem in wdArr"
                :key="`ghmj_${currentYear+yearindex-1}年_${wditem}_${year}_${wd}`"
                :label="wditem"
                header-align="center"
                align="right"
                :show-overflow-tooltip="true"
                :width="120"
                :prop="`ghmj_${currentYear+yearindex-1}年_${wditem}`"
              >
                <template slot-scope="scope">
                  {{scope.row[`ghmj_${currentYear+yearindex-1}年_${wditem}`] | numberFormat}}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              :label="`${currentYear+year-1}年后供货面积`"
              header-align="center"
              align="right"
              :show-overflow-tooltip="true"
              :width="120"
              :prop="`ghmj_${currentYear+year-1}年后`"
            >
              <template slot-scope="scope">
                {{scope.row[`ghmj_${currentYear+year-1}年后`] | numberFormat}}
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 供货金额 -->
          <el-table-column
            :label="`供货金额`"
            :key="`供货金额_${year}_${wd}`"
          >
            <el-table-column
              :label="`${currentYear}年前已供货金额`"
              :width="120"
              header-align="center"
              align="right"
              :show-overflow-tooltip="true"
              :prop="`ghje_${currentYear}年前`"
            >
              <template slot-scope="scope">
                {{scope.row[`ghje_${currentYear}年前`] | numberFormat}}
              </template>
            </el-table-column>
            <el-table-column
              v-for="yearindex in year"
              :key="`ghje_${currentYear+yearindex-1}_${year}_${wd}`"
              :label="`${currentYear+yearindex-1}年`"
              :prop="`ghje_${currentYear+yearindex-1}年`"
              header-align="center"
              align="right"
              :show-overflow-tooltip="true"
              :width="120"
            >
              <template
                v-if="wdArr.length === 0"
                slot-scope="scope"
              >
                {{scope.row[`ghje_${currentYear+yearindex-1}年`] | numberFormat}}
              </template>
              <el-table-column
                v-for="wditem in wdArr"
                :key="`ghje_${currentYear+yearindex-1}年_${wditem}_${year}_${wd}`"
                :label="wditem"
                :width="120"
                header-align="center"
                align="right"
                :show-overflow-tooltip="true"
                :prop="`ghje_${currentYear+yearindex-1}年_${wditem}`"
              >
                <template slot-scope="scope">
                  {{scope.row[`ghje_${currentYear+yearindex-1}年_${wditem}`] | numberFormat}}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              :prop="`ghje_${currentYear+year-1}年后`"
              :label="`${currentYear+year-1}年后供货金额`"
              :width="120"
              header-align="center"
              align="right"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row[`ghje_${currentYear+year-1}年后`] | numberFormat}}
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
              >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </lazy-render>
    </template>
    <!-- 编辑填写页面 -->
    <el-dialog
      :close-on-click-modal="false"
      :key="`dialog_${year}_${wd}_${editRowInfo? editRowInfo.id : ''}`"
      top="50px"
      v-if="editRowInfo"
      :title="`${editRowInfo.sectionName}${editRowInfo.bldName ? `-${editRowInfo.bldName}` : '' }`"
      :visible="dialogVisible"
      :before-close="handleClose"
      width="1000px"
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
          label="楼栋"
          v-model="editRowInfo.bldName"
          :disabled="true"
        ></form-item>
        <form-item
          type="DatePicker"
          label="预售证时间"
          v-model="editRowInfo.cerSourceDate"
          :disabled="true"
        ></form-item>
        <form-item
          label="面积/个数"
          type="number"
          v-model="editRowInfo.totalArea"
          :disabled="true"
        ></form-item>
        <form-item
          label="金额"
          type="number"
          v-model="editRowInfo.totalPrice"
          :disabled="true"
        ></form-item>
        <form-item
          label="均价"
          type="number"
          v-model="editRowInfo.totalAvgPrice"
          :disabled="true"
        ></form-item>

      </div>
      <el-table
        :key="`dialog_table_${year}_${wd}_${editRowInfo? editRowInfo.id : ''}`"
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
        <el-table-column label="供货面积(平米)">
          <template slot-scope="scope">
            <edit-grid-item
              :value="scope.row.ghmjValue"
              type='number'
              @input="(val) => handleInput(val, scope.row, 'ghmjValue')"
              :isEdit="(currEditRow.children && currEditRow.children.length > 0) ? false : true"
            ></edit-grid-item>
          </template>

        </el-table-column>
        <el-table-column label="供货金额(万元)">
          <template slot-scope="scope">
            <edit-grid-item
              :value="scope.row.ghjeValue"
              type='number'
              @input="(val) => handleInput(val, scope.row, 'ghjeValue')"
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
import moment from "moment";
import accounting from "accounting";
import { VclTable } from "vue-content-loading";
import {myNumeral} from './util'


const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

export default {
  name: "GoodsValueBd",
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
    numberFormat(val) {
      if (val !== undefined && val !== null) {
        return accounting.formatNumber(val, 2);
      } else {
        return val;
      }
    }
  },
  computed: {
    showData: function() {
      const data = this.mpiSupplySectionInfo;
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
    arrData: function() {
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
      mpiSupplySectionInfo: state => state.outline_info.mpiSupplySectionInfo,
      mpiTableSettingInfo: state => state.outline_info.mpiTableSettingInfo
    }),
    setting() {
      const setting = this.mpiTableSettingInfo.find(item => {
        return item.typeName === "供货计划表楼栋";//供货计划表标段
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
  mounted() {
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
    handleEdit(row) {
      this.currEditRow = row;
      this.editRowInfo = cloneDeep(row);
      this.dialogVisible = true;
    },
    // 修改数值
    handleInput(val, row, type) {
      row[type] = val;
      // 计算可售面积个数，金额，合计
      this.calcTotal(this.editRowInfo);
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
      this.currEditRow.totalPrice = this.editRowInfo.totalPrice;
      this.currEditRow.totalArea = this.editRowInfo.totalArea;
      this.currEditRow.totalAvgPrice = this.editRowInfo.totalAvgPrice;
      this.currEditRow.datas.forEach((item, $index) => {
        this.$set(item, "ghmjValue", this.editRowInfo.datas[$index].ghmjValue);
        this.$set(item, "ghjeValue", this.editRowInfo.datas[$index].ghjeValue);
        this.$set(item, "totalPrice", this.editRowInfo.totalPrice);
        this.$set(item, "totalArea", this.editRowInfo.totalArea);
        this.$set(item, "totalAvgPrice", this.editRowInfo.totalAvgPrice);
      });
      // 更新父级
      // 父节点
      const parentNode = this.mpiSupplySectionInfo.find(item => {
        return item.children.some(childrenItem => {
          return childrenItem.id === this.editRowInfo.id;
        });
      });
      if (parentNode && parentNode.children) {
        // 所有子节点的合计
        parentNode.datas.forEach(parentItem => {
          let sumGhmjValue = 0;
          let sumGhjeValue = 0;
          parentNode.children.forEach(item => {
            item.datas.forEach(datasItem => {
              if (
                datasItem.year === parentItem.year &&
                datasItem.quarterOrMonth === parentItem.quarterOrMonth
              ) {
                if (datasItem["ghmjValue"]) {
                  sumGhmjValue = myNumeral(datasItem["ghmjValue"]).add(sumGhmjValue).value();
                }
                if (datasItem["ghjeValue"]) {
                  sumGhjeValue = myNumeral(datasItem["ghjeValue"]).add(sumGhjeValue).value();
                }
              }
            });
          });
          this.$set(parentItem, "ghmjValue", sumGhmjValue);
          this.$set(parentItem, "ghjeValue", sumGhjeValue);
        });

        // 计算可售面积个数，金额，合计
        this.calcTotal(parentNode);
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
    // 计算可售面积个数，金额，合计
    calcTotal(row) {
      let totalPrice = 0;
      let totalArea = 0;
      let totalAvgPrice = 0;
      row.datas.forEach(item => {
        const itemTotalPrice = numeral(item.ghjeValue);
        const itemTotalArea = numeral(item.ghmjValue);
        const itemTotalAvgPrice = 0;
        if (
          itemTotalPrice.value() !== null &&
          itemTotalPrice.value() !== undefined &&
          !isNaN(itemTotalPrice.value())
        ) {
          totalPrice = itemTotalPrice.add(totalPrice).value();
        }
        if (
          itemTotalArea.value() !== null &&
          itemTotalArea.value() !== undefined &&
          !isNaN(itemTotalArea.value())
        ) {
          totalArea = itemTotalArea.add(totalArea).value();
        }
        if (
          numeral.isNumeral(numeral(totalPrice)) &&
          numeral.isNumeral(numeral(totalArea)) &&
          totalArea !== 0
        ) {
          totalAvgPrice = numeral(totalPrice)
            .divide(totalArea)
            .value();
        }
      });
      row.totalPrice = totalPrice;
      row.totalArea = totalArea;
      row.totalAvgPrice = totalAvgPrice;
      row.datas.forEach(element => {
        element.totalPrice = totalPrice;
        element.totalArea = totalArea;
        element.totalAvgPrice = totalAvgPrice;
      });
    },
    // 递归增加子级节点
    updateRowNode(row) {
      const dynamicsObj = {};
      row.datas.forEach(datasItem => {
        const key_ghje = datasItem.quarterOrMonth
          ? `ghje_${datasItem.year}_${datasItem.quarterOrMonth}`
          : `ghje_${datasItem.year}`;
        const key_ghmj = datasItem.quarterOrMonth
          ? `ghmj_${datasItem.year}_${datasItem.quarterOrMonth}`
          : `ghmj_${datasItem.year}`;
        dynamicsObj[key_ghje] = datasItem.ghjeValue;
        dynamicsObj[key_ghmj] = datasItem.ghmjValue;
      });
      row = Object.assign(row, dynamicsObj);
      if (row.children && Array.isArray(row.children)) {
        row.children.forEach(childrenitem => {
          this.updateRowNode(childrenitem);
        });
      }
    },
    getSummaries(param) {
      const notSumProp = [
        "sectionName",
        "bldNameList",
        "productType",
        "productName",
        "cerSourceDate",
        "totalAvgPrice"
      ];
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        } else if (notSumProp.indexOf(column.property) >= 0) {
          sums[index] = "";
          return;
        } else {
          const values = data.map(item => {
            if (!item.children || item.children.length === 0) {
              return Number(item[column.property]);
            } else {
              return 0;
            }
          });
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return myNumeral(curr).add(prev).value();
              } else {
                return prev;
              }
            }, 0);
            sums[index] = sums[index];
          } else {
            sums[index] = null;
          }
        }
      });
      // 计算均价
      if (
        sums.length > 0 &&
        sums[6] &&
        sums[5] &&
        numeral.isNumeral(numeral(sums[6])) &&
        numeral.isNumeral(numeral(sums[5])) &&
        sums[5] !== 0
      ) {
        console.log(sums[6], sums[5], numeral(sums[6]).divide(sums[5]));
        sums[7] = numeral(sums[6])
          .divide(sums[5])
          .value();
      }
      const result = sums.map(item => {
        if (item && numeral.isNumeral(numeral(item))) {
          return this.$options.filters["numberFormat"](item);
        } else {
          return item;
        }
      });
      return result;
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