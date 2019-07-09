<template>
  <div>
    <el-tabs size="mini" :value="activeName" @tab-click="handleClick" type="card" @before-leave="tabBeforeLeave">
      <el-tab-pane label="管理费用" name="1">
        <manager-expense v-if="activeName==='1'">
        </manager-expense>
      </el-tab-pane>
      <el-tab-pane label="管理费用税金" name="2">
        <Manager-Expense-Rate v-if="activeName==='2'">
        </Manager-Expense-Rate>
      </el-tab-pane>
      <el-tab-pane label="营销费用" name="3">
        <Marketing-Expense v-if="activeName==='3'">
        </Marketing-Expense>
      </el-tab-pane>
      <el-tab-pane label="营销费用税金" name="4">
        <Marketing-ExpenseRate v-if="activeName==='4'">
        </Marketing-ExpenseRate>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FormItem from './FormItem'
import ManagerExpense from './ManagerExpense'
import ManagerExpenseRate from './ManagerExpenseRate'
import MarketingExpense from './MarketingExpense'
import MarketingExpenseRate from './MarketingExpenseRate'
import { mapState } from 'vuex'

export default {
  name: "Expense",
  props:['step','childrenStep','id'],
  components:{ManagerExpense,ManagerExpenseRate,MarketingExpense,MarketingExpenseRate},
  data() {
    return {
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
    handleClick(tab, event){
      this.$router.push(`/outline/outlineinfo/${this.mpiVersionInfo.id}?step=${this.step.stepNum}&childrenstep=${tab.name}`)
    },
    tabBeforeLeave(){
      return false
    }
  }
}

</script>