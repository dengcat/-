<template>
  <div>
    <el-tabs size="mini" :value="activeName" @tab-click="handleClick" type="card" @before-leave="tabBeforeLeave">
      <el-tab-pane label="项目现金流" name="1">
        <Cashflow-Personal>
        </Cashflow-Personal>
      </el-tab-pane>
      <el-tab-pane label="股东层面现金流" name="2">
        <Cashflow-Shareholder>
        </Cashflow-Shareholder>
      </el-tab-pane>
      
    </el-tabs>
  </div>
</template>

<script>
import FormItem from './FormItem'
import CashflowPersonal from './CashflowPersonal'
import CashflowShareholder from './CashflowShareholder'
import { mapState, mapActions } from 'vuex'
import mixin_calc from './mixin_calc'
export default {
  name: "Cashflow",
  props:['step','childrenStep','id'],
  components:{CashflowPersonal,CashflowShareholder},
  mixins: [mixin_calc],
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
        mpiVersionInfo:state=> state.outline_info.mpiVersionInfo
      }
    )
  },
  methods:{
    ...mapActions(['SetOutlineInfo']),
    handleClick(tab, event){
      this.$router.push(`/outline/outlineinfo/${this.mpiVersionInfo.id}?step=${this.step.stepNum}&childrenstep=${tab.name}`)
    },
    tabBeforeLeave(){
      return false
    }
  }
}

</script>