<template>
  <div>
    <el-tabs size="mini" :value="activeName" @tab-click="handleClick" type="card" @before-leave="tabBeforeLeave">
      <el-tab-pane label="项目指标" name="1">
        <Project-Indicators>
        </Project-Indicators>
      </el-tab-pane>
      <el-tab-pane label="业态指标" name="2">
        <Product-Indicators>
        </Product-Indicators>
      </el-tab-pane>
      
    </el-tabs>
  </div>
</template>

<script>
import FormItem from './FormItem'
import ProjectIndicators from './ProjectIndicators'
import ProductIndicators from './ProductIndicators'
import { mapState } from 'vuex'
export default {
  name: "BusinessIndicators",
  props:['step','childrenStep','id'],
  components:{ProjectIndicators,ProductIndicators},
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
        mpiVersionInfo: state => state.outline_info.mpiVersionInfo,
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