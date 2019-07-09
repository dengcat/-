<template>
  <div>
    <el-tabs size="mini" :value="activeName" @tab-click="handleClick" type="card" @before-leave="tabBeforeLeave">
      <el-tab-pane label="供货计划表-楼栋" name="1">
        <goods-value-ld v-if="activeName==='1'">
        </goods-value-ld>
      </el-tab-pane>
      <el-tab-pane label="供货计划表-标段" name="2">
        <goods-value-bd v-if="activeName==='2'">
        </goods-value-bd>
      </el-tab-pane>
      <el-tab-pane label="总货值表(测算)" name="3">
        <goods-sum v-if="activeName==='3'">
        </goods-sum>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FormItem from './FormItem'
import GoodsValueLd from './GoodsValueLd'
import GoodsValueBd from './GoodsValueBd'
import GoodsSum from './GoodsSum'
import { mapState } from 'vuex'
export default {
  name: "GoodsValue",
  props:['step','childrenStep','id'],
  components:{FormItem,GoodsValueLd,GoodsValueBd,GoodsSum},
  data() {
    return {
      LdColumn:[
      {
        prop:'bd',
        label:'标段'
      },
      {
        prop:'ld',
        label:'楼栋'
      },
      {
        prop:'bd1',
        label:'产品类型'
      },
      {
        prop:'bd1',
        label:'产品名称'
      },
      {
        prop:'bd1',
        label:'预售证时间'
      },
      {
        prop:'bd1',
        label:'产品类型'
      }
      ]
    }
  },
  updated(){
    console.log('货值更新', new Date().getTime())
  },
  computed: {
    activeName(){
      return `${this.childrenStep}`
    },
    ...mapState({
      outline_stepInfo: state => state.outline_stepInfo,
      mpiProjectInfo: state => state.outline_info.mpiProjectInfo,
      mpiProductInfo: state => state.outline_info.mpiProductInfo,
      mpiSectionInfo: state => state.outline_info.mpiSectionInfo,
      mpiDevPlanInfo: state => state.outline_info.mpiDevPlanInfo,
      mpiSectionPlanInfo: state => state.outline_info.mpiSectionPlanInfo,
      mpiProductPlanInfo: state => state.outline_info.mpiProductPlanInfo,
      mpiBasicPlanInfo: state => state.outline_info.mpiBasicPlanInfo,
      mpiVersionInfo: state => state.outline_info.mpiVersionInfo,
    })
  },
  methods:{
    handleClick(tab, event){
      this.$router.push(`/outline/outlineinfo/${this.mpiVersionInfo.id}?step=${this.step.stepNum}&childrenstep=${tab.name}`)
    },
    tabBeforeLeave(){
      return false
    }
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
