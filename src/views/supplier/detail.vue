<template>
  <div v-loading="loading">
    <!--基本信息-->
    <el-card class="editCard">
      <div slot="header" class="clearfix">
        <i class="el-icon-tickets" style="color:RGB(255,204,102)"></i>
        <span style="margin-left:10px;">基本信息</span>
      </div>
      <div class="formitemdiv">
        <form-item Label="注册类型" v-model="supplier.registrationType"></form-item>
        <form-item Label="是否甲方单位" v-model="supplier.isFirstParty"></form-item>
        <form-item Label="供应商编号" v-model="supplier.supplierCode"></form-item>
        <form-item Label="供应商简称" v-model="supplier.supplierShortName"></form-item>
        <form-item Label="供应商名称" v-model="supplier.supplierName"></form-item>
        <form-item Label="供应商类别" v-model="supplier.supplierCategory"></form-item>
        <form-item Label="所属公司" v-model="supplier.companyName"></form-item>
        <form-item Label="服务范围" v-model="supplier.scopeOfService"></form-item>
        <form-item Label="纳税人资格" v-model="supplier.taxpayerRights"></form-item>
        <form-item Label="纳税人识别号" v-model="supplier.taxpayerNumber"></form-item>
        <form-item Label="公司所在地（省）" v-model="supplier.province"></form-item>
        <form-item Label="公司所在地（市）" v-model="supplier.city"></form-item>
        <form-item Label="法人代表" v-model="supplier.legal"></form-item>
        <form-item Label="电话号码" v-model="supplier.phoneNumber"></form-item>
        <form-item Label="授权联系人" v-model="supplier.contact"></form-item>
        <form-item Label="公司注册地址" v-model="supplier.registrationAddress"></form-item>
        <form-item Label="传真号码" v-model="supplier.fax"></form-item>
        <form-item Label="邮政编码" v-model="supplier.postalCode"></form-item>
        <form-item Label="注册资本" v-model="supplier.registeredCapital"></form-item>
        <form-item Label="企业资质" v-model="supplier.enterpriseQualification"></form-item>
        <form-item Label="业务范围" v-model="supplier.ccopeOfBusiness"></form-item>
      </div>
    </el-card>

    <el-card class="editCard">
      <div slot="header" class="clearfix">
        <i class="el-icon-news" style="color:RGB(255,204,102)"></i>
        <span style="margin-left:10px;">银行信息</span>
      </div>
      <template>
        <el-table :data="supplier.bank" style="width: 100%">
          <el-table-column prop="bank" label="开户银行" ></el-table-column>
          <el-table-column prop="accountName" label="银行账号"></el-table-column>
          <el-table-column prop="bankAccount" label="户名" ></el-table-column>
        </el-table>
      </template>
    </el-card>

    <el-card class="editCard">
      <div slot="header" class="clearfix">
        <i class="el-icon-news" style="color:RGB(255,204,102)"></i>
        <span style="margin-left:10px;">税目信息</span>
      </div>
      <template>
        <el-table :data="supplier.taxItem" style="width: 100%">
          <el-table-column prop="taxCategory" label="税种" ></el-table-column>
          <el-table-column prop="rate" label="税率"></el-table-column>
          <el-table-column prop="effectiveTime" label="生效时间" ></el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
import { getSupplierById } from '@/api/supplier'
import FormItem from './components/formitem'

export default {
  name: "SupplierDetail",
  components:{FormItem},
  data() {
    return {
      supplier:{},
      id:this.$route.params.id,
      loading:true
    };
  },
  computed: {
    
  },
  created() {
    this.loading=true
    getSupplierById(this.id).then(
      response => {
        this.supplier = response.data.result
        this.loading = false
      }
    )
  },
  methods: {
     
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
  .el-card__header {
    padding: 10px 20px;
    margin:10px
  }
}
</style>
