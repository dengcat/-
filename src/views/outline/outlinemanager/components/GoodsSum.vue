<template>
<div>
  <el-card class="editCard" shadow="never">
    <div
      slot="header"
      class="clearfix"
    >
      <i
        class="el-icon-news"
        style="color:RGB(255,204,102)"
      ></i>
      <span style="margin-left:10px;">项目利润测算</span>
    </div>
    <div class="formitemdiv" v-if="mpiSaleTotalProCalInfo">
        <form-item label="项目全成本(含税)" type="number" v-model="mpiSaleTotalProCalInfo.projTotalCostTax"></form-item>
        <form-item label="项目全成本(不含税)" type="number" v-model="mpiSaleTotalProCalInfo.projTotalCostNoTax"></form-item>
        <form-item label="总税负" type="number" v-model="mpiSaleTotalProCalInfo.allTotalTax"></form-item>
        <form-item label="项目净利润" type="number" v-model="mpiSaleTotalProCalInfo.projProfit"></form-item>
        <form-item label="项目净利润率(含税)" type="number" v-model="mpiSaleTotalProCalInfo.projTaxProfitRate"></form-item>
        <form-item label="项目净利润率(不含税)" type="number" v-model="mpiSaleTotalProCalInfo.projNoTaxProfitRate"></form-item>
      </div>
  </el-card>
  <el-card class="editCard" shadow="never">
    <div
      slot="header"
      class="clearfix"
    >
      <i
        class="el-icon-news"
        style="color:RGB(255,204,102)"
      ></i>
      <span style="margin-left:10px;">总货值计算表</span>
    </div>
    <template>
      <el-table
        :data="mpiSaleTotalCalInfo"
        border
        fit
        style="width: 100%"
        :isTree="true"
        row-key="id"
        :isTreeExpandAll="true"
        :highlight-current-row="true"
      >
        <el-table-column
          file-icon="icon icon-file"
          folder-icon="icon icon-folder"
          prop="sectionName"
          label="标段"
          width="220"
          treeKey="sectionName"
          :expandAll="true"
        ></el-table-column>
        
        <el-table-column
          prop="productType"
          label="产品类型"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="productName"
          label="产品名称"
          width="180"
        >
        </el-table-column>
       
        <el-table-column
          prop="projSaleArea"
          label="项目总可售面积（车位个数）"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
        </el-table-column>
        <el-table-column
          prop="projSaleTotal"
          label="项目总可售金额"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
          </el-table-column>
        <el-table-column
          label="项目总可售均价"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
        <template slot-scope="scope">
          <EditGridItem :isEdit="!scope.row.children || scope.row.children.length===0" type="number" v-model="scope.row.projSalePrice"></EditGridItem>
        </template>
          </el-table-column>
       
      </el-table>
    </template>
  </el-card>

  
</div>
</template>

<script>
import { mapState } from "vuex";
import mixin_commom from "@/utils/mixin_commom";
import EditGridItem from "./EditGridItem";
import DynamicsColumn from "./DynamicsColumn";
import FormItem from './FormItem'

const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

export default {
  name: "GoodsSum",
  components: { EditGridItem,DynamicsColumn,FormItem },
  mixins: [mixin_commom],
  data() {
    return {
      test:'',
      year: 4,
      wd: "季度",
      currentYear:currentYear,
      data: [],
      columnConfigs: [
        { label: "供货面积(平米)", prop: "ghmj" },
        { label: "供货金额(万元)", prop: "ghje" }
      ]
    };
  },
  computed: {
    tableHeight: function() {
      return this.clientHeight - 340;
    },
    ...mapState({
      outline_stepInfo: state => state.outline_stepInfo,
      mpiSaleTotalProCalInfo: state => state.outline_info.mpiSaleTotalProCalInfo,
      mpiSaleTotalCalInfo: state => state.outline_info.mpiSaleTotalCalInfo,
    }),
  },
  watch: {
  },
  methods: {
    handleChange() {
      // const dynamicsData = {}
      // this.$set(dynamicsData)

      // this.data = Object.assign({},this.data,)
    }
  },
  created(){
    // this.data = this.outline_info.mpiSupplyBuildInfo
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
</style>