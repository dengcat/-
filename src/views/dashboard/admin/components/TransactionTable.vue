<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="报表名称" min-width="200">
      <template slot-scope="scope">
        <router-link :to="{ path: `/report/detail/${encodeURIComponent(scope.row.url)}`}" tag="a">{{ scope.row.reportname }}</router-link>
      </template>
    </el-table-column>
    <el-table-column label="报表类别" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.reporttype }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchList } from '@/api/transaction'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: [
        {
          reportname: '货值分析报表',
          reporttype: '经营分析报表',
          url: 'http://report.redco.cn/WebReport/ReportServer?reportlet=demo%2Fform%2FCustomer.cpt&op=write'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchList().then(response => {
        this.list = response.data.items.slice(0, 8)
      })
    }
  }
}
</script>
