<template>
  <el-table :data="tableData" :key="key" border fit highlight-current-row style="width: 100%">
    <el-table-column prop="name" label="fruitName" width="180"/>
    <el-table-column v-for="o in tableThead" :key="o.key" :label="o.label">
      <template slot-scope="scope">
        {{ scope.row[o.key] }}
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'ReportList',
  directives: {
    waves
  },
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

    }
  },
  computed: {
  },
  created() {
  },
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
  .collapse {
    margin-top: 20px;
  }
</style>
