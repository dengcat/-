<template>
  <div class="app-container" style="width:100%;height:100%">
    <!-- <div style="margin-top:20px; margin-bottom:20px">
      <el-select v-model="value">
        <el-option key="力高一期" value="力高一期"  label="力高一期">力高一期</el-option>
        <el-option key="力高二期" value="力高二期"  label="力高二期">力高一期</el-option>
      </el-select>
      <el-button type="primary">确定</el-button>
    </div> -->

    <iframe :src="url" style="width:100%;min-height:700px" frameborder="0" scrolling="no" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'ReportDetail',
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
      url: this.$route.params.url,
      value: '力高一期'
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
