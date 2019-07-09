<template>
  <div>
    <!--基本信息-->
    <el-card class="editCard">
      <div slot="header" class="clearfix">
        <i class="el-icon-tickets" style="color:RGB(255,204,102)"></i>
        <span style="margin-left:10px;">基本信息</span>
      </div>
      <div class="formitemdiv">
        <form-item label="项目编码" v-model="mpiProjectInfo.projCode" :disabled="true"></form-item>
        <form-item label="项目案名" v-model="mpiProjectInfo.onceName" :disabled="true"></form-item>
        <form-item label="项目推广名" v-model="mpiProjectInfo.spreadName" :disabled="true"></form-item>
        <form-item label="项目名称" v-model="mpiProjectInfo.projName" :disabled="true"></form-item>
        <form-item label="项目地块名称" v-model="mpiProjectInfo.plotName" :disabled="true"></form-item>
        <form-item label="法人公司名称" v-model="mpiProjectInfo.corporation_cp" :disabled="true"></form-item>
        <form-item label="产品系列" v-model="mpiProjectInfo.product_line" :disabled="true"></form-item>
        <form-item label="生产状态" v-model="mpiProjectInfo.projStatus" :disabled="true"></form-item>
        <form-item label="权益比例" v-model="mpiProjectInfo.rightsRate" :disabled="true" unit="%"></form-item>
        <form-item label="土地获取日期" type="DatePicker" v-model="mpiProjectInfo.landcjdate" :disabled="true"></form-item>
        <form-item label="土地开始使用日期" type="DatePicker" v-model="mpiProjectInfo.landbgndate" :disabled="true"></form-item>
        <form-item label="土地截止使用日期" type="DatePicker" v-model="mpiProjectInfo.landenddate" :disabled="true"></form-item>
        <form-item label="用地性质" v-model="mpiProjectInfo.landProperty" :disabled="true"></form-item>
        <form-item label="土地获取方式" v-model="mpiProjectInfo.landam" :disabled="true"></form-item>
        <form-item label="项目地址" v-model="mpiProjectInfo.projAddress" :disabled="true"></form-item>
        <form-item label="所属区域" v-model="mpiProjectInfo.area" :disabled="true"></form-item>
        <form-item label="所属城市" v-model="mpiProjectInfo.city" :disabled="true"></form-item>
        <form-item label="所属城市行政区域" v-model="mpiProjectInfo.city_ad" :disabled="true"></form-item>
        <form-item label="项目负责人" v-model="mpiProjectInfo.principal" :disabled="true"></form-item>
        <form-item label="项目创建人" v-model="mpiProjectInfo.project_by" :disabled="true"></form-item>
        <form-item label="项目创建日期" v-model="mpiProjectInfo.project_time" type="DatePicker" :disabled="true"></form-item>
        <form-item userClass="formitemoneline" label="项目描述" type="textarea" v-model="mpiProjectInfo.projInfo" :disabled="true"></form-item>
      </div>
    </el-card>

    <el-card class="editCard">
      <div slot="header" class="clearfix">
        <i class="el-icon-news" style="color:RGB(255,204,102)"></i>
        <span style="margin-left:10px;">业态信息</span>
      </div>
      <template>
        <el-table border :data="mpiProductInfo" style="width: 100%">
          <el-table-column prop="productName" label="产品名称"></el-table-column>
          <el-table-column prop="productType" label="产品类型"></el-table-column>
          <el-table-column prop="product_line" label="产品系列"></el-table-column>
        </el-table>
      </template>
    </el-card>

    <el-card class="editCard">
      <div slot="header" class="clearfix">
        <i class="el-icon-news" style="color:RGB(255,204,102)"></i>
        <span style="margin-left:10px;">标段信息</span>
      </div>
      <template>
        <el-table border :data="mpiSectionInfo" style="width: 100%">
          <el-table-column prop="sectionName" label="标段名称"></el-table-column>
          <el-table-column prop="bldName" label="对应楼栋"></el-table-column>
          <el-table-column prop="productName" label="产品名称"></el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
import FormItem from "./FormItem";
import { mapState } from "vuex";

export default {
  name: "BasicInfo",
  props: ["id", "mode"],
  components: { FormItem },
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      outline_stepInfo: state => state.outline_stepInfo,
      mpiProjectInfo: state => state.outline_info.mpiProjectInfo,
      mpiProductInfo: state => state.outline_info.mpiProductInfo,
      mpiSectionInfo: state => state.outline_info.mpiSectionInfo,
    })
  },
  created() {
    // this.stages=this.outline_info.stagesValue;
    // this.building=this.outline_info.buildingValue;
    
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
