<template>
  <div class="developmentplan">
    <!--基本信息-->
    <el-card class="editCard">
      <div
        slot="header"
        class="clearfix"
      >
        <i
          class="el-icon-tickets"
          style="color:RGB(255,204,102)"
        ></i>
        <span style="margin-left:10px;">项目开发计划</span>
      </div>
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
        :data="mpiDevPlanInfo"
        border
        stripe
        fit
        style="width: 100%"
        :isTree="true"
        row-key="id"
        :isTreeExpandAll="true"
        :highlight-current-row="true"
        :height="tableHeight"
        ref="table"
      >
        <el-table-column
          file-icon="icon icon-file"
          folder-icon="icon icon-folder"
          prop="sectionName"
          label="标段"
          width="120"
          treeKey="bd"
          :expandAll="true"
          fixed
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="productType"
          label="产品类型"
          width="100"
          fixed
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="productName"
          label="产品名称"
          width="100"
          fixed
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="bldName"
          label="楼栋"
          width="100"
          fixed
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column label="土地获取" width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.landSourceDate | dateFormat }}
            <!-- {{scope.row.landSourceDate? scope.row.landSourceDate: scope.row.landSourceDate | moment("YYYY-MM-DD")}} -->
            <!-- <edit-grid-item :key="scope.row.id"  name="email" v-model="scope.row.landSourceDate" @change="(val) => handleChange(val,scope,'landSourceDate')" :isEdit="columnEdit(scope.row,'土地获取')" type="DatePicker"></edit-grid-item> -->
          </template>
        </el-table-column>
        <el-table-column label="国有土地使用证" width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.landUseCerDate | dateFormat }}
            <!-- {{scope.row.landUseCerDate? scope.row.landUseCerDate:(scope.row.landUseCerDate | moment("YYYY-MM-DD"))}} -->

            <!-- <edit-grid-item v-model="scope.row.landUseCerDate" @change="(val) => handleChange(val,scope,'landUseCerDate')" :isEdit="columnEdit(scope.row,'国有土地使用证')" type="DatePicker"></edit-grid-item> -->
          </template>
        </el-table-column>
        <el-table-column label="建设工程施工许可证获取" width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.bldLicDate | dateFormat }}
            <!-- {{scope.row.bldLicDate? scope.row.bldLicDate:(scope.row.bldLicDate | moment("YYYY-MM-DD"))}} -->
            <!-- <edit-grid-item v-model="scope.row.bldLicDate" @change="(val) => handleChange(val,scope,'bldLicDate')"  :isEdit="columnEdit(scope.row,'建设工程施工许可证获取')" type="DatePicker"></edit-grid-item> -->
          </template>
        </el-table-column>
        <el-table-column label="第一笔融资提取时间"  width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.firstFinDate | dateFormat }}
            <!-- {{scope.row.firstFinDate? scope.row.firstFinDate:(scope.row.firstFinDate | moment("YYYY-MM-DD"))}} -->
            <!-- <edit-grid-item v-model="scope.row.firstFinDate" @change="(val) => handleChange(val,scope,'firstFinDate')" :isEdit="columnEdit(scope.row,'第一笔融资提取时间')" type="DatePicker"></edit-grid-item> -->
          </template>
        </el-table-column>
        <el-table-column label="项目开工"  width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.projSWDate | dateFormat }}
            <!-- {{scope.row.projSWDate? scope.row.projSWDate:(scope.row.projSWDate | moment("YYYY-MM-DD"))}} -->
            <!-- <edit-grid-item v-model="scope.row.projSWDate" @change="(val) => handleChange(val,scope,'projSWDate')" :isEdit="columnEdit(scope.row,'项目开工')" type="DatePicker"></edit-grid-item> -->
          </template>
        </el-table-column>
        <el-table-column label="示范区完工开放"  width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.demAODate | dateFormat }}
            <!-- {{scope.row.demAODate? scope.row.demAODate:(scope.row.demAODate | moment("YYYY-MM-DD"))}} -->
            <!-- <edit-grid-item v-model="scope.row.demAODate" @change="(val) => handleChange(val,scope,'demAODate')" :isEdit="columnEdit(scope.row,'示范区完工开放')" type="DatePicker"></edit-grid-item> -->
          </template>
        </el-table-column>
        <el-table-column label="预售证获取" width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.cerSourceDate | dateFormat }}
            <!-- {{scope.row.cerSourceDate? scope.row.cerSourceDate:(scope.row.cerSourceDate | moment("YYYY-MM-DD"))}} -->
            <!-- <edit-grid-item v-model="scope.row.cerSourceDate" @change="(val) => handleChange(val,scope,'cerSourceDate')" :isEdit="columnEdit(scope.row,'预售证获取')" type="DatePicker"></edit-grid-item> -->
          </template>
        </el-table-column>
        <el-table-column label="开盘" width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.openingdate | dateFormat }}
            <!-- {{scope.row.openingdate? scope.row.openingdate:(scope.row.openingdate | moment("YYYY-MM-DD"))}} -->
            <!-- <edit-grid-item v-model="scope.row.openingdate"  @change="(val) => handleChange(val,scope,'openingdate')"  :isEdit="columnEdit(scope.row,'开盘')" type="DatePicker"></edit-grid-item> -->
          </template>
        </el-table-column>
        <el-table-column label="主体结构封顶" width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.mainStrCapDate | dateFormat }}
            <!-- {{scope.row.mainStrCapDate? scope.row.mainStrCapDate:(scope.row.mainStrCapDate | moment("YYYY-MM-DD"))}} -->
            <!-- <edit-grid-item v-model="scope.row.mainStrCapDate"  @change="(val) => handleChange(val,scope,'mainStrCapDate')"  :isEdit="columnEdit(scope.row,'主体结构封顶')" type="DatePicker"></edit-grid-item> -->
          </template>
        </el-table-column>
        <el-table-column label="竣工备案"  width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.projComRecDate | dateFormat }}
            <!-- {{scope.row.projComRecDate? scope.row.projComRecDate:(scope.row.projComRecDate | moment("YYYY-MM-DD"))}} -->
            <!-- <edit-grid-item v-model="scope.row.projComRecDate"  @change="(val) => handleChange(val,scope,'projComRecDate')"  :isEdit="columnEdit(scope.row,'竣工备案')" type="DatePicker"></edit-grid-item> -->
          </template>
        </el-table-column>
        <el-table-column label="结转交付"  width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.carryForDate | dateFormat }}
            <!-- {{scope.row.carryForDate? scope.row.carryForDate: (scope.row.carryForDate | moment("YYYY-MM-DD"))}} -->
            <!-- <edit-grid-item v-model="scope.row.carryForDate"  @change="(val) => handleChange(val,scope,'carryForDate')" :isEdit="columnEdit(scope.row,'结转交付')" type="DatePicker"></edit-grid-item> -->
          </template>
        </el-table-column>
        <el-table-column label="整体结算"  width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.allAccDate | dateFormat }}
            <!-- {{scope.row.allAccDate | moment("YYYY-MM-DD")}} -->
            <!-- <edit-grid-item v-model="scope.row.allAccDate"  @change="(val) => handleChange(val,scope,'allAccDate')" :isEdit="columnEdit(scope.row,'整体结算')" type="DatePicker"></edit-grid-item> -->
          </template>
        </el-table-column>
        <el-table-column label="大确权"  width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.bigCTDate | dateFormat }}            
            <!-- {{scope.row.bigCTDate | moment("YYYY-MM-DD")}} -->
            <!-- <edit-grid-item v-model="scope.row.bigCTDate" @change="(val) => handleChange(val,scope,'bigCTDate')" :isEdit="columnEdit(scope.row,'大确权')" type="DatePicker"></edit-grid-item> -->
          </template>
        </el-table-column>
        <el-table-column label="小确权"  width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.smallCTdate | dateFormat }}            
            <!-- {{scope.row.smallCTdate | moment("YYYY-MM-DD")}} -->
            <!-- <edit-grid-item v-model="scope.row.smallCTdate"  @change="(val) => handleChange(val,scope,'smallCTdate')" :isEdit="columnEdit(scope.row,'小确权')" type="DatePicker"></edit-grid-item> -->
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            fixed="right"
          >
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text">填写</el-button>
          </template>
          </el-table-column>
      </el-table>
      </lazy-render>
      <!-- 编辑填写页面 -->
      <el-dialog v-if="editRowInfo" class="editform"
      :close-on-click-modal="false"
        :title="`${editRowInfo.sectionName}${editRowInfo.bldName ? `-${editRowInfo.bldName}` : '' }`"
        :visible.sync="dialogVisible"
        width="900px"
        :before-close="handleClose">
        <div class="formitemdiv">
          <form-item label="标段" v-model="editRowInfo.sectionName" :disabled="true"></form-item>
          <form-item label="产品类型" v-model="editRowInfo.productType" :disabled="true"></form-item>
          <form-item label="产品名称" v-model="editRowInfo.productName" :disabled="true"></form-item>
          <form-item label="楼栋" v-model="editRowInfo.bldName" :disabled="true"></form-item>
          <form-item label="土地获取" v-model="editRowInfo.landSourceDate" type="DatePicker" :disabled="!columnEdit(editRowInfo,'土地获取')"></form-item>
          <form-item label="国有土地使用证" v-model="editRowInfo.landUseCerDate" type="DatePicker" :disabled="!columnEdit(editRowInfo,'国有土地使用证')"></form-item>
          <form-item label="建设工程施工许可证获取" v-model="editRowInfo.bldLicDate" type="DatePicker" :disabled="!columnEdit(editRowInfo,'建设工程施工许可证获取')"></form-item>
          <form-item label="第一笔融资提取时间" v-model="editRowInfo.firstFinDate" type="DatePicker" :disabled="!columnEdit(editRowInfo,'第一笔融资提取时间')"></form-item>
          <form-item label="项目开工" v-model="editRowInfo.projSWDate" type="DatePicker" :disabled="!columnEdit(editRowInfo,'项目开工')"></form-item>
          <form-item label="示范区完工开放" type="DatePicker" v-model="editRowInfo.demAODate" :disabled="!columnEdit(editRowInfo,'示范区完工开放')"></form-item>
          <form-item label="预售证获取" type="DatePicker" v-model="editRowInfo.cerSourceDate" :disabled="!columnEdit(editRowInfo,'预售证获取')"></form-item>
          <form-item label="开盘" type="DatePicker" v-model="editRowInfo.openingdate" :disabled="!columnEdit(editRowInfo,'开盘')"></form-item>
          <form-item label="主体结构封顶" type="DatePicker" v-model="editRowInfo.mainStrCapDate" :disabled="!columnEdit(editRowInfo,'主体结构封顶')"></form-item>
          <form-item label="竣工备案" type="DatePicker" v-model="editRowInfo.projComRecDate" :disabled="!columnEdit(editRowInfo,'竣工备案')"></form-item>
          <form-item label="结转交付" type="DatePicker" v-model="editRowInfo.carryForDate" :disabled="!columnEdit(editRowInfo,'结转交付')"></form-item>
          <form-item label="整体结算" type="DatePicker" v-model="editRowInfo.allAccDate" :disabled="!columnEdit(editRowInfo,'整体结算')"></form-item>
          <form-item label="大确权" type="DatePicker" v-model="editRowInfo.bigCTDate" :disabled="!columnEdit(editRowInfo,'大确权')"></form-item>
          <form-item label="小确权" type="DatePicker" v-model="editRowInfo.smallCTdate" :disabled="!columnEdit(editRowInfo,'小确权')"></form-item>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave()">确定</el-button>
          <el-button type="primary" @click="handleSave('next')">确定并填写下一条</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import FormItem from "./FormItem";
