<template>
  <div>
    <!--基本信息-->
    <el-card class="editCard">
      <div slot="header" class="clearfix">
        <i class="el-icon-tickets" style="color:RGB(255,204,102)"></i>
        <span style="margin-left:10px;">基本信息</span>
      </div>
      <div class="formitemdiv">
        <form-item label="总用地面积" unit="㎡" :disabled="true" type="number" v-model="mpiBasicPlanInfo.allTerraArea"></form-item>
        <form-item label="建设用地面积" unit="㎡" :disabled="true" type="number" v-model="mpiBasicPlanInfo.buildTerraArea"></form-item>
        <form-item label="代征地的面积" unit="㎡" :disabled="true" type="number" v-model="mpiBasicPlanInfo.proxyLandArea"></form-item>
        <form-item label="建筑占地面积" unit="㎡" :disabled="true" type="number" v-model="mpiBasicPlanInfo.bldHoldArea"></form-item>
        <form-item label="容积率" :disabled="true" type="number" v-model="mpiBasicPlanInfo.cubageRate"></form-item>
        <form-item label="建筑密度" :disabled="true" type="number" unit="%" v-model="mpiBasicPlanInfo.buildDensity"></form-item>
        <form-item label="总建筑面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.totalBldArea"></form-item>
        <form-item label="地上建筑面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.upperBuildArea"></form-item>
        <form-item label="地下建筑面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.underBuildArea"></form-item>
        <form-item label="总可售面积" unit="㎡"  type="number" :disabled="true" v-model="mpiBasicPlanInfo.totalSaleArea"></form-item>
        <form-item label="地上可售面积" unit="㎡"  type="number" :disabled="true" v-model="mpiBasicPlanInfo.upperSaleArea"></form-item>
        <form-item label="地下可售面积" unit="㎡"  type="number" :disabled="true" v-model="mpiBasicPlanInfo.underSaleArea"></form-item>
        <form-item label="总可租面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.totalLandArea"></form-item>
        <form-item label="地上可租面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.upperLandArea"></form-item>
        <form-item label="地下可租面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.underLandArea"></form-item>
        <form-item label="总计容面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.totalJrArea"></form-item>
        <form-item label="地上计容面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.upperJrArea"></form-item>
        <form-item label="地下计容面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.underJrArea"></form-item>
        <form-item label="总还建面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.totalAlsoArea"></form-item>
        <form-item label="景观面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.landJgArea"></form-item>
        <form-item label="用地红线外景观面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.landRedOutArea"></form-item>
        <form-item label="用地红线内景观面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.landRedInArea"></form-item>
        <form-item label="屋顶景观面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.roofLandJgArea"></form-item>
        <form-item label="垂直绿化面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.czGreenArea"></form-item>
        <form-item label="车位" unit="个" type="number" :disabled="true" v-model="mpiBasicPlanInfo.cwNum"></form-item>
        <form-item label="地上车位" unit="个" type="number" :disabled="true" v-model="mpiBasicPlanInfo.upperCwNum"></form-item>
        <form-item label="地下人防车位" unit="个" type="number" :disabled="true" v-model="mpiBasicPlanInfo.underRfCwNum"></form-item>
        <form-item label="地下非人防车位" unit="个" type="number" :disabled="true" v-model="mpiBasicPlanInfo.underFrfCwNum"></form-item>
        <form-item label="标准车位面积" unit="㎡" type="number" :disabled="true" v-model="mpiBasicPlanInfo.standardCwarea"></form-item>
        <form-item label="是否回迁" :disabled="true" type="select" :options="[{id:'是',label:'是'},{id:'否',label:'否'}]" :value="mpiBasicPlanInfo.ifMoveBack"></form-item>
        <form-item label="是否还建" :disabled="true" type="select" :options="[{id:'是',label:'是'},{id:'否',label:'否'}]" :value="mpiBasicPlanInfo.ifAlso"></form-item>
      </div>
    </el-card>

    <el-card class="editCard">
      <div slot="header" class="clearfix">
        <i class="el-icon-news" style="color:RGB(255,204,102)"></i>
        <span style="margin-left:10px;">产品规划指标</span>
      </div>
      <template>
        <el-table border :data="mpiProductPlanInfo" style="width: 100%">
          <el-table-column prop="productType" label="产品类型" ></el-table-column>
          <el-table-column prop="productName" label="产品名称" :width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="upperBuildArea" header-align="center"
              align="right"
              :show-overflow-tooltip="true" label="地上建筑面积(万平米)" :width="100" >
            <template slot-scope="scope">
              {{scope.row.upperBuildArea | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="underBuildArea" header-align="center" :width="100" 
              align="right"
              :show-overflow-tooltip="true" label="地下建筑面积(万平米)">
            <template slot-scope="scope">
              {{scope.row.underBuildArea | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="totalBldArea" header-align="center" :width="100" 
              align="right"
              :show-overflow-tooltip="true" label="总建筑面积(万平米)">
            <template slot-scope="scope">
              {{scope.row.totalBldArea | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="saleArea" label="可售面积(万平米)" header-align="center" :width="100" 
              align="right"
              :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.saleArea | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="landArea" label="可租面积(万平米)" header-align="center" :width="100" 
              align="right"
              :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.landArea | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="alsoArea" label="还建面积(万平米)" header-align="center" :width="100" 
              align="right"
              :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.alsoArea | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="buildingNum" label="栋数(栋)" header-align="center" :width="100" 
              align="right"
              :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.buildingNum | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="layerNum" label="层数(层)" header-align="center" :width="100" 
              align="right"
              :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.layerNum }}
            </template>
          </el-table-column>
          <el-table-column prop="unitNum" label="单元数(个)" header-align="center" :width="100" 
              align="right"
              :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.unitNum | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="householdNum" label="户数(户)" header-align="center" :width="100" 
              align="right"
              :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.householdNum | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="layerHigh" label="层高-首/标(米)" header-align="center" :width="100" 
              align="right"
              :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.layerHigh | numberFormat}}
            </template>
            </el-table-column>
          <el-table-column prop="bldHoldArea" label="建筑占地面积(万平米)" header-align="center" :width="100" 
              align="right"
              :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.bldHoldArea | numberFormat}}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>

    <el-card class="editCard">
      <div
        slot="header"
        class="clearfix"
      >
        <i
          class="el-icon-news"
          style="color:RGB(255,204,102)"
        ></i><span style="margin-left:10px;">标段规划指标</span>
      </div>
      <template>
        <el-table border :data="mpiSectionPlanInfo" style="width: 100%" :isTree="true" row-key="id" :isTreeExpandAll="true">
          <el-table-column prop="sectionName" label="标段名称" ></el-table-column>
          <el-table-column prop="productType" label="产品类型" ></el-table-column>
          <el-table-column prop="productName" label="产品名称" ></el-table-column>
          <el-table-column prop="upperBuildArea" label="地上建筑面积" width="120" header-align="center" 
              align="right">
            <template slot-scope="scope">
              {{scope.row.upperBuildArea | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="underBuildArea" label="地下建筑面积" width="120" header-align="center" 
              align="right">
            <template slot-scope="scope">
              {{scope.row.underBuildArea | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="totalBldArea" label="总建筑面积" width="120" header-align="center" 
              align="right">
            <template slot-scope="scope">
              {{scope.row.totalBldArea | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="saleArea" label="可售面积" width="120" header-align="center" 
              align="right">
            <template slot-scope="scope">
              {{scope.row.saleArea | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="landArea" label="可租面积" width="120" header-align="center" 
              align="right">
            <template slot-scope="scope">
              {{scope.row.landArea | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="householdNum" label="户数(户)" header-align="center" 
              align="right">
            <template slot-scope="scope">
              {{scope.row.householdNum | numberFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="buildTerraArea" label="建筑用地面积" header-align="center" 
              align="right">
            <template slot-scope="scope">
              {{scope.row.buildTerraArea | numberFormat}}
            </template>
          </el-table-column>
          </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
import FormItem from './FormItem'
import { mapState } from 'vuex'

export default {
  name: "PlanInfo",
  props:['id','mode'],
  components:{FormItem},
  data() {
    return {
      ytTable:[{}], // 模拟的数据
      basicInfo: {}
    }
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
    ...mapState({
      outline_stepInfo: state => state.outline_stepInfo,
      mpiProjectInfo: state => state.outline_info.mpiProjectInfo,
      mpiProductInfo: state => state.outline_info.mpiProductInfo,
      mpiSectionInfo: state => state.outline_info.mpiSectionInfo,
      mpiDevPlanInfo: state => state.outline_info.mpiDevPlanInfo,
      mpiSectionPlanInfo: state => state.outline_info.mpiSectionPlanInfo,
      mpiProductPlanInfo: state => state.outline_info.mpiProductPlanInfo,
      mpiBasicPlanInfo: state => state.outline_info.mpiBasicPlanInfo,
    })
  },
  created() {
    
  }
}

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
.date_width{
  width:245px;
}
</style>
<style lang="scss">
.editCard {
  margin-top:10px;
  .el-card__header {
    padding: 10px 20px;
  }
}
</style>
