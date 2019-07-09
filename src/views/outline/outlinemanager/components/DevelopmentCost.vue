<template>
  <div>
    <el-tabs size="mini" :value="activeName" @tab-click="handleClick" type="card" @before-leave="tabBeforeLeave">
      <el-tab-pane label="目标成本" name="1">
        <target-cost v-if="activeName==='1'">
        </target-cost>
      </el-tab-pane>
      <el-tab-pane label="成本支付计划" name="2">
        <cost-pay-plan v-if="activeName==='2'">
        </cost-pay-plan>
      </el-tab-pane>
      <el-tab-pane label="成本税金支付" name="3">
        <cost-taxes-pay v-if="activeName==='3'">
        </cost-taxes-pay>
      </el-tab-pane>
      <el-tab-pane label="成本分摊" name="4">
        <cost-share v-if="activeName==='4'">
        </cost-share>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FormItem from './FormItem'
import TargetCost from './TargetCost'
import CostPayPlan from './CostPayPlan'
import CostTaxesPay from './CostTaxesPay'
import CostShare from './CostShare'
import { mapState } from 'vuex'
export default {
  name: "DevelopmentCost",
  props:['step','childrenStep','id'],
  components:{TargetCost,CostPayPlan,CostTaxesPay,CostShare},
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
  computed: {
    activeName(){
      return `${this.childrenStep}`
    },
    ...mapState(
      {
        outline_stepInfo:state=> state.outline_stepInfo,
        mpiVersionInfo:state=> state.outline_info.mpiVersionInfo,
      }
    )
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