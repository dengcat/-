<template>
  <div class="app-container" v-loading="loading">
    <el-tabs v-model="activeName" >
      <el-tab-pane v-for="item in reportClassList" :label="item.reportClass" :key="item.id" :name="item.reportClass">
        <keep-alive>
          <reportlist  v-if="activeName==item.reportClass" :reportClass="item.reportClass" :reportClassGuid="item.id" />
        </keep-alive>  
      </el-tab-pane>      
    </el-tabs>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import reportlist from "./components/reportlist";
import { getReportClassList} from '@/api/mdmreport'

export default {
  components: { reportlist },
  name: 'Report',
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info',
        2: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {    
    return {
      reportClassList:[],
      activeName: '',
      loading:false
    }      
  },
  computed: {
  },
  created() {
    this.loading=true
    this.getList();
  },
  methods: {
    getList() {         
      getReportClassList().then(response => {       
        this.reportClassList = response.data.result ;    
        this.activeName = this.reportClassList[0]. reportClass  
        this.loading=false
      })
    }
  }
}
</script>
