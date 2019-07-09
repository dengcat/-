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
      <span style="margin-left:10px;">管理费用</span>
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
      <lazy-render :time="300" :immediately="true">
      <vcl-table :speed="1" width="100%" height="100%" slot="tip" :rows="10" :columns="10"></vcl-table>
      <el-bigdata-table
        :height="tableHeight"
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
          prop="costName"
          label="科目"
          width="220"
          treeKey="costName"
          :expandAll="true"
          :show-overflow-tooltip="true"
          fixed
        >
        </el-table-column>
        <el-table-column
          label="科目编号"
          width="120"
          fixed
        >
        <template slot-scope="scope">
          <template v-if="scope.$index > 2">
            {{scope.row.costCode}}
          </template>
        </template>
        </el-table-column>
        <el-table-column
          label="合计"
          width="120"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
          <template slot-scope="scope">
            {{scope.row.sumCost | numberFormat}}
          </template>
        </el-table-column>

        
        <el-table-column
          label="小计"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
          <el-table-column
            :label="`${currentYear}年前`"
            header-align="center"    :show-overflow-tooltip="true"       align="right"
            width="120"
          >
            <template slot-scope="scope">
              {{scope.row[`小计${currentYear}年前`] | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column
            v-for="yearindex in year"
            :key="`小计${currentYear+yearindex-1}年`"
            :label="`${currentYear+yearindex-1}年`"
            header-align="center"    :show-overflow-tooltip="true"       align="right"
            width="120"
          >
            <template slot-scope="scope">
              {{scope.row[`小计${currentYear+yearindex-1}年`] | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"    :show-overflow-tooltip="true"       align="right"
            :label="`${currentYear+year-1}年后`"
            width="120"
          >
            <template slot-scope="scope">
              {{scope.row[`小计${currentYear+year-1}年后`] | numberFormat}}
            </template>
          </el-table-column>
        </el-table-column>

        <!-- 年份详细 -->
        <el-table-column
          :label="`${currentYear}年前`"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
          width="120"
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
          width="120"
        >
          <el-table-column
            v-for="wditem in wdArr"
            :key="`${currentYear+yearindex-1}年_${wditem}`"
            :label="wditem"
            header-align="center"    :show-overflow-tooltip="true"       align="right"
            width="120"
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
          width="120"
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
            <el-button v-if="scope.$index<2"
              @click="handleEdit(scope.row,scope.$index)"
              type="text"
            >查看
            </el-button>
            <el-button v-else
              @click="handleEdit(scope.row,scope.$index)"
              type="text"
            >填写</el-button>
          </template>
        </el-table-column>
      </el-bigdata-table>
      </lazy-render>
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
          label="科目编号"
          v-model="editRowInfo.costCode"
          :disabled="true"
        ></form-item>
        <form-item
          label="合计"
          v-model="editRowInfo.sumCost"
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
        <el-table-column label="管理费用" align="right">
          <template slot-scope="scope">
            <edit-grid-item
              :value="scope.row.costValue"
              type='number'
              @input="val => handleCostValue(val, scope.row)"
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
import { mapState,mapActions } from "vuex";
import mixin_commom from "@/utils/mixin_commom";
import EditGridItem from "./EditGridItem";
import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import accounting from 'accounting'
import FormItem from "./FormItem";
import { treeToArrayNoParent } from "@/utils";
import { VclTable } from 'vue-content-loading';
import {calcTotal} from './util'


const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

export default {
  name: "ManagerExpense",
  components: { EditGridItem, FormItem, VclTable },
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
      const data = this.mpiManageMentCostInfo;
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
      mpiManageMentCostInfo: state => state.outline_info.mpiManageMentCostInfo,
      mpiTableSettingInfo: state => state.outline_info.mpiTableSettingInfo
    }),
    setting() {
      const setting = this.mpiTableSettingInfo.find(item => {
        return item.typeName === "管理费用";
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
    ...mapActions([
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
        dynamicsObj[key_ghmj] = datasItem.costValue;
      });
      row = Object.assign(row, dynamicsObj);
      if (row.children && Array.isArray(row.children)) {
        row.children.forEach(childrenitem => {
          this.updateRowNode(childrenitem);
        });
      }
    },
    handleSave(type) {
      this.currEditRow.sumCost = this.editRowInfo.sumCost
      this.currEditRow.datas.forEach((item, $index) => {
        this.$set(item, "costValue", this.editRowInfo.datas[$index].costValue);
        this.$set(item, "sumCost", this.editRowInfo.sumCost);
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
      this.calcManager()
    },
    // 更新父级的合计
    updateParentNodes(row){
      // 是否有父级
      if(!row.parentCode || row.parentCode===''){
        return
      }
      let parentNode = this.arrData.find(element=>{
        return element.costCode === row.parentCode
      })
      if(!parentNode){
        return 
      }
      // 更新父级的合计
      parentNode.datas.forEach(parentItem=>{
        let costValue = 0;
        parentNode.children.forEach(item => {
          item.datas.forEach(datasItem => {
            if (
              datasItem.year === parentItem.year &&
              datasItem.quarterOrMonth === parentItem.quarterOrMonth
            ) {
              if (datasItem["costValue"]) {
                costValue = costValue + datasItem["costValue"];
              }
            }
          });
        });
        this.$set(parentItem, "costValue", costValue);
      })
      calcTotal(parentNode, 'costValue', 'sumCost')
      // 递归更新
      this.updateParentNodes(parentNode)
      
    },
    handleCostValue(value, row){
      row.costValue = value
      calcTotal(this.editRowInfo, 'costValue', 'sumCost')
    },
    // // 计算小计
    // calcTotal(row){
    //   const xj = row.datas.filter(item=>{
    //     return item.year.indexOf('小计')>=0
    //   })
    //   xj.forEach(item=>{
    //     item.costValue = 0
    //   })
    //   row.datas.forEach(element=>{
    //     if(element.year.indexOf('小计')<0){
    //       const curxj = xj.find(xjitem=>{
    //         return xjitem.year.replace('小计','')=== element.year
    //       })
    //       if(!curxj.costValue){
    //         curxj.costValue = element.costValue
    //       }
    //       else{
    //         curxj.costValue = curxj.costValue + element.costValue
    //       }
    //     }
    //   })
    //   let sumCost = 0
    //   xj.forEach(item=> {
    //     sumCost = sumCost + item.costValue
    //   })
    //   row.sumCost = sumCost
    //   row.datas.forEach(item=>{
    //     item.sumCost = sumCost
    //   })
    // },
    // 计算管理费用会计核算和考核口径
    calcManager(){
      // 合计
      let managerCostKj = 0
      let managerCostKh = 0
      let kfjjf = 0  // 开发间接费
      let gdzcgzzc =0 // 固定资产购置支出
      let wxzc =0 // 无形资产及其他资产购置支出
      let zjf = 0 // 折旧费
      let zctx = 0  // 资产摊销
      let cost = 0 //一级费用科目
      this.arrData.forEach((item,index)=>{
        // 合计
        if(index===2 && item.sumCost){
          kfjjf = item.sumCost
        }
        if(index > 2 && (!item.children || item.children.length===0) && item.sumCost){
          cost = cost + item.sumCost
        }
        if(item.costName==='固定资产' && item.sumCost){
          gdzcgzzc = gdzcgzzc + item.sumCost
        }
        if((item.costName==='无形资产购置支出' || item.costName==='其他资产购置支出') && item.sumCost){
          wxzc = wxzc + item.sumCost
        }
        if(item.sumCost && item.costName==='折旧费'){
          zjf = zjf + item.sumCost
        }
        if(item.sumCost && item.costName==='资产摊销'){
          zctx = zctx + item.sumCost
        }
      })
      this.arrData[0].sumCost = cost - kfjjf - gdzcgzzc - wxzc
      this.arrData[0].datas.forEach(item=>{
        item.sumCost = this.arrData[0].sumCost
      })
      this.arrData[1].sumCost = cost - zjf - zctx
      this.arrData[1].datas.forEach(item=>{
        item.sumCost = this.arrData[1].sumCost
      })
      // 明细
      this.arrData[0].datas.forEach((item,index)=>{
        let kfjjf = 0  // 开发间接费
        let gdzcgzzc =0 // 固定资产购置支出
        let wxzc =0 // 无形资产及其他资产购置支出
        let zjf = 0 // 折旧费
        let zctx = 0  // 资产摊销
        let cost = 0 //一级费用科目
        this.arrData.forEach((dataitem,dataindex)=>{
          if(dataindex===2 && dataitem.datas[index].costValue){
            kfjjf = dataitem.datas[index].costValue
          }
          if(dataindex > 2 && (!dataitem.children || dataitem.children.length===0) && dataitem.datas[index].costValue){
            cost = cost + dataitem.datas[index].costValue
          }
          if(item.costName==='固定资产' && dataitem.datas[index].costValue){
            gdzcgzzc = gdzcgzzc + dataitem.datas[index].costValue
          }
          if((item.costName==='无形资产购置支出' || item.costName==='其他资产购置支出') && dataitem.datas[index].costValue){
            wxzc = wxzc + dataitem.datas[index].costValue
          }
          if(dataitem.datas[index].costValue && item.costName==='折旧费'){
            zjf = zjf + dataitem.datas[index].costValue
          }
          if(dataitem.datas[index].costValue && item.costName==='资产摊销'){
            zctx = zctx + dataitem.datas[index].costValue
          }
        })
        this.arrData[0].datas[index].costValue =cost - kfjjf - gdzcgzzc - wxzc
        this.arrData[1].datas[index].costValue = cost - zjf - zctx
      })

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