import { mapState } from "vuex";
import EditGridItem from "./EditGridItem";
import mixin_commom from '@/utils/mixin_commom'
import {treeToArrayNoParent} from '@/utils'
import moment from 'moment'
import { VclTable } from "vue-content-loading";


export default {
  name: "DevelopmentPlan",
  props: ["id", "mode"],
  mixins:[mixin_commom],
  components: { FormItem, EditGridItem, VclTable  },
  data() {
    return {
      data: [],
      currEditRow:undefined,  // 当前选中编辑行
      dialogVisible: false,
      editRowInfo: undefined,
      pageLoading:true,
    };
  },
  filters:{
    dateFormat(val,type){
      if(!type){
        type = 'YYYY-MM-DD'
      }
      if(val){
       return moment(val).format(type)
      }
      else{
        return ''
      }
    }
  },
  computed: {
    tableHeight:function(){
      return this.clientHeight -280
    },
    arrData: function(){
      return treeToArrayNoParent(this.mpiDevPlanInfo)
    },
    ...mapState({
      outline_stepInfo: state => state.outline_stepInfo,
      mpiProjectInfo: state => state.outline_info.mpiProjectInfo,
      mpiProductInfo: state => state.outline_info.mpiProductInfo,
      mpiSectionInfo: state => state.outline_info.mpiSectionInfo,
      mpiDevPlanInfo: state => state.outline_info.mpiDevPlanInfo,
    })
  },
  methods:{
    handleEdit(row){
      this.editRowInfo = Object.assign({}, row)
      this.currEditRow = row 
      this.dialogVisible = true
    },
    handleClose(){
      this.editRowInfo = undefined
      this.currEditRow = undefined
      this.dialogVisible = false
    },
    getEditState(row,column){
      const arrBdEditColumn = ['土地获取','国有土地使用证','建设工程施工许可证获取','第一笔融资提取时间','项目开工','示范区完工开放','主体结构封顶','整体结算','大确权','小确权']
      const arrLdEditColumn = ['预售证获取','开盘','竣工备案','结转交付']
      let result = false
      // 非末级
      if(row.isEdit && row.children && row.children.length > 0 && arrBdEditColumn.indexOf(column)>=0){
        result = true
      }
      else if(row.isEdit && (!row.children || row.children.length == 0) && arrLdEditColumn.indexOf(column)>=0) {
        // 末级
        result = true
      }
      return result
    },
    // 是否可编辑
    columnEdit(row,type){
      let result={
        '土地获取': false,
        '国有土地使用证': false,
        '建设工程施工许可证获取': false,
        '第一笔融资提取时间': false,
        '项目开工': false,
        '示范区完工开放': false,
        '主体结构封顶': false,
        '整体结算': false,
        '大确权': false,
        '小确权': false,
        '预售证获取': false,
        '开盘': false,
        '竣工备案': false,
        '结转交付': false
      }
      if(row.children && row.children.length > 0){
        result={
          '土地获取': true,
          '国有土地使用证': true,
          '建设工程施工许可证获取': true,
          '第一笔融资提取时间': true,
          '项目开工': true,
          '示范区完工开放': true,
          '主体结构封顶': true,
          '整体结算': true,
          '大确权': true,
          '小确权': true,
          '预售证获取': false,
          '开盘': false,
          '竣工备案': false,
          '结转交付': false
        }
      }
      else{
        result={
          '土地获取': false,
          '国有土地使用证': false,
          '建设工程施工许可证获取': false,
          '第一笔融资提取时间': false,
          '项目开工': false,
          '示范区完工开放': false,
          '主体结构封顶': false,
          '整体结算': false,
          '大确权': false,
          '小确权': false,
          '预售证获取': true,
          '开盘': true,
          '竣工备案': true,
          '结转交付': true
        }
      }
      return result[type]
    },
    handleChange(val,scope,prop){
      const updateChildren = ['土地获取','国有土地使用证','建设工程施工许可证获取','第一笔融资提取时间','项目开工','示范区完工开放','主体结构封顶','整体结算','大确权','小确权']
      const updateParent = ['预售证获取','开盘','竣工备案','结转交付']
      if(updateChildren.indexOf(scope.column.label)>=0){
        scope.row.children.forEach(item =>{
          this.$set(item,prop,val)
        })
      }
      else if(updateParent.indexOf(scope.column.label)>=0){
        // 父节点
        const parentNode = this.mpiDevPlanInfo.find(item =>{
          return item.children.some(childrenItem => {
            return childrenItem.id === scope.row.id
          })
        })
        // 所有子节点的最小时间
        let minValue = val
        if(parentNode && parentNode.children){
          parentNode.children.forEach(item => {
            if(item[prop] && item[prop]< minValue){
              minValue = item[prop]
            }
          })
          parentNode[prop] = minValue
        }
        
      }

      this.validate()
    },
    handleSave(type){
      // 填写保存重新计算父级与兄弟节点
      const updateChildren = [
          {key:'landSourceDate', name :'土地获取'},
          {key:'landUseCerDate', name :'国有土地使用证'},
          {key:'bldLicDate', name :'建设工程施工许可证获取'},
          {key:'firstFinDate', name :'第一笔融资提取时间'},
          {key:'projSWDate', name :'项目开工'},
          {key:'demAODate', name :'示范区完工开放'},
          {key:'mainStrCapDate', name :'主体结构封顶'},
          {key:'allAccDate', name :'整体结算'},
          {key:'bigCTDate', name :'大确权'},
          {key:'smallCTdate', name :'小确权'}
        ]
      const updateParent = [
          {key:'cerSourceDate', name :'预售证获取'},
          {key:'openingdate', name :'开盘'},
          {key:'projComRecDate', name :'竣工备案'},
          {key:'carryForDate', name :'结转交付'}
        ]
      this.currEditRow = Object.assign(this.currEditRow, this.editRowInfo)
      // 更新子级
      if(this.currEditRow && this.currEditRow.children && this.currEditRow.children.length > 0){
        updateChildren.forEach(updateChildrenItem => {
          this.currEditRow.children.forEach(item =>{
            this.$set(item,updateChildrenItem.key,this.editRowInfo[updateChildrenItem.key])
          })
        })
      }
      // 更新父级
      // 父节点
      const parentNode = this.mpiDevPlanInfo.find(item =>{
        return item.children.some(childrenItem => {
          return childrenItem.id === this.editRowInfo.id
        })
      })
      if(parentNode && parentNode.children){
      // 所有子节点的最小时间
      updateParent.forEach(parentItem =>{
        let minValue
        parentNode.children.forEach(item => {
            if(item[parentItem.key] && (item[parentItem.key] < minValue || minValue===undefined)){
              minValue = item[parentItem.key]
            }
          })
          parentNode[parentItem.key] = minValue
      })
      }
      
      

      // 保存后清空或者继续下一条
      if(type==='next'){
        const currIndex = this.arrData.findIndex(item => {
          return item.id === this.currEditRow.id
        })
        if(currIndex+1 < this.arrData.length){
          const nextRow = this.arrData[currIndex+1]
          this.currEditRow = this.arrData[currIndex+1]
          this.editRowInfo = Object.assign({}, this.arrData[currIndex+1])

        }
        else{
          // 全部填写完成
        }
        
      }
      else{
        this.currEditRow = undefined
        this.editRowInfo = undefined
        this.dialogVisible = false
      }
    },
    getNodeById(){
      // 通过ID 获取树节点

    },
    validate(){
      this.$validator.validate().then(
        (result) =>{
          if(result){
            
          }
          else{
            
          }
        }
      )
    }
    
  },
  created() {
    // this.pageLoading = false
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
.developmentplan{
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
