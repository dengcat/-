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
      <span style="margin-left:10px;">成本分摊</span>
    </div>
    <ul class="tjList">
      <li><span>地上可售面积:</span><span style="color:#40a9ff">{{mpiBasicPlanInfo.upperSaleArea}}㎡</span><span>可租面积:</span><span style="color:#40a9ff">{{mpiBasicPlanInfo.totalLandArea}}㎡</span></li>
    </ul>
    <template>
      <el-table
        :height="tableHeight"
        :data="showData"
        style="width: 100%"
        :isTree="true"
        row-key="id"
        :isTreeExpandAll="true"
        :highlight-current-row="false"
        border
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
          prop="costName"
          label="科目"
          width="130"
          fixed
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="department"
          label="责任部门"
          width="110"
          fixed
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="dynamicCost"
          label="动态成本（万元）"
          width="120"
          fixed
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
          <template slot-scope="scope">
            {{scope.row.dynamicCost | numberFormat}}
          </template>
        </el-table-column>

        <el-table-column
          label="可售单方（财务）元/平"
          width="100"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
          <template slot-scope="scope">
            {{scope.row.totalSalePrice | numberFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="计算规则"
          width="100"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{scope.row.calcRule | numberFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="合计-成本（万元）"
          width="100"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
          <template slot-scope="scope">
            {{scope.row.totalCost | numberFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="合计-可租售单方（财务）元/㎡"
          width="100"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
          <template slot-scope="scope">
            {{scope.row.totalSalePrice | numberFormat}}
          </template>
        </el-table-column>

        <el-table-column
          :label="item.productType"
          width="100"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
          v-for="item in mpiProductInfo"
          :key="item.id"
        >
          <el-table-column
          label="成本(万元)"
          width="100"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`${item.productTypeGuid}_cb`] | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column
          label="可租售单方(财务)元/㎡"
          width="100"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`${item.productTypeGuid}_zs`] | numberFormat}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <template v-if="editRow.indexOf(scope.row.costName)>=0" >
              <el-button
                @click="handleEdit(scope.row)"
                type="text"
              >填写</el-button>
            </template>
            <template v-else>
              <el-button
                @click="handleEdit(scope.row)"
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
      :title="`${editRowInfo.sectionName}${editRowInfo.costName ? `-${editRowInfo.costName}` : '' }`"
      :visible="dialogVisible"
      width="1000px"
    >
      <div class="formitemdiv">
        <form-item
          label="标段"
          v-model="editRowInfo.sectionName"
          :disabled="true"
        ></form-item>
        <form-item
          label="科目"
          v-model="editRowInfo.costName"
          :disabled="true"
        ></form-item>
        <form-item
            label="责任部门"
            v-model="departmentObject"
            type="select"
            :options="departmentList"
            :normalizer="normalizer"
            value-format="object"
          ></form-item>
        <form-item
          label="动态成本（万元）"
          v-model="editRowInfo.dynamicCost"
          :disabled="true"
          type="number"
        ></form-item>
        <form-item
          label="可售单方（财务）元/平"
          v-model="editRowInfo.cerSourceDate"
          :disabled="true"
          type="number"
        ></form-item>
        <form-item
          label="计算规则"
          v-model="editRowInfo.calcRule"
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
          :label="`产品`"
          prop="productType"
          width="180"
        >
        </el-table-column>
        <el-table-column label="成本（万元）">
          <template slot-scope="scope">
            <edit-grid-item
              :value="scope.row.productTypeCost"
              type='number'
              @input="(val) => handleInput(val, scope.row, 'productTypeCost')"
              :isEdit="(currEditRow.children && currEditRow.children.length > 0) ? false : true"
            ></edit-grid-item>
          </template>

        </el-table-column>
        <el-table-column label="可售单方（财务）元/平">
          <template slot-scope="scope">
            <edit-grid-item
              :value="scope.row.productTypeSalePrice"
              @input="(val) => handleInput(val, scope.row, 'productTypeSalePrice')"
              type='number'
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
import accounting from 'accounting'
import { getDepartmentByBuGuid } from "@/api/outLineManager";
import mixin_calc from './mixin_calc'


const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

export default {
  name: "CostShare",
  components: { EditGridItem, FormItem },
  mixins: [mixin_commom, mixin_calc],
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
      pageLoading: true,
      departmentObject: undefined,
      departmentList:[],
      editRow:['主体土建及安装工程', '装修工程']
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
      const data = this.mpiCostAllocationInfo;
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
      mpiCostAllocationInfo: state => state.outline_info.mpiCostAllocationInfo,
      mpiProductInfo: state => state.outline_info.mpiProductInfo,
      mpiBasicPlanInfo: state => state.outline_info.mpiBasicPlanInfo,
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
  mounted(){
    this.pageLoading = false
    getDepartmentByBuGuid(this.mpiVersionInfo.buGuid).then(response => {
      this.departmentList = response.data.result;
    });
  },
  methods: {
    ...mapActions([
      "outline_stepInfo_UpdateStepInfo",
      "SaveOutlineInfo",
      "SetOutlineInfo"
    ]),
    handleEdit(row) {
      this.currEditRow = row;
      this.editRowInfo = cloneDeep(row);
      this.dialogVisible = true;

    },
    // 修改数值
    handleInput(val, row, type){
      row[type] = val
      // 计算合计
      this.calcTotal(this.editRowInfo)
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
      this.currEditRow.totalCost = this.editRowInfo.totalCost
      this.currEditRow.totalArea = this.editRowInfo.totalArea
      this.currEditRow = Object.assign(this.currEditRow,{
        department: this.departmentObject ? this.departmentObject.buName : null,
        departmentCode: this.departmentObject
          ? this.departmentObject.orgID
          : null
      })
      // this.currEditRow.totalAvgPrice = this.editRowInfo.totalAvgPrice
      this.currEditRow.datas.forEach((item, $index) => {
        this.$set(item, "productTypeCost", this.editRowInfo.datas[$index].productTypeCost);
        this.$set(item, "productTypeSalePrice", this.editRowInfo.datas[$index].productTypeSalePrice);
        this.$set(item, "totalCost", this.editRowInfo.totalCost);
        this.$set(item, "totalArea", this.editRowInfo.totalArea);

      });
      const mpiCostAllocationInfo = this.calcCbft()
      this.SetOutlineInfo({mpiCostAllocationInfo})
      // this.calcTotal(this.currEditRow)
      // // 更新父级
      // // 父节点
      // const parentNode = this.mpiCostAllocationInfo.find(item => {
      //   return item.children.some(childrenItem => {
      //     return childrenItem.id === this.editRowInfo.id;
      //   });
      // });
      // if (parentNode && parentNode.children) {
      //   // 所有子节点的合计
      //   parentNode.datas.forEach(parentItem => {
      //     let sumTotalCost = 0;
      //     parentNode.children.forEach(item => {
      //       item.datas.forEach(datasItem => {
      //         if (
      //           datasItem.productTypeGuid === parentItem.productTypeGuid
      //         ) {
      //           if (datasItem["totalCost"]) {
      //             sumTotalCost = sumTotalCost + datasItem["totalCost"];
      //           }
      //         }
      //       });
      //     });
      //     this.$set(parentItem, "totalCost", sumTotalCost);
      //   });

      //   // 计算，合计和可售单方
      //   this.calcTotal(parentNode)
      // }
      
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
    // 计算合计
    calcTotal(row){
      let totalCost = 0
      let totalSalePrice = 0
      row.datas.forEach(item=>{
        const itemTotalCost = numeral(item.totalCost)
        if(itemTotalCost.value() !== null &&
            itemTotalCost.value() !== undefined &&
            !isNaN(itemTotalCost.value())){
          totalCost = itemTotalCost.add(totalCost).value()
        }
        if(numeral.isNumeral(numeral(totalCost)) && this.mpiBasicPlanInfo.totalSaleArea){
          totalSalePrice = numeral(totalCost).divide(this.mpiBasicPlanInfo.totalSaleArea).divide(1000).value()
        }
      })
      row.totalCost = totalCost
      row.salePrice = totalSalePrice
    },
    // 递归增加子级节点
    updateRowNode(row) {
      const dynamicsObj = {};
      row.datas.forEach(datasItem => {
        const key_cb = `${datasItem.productTypeGuid}_cb`;
        const key_zs = `${datasItem.productTypeGuid}_zs`;
        dynamicsObj[key_cb] = datasItem.productTypeCost;
        dynamicsObj[key_zs] = datasItem.productTypeSalePrice;
      });
      row = Object.assign(row, dynamicsObj);
      if (row.children && Array.isArray(row.children)) {
        row.children.forEach(childrenitem => {
          this.updateRowNode(childrenitem);
        });
      }
    },
    normalizer(node) {
      return {
        id: node.orgID,
        label: node.buName,
        children: node.children
      };
    }
    
  },
};
</script>

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