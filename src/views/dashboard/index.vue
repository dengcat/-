<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole"/> -->
    <el-row :gutter="12" style="margin:20px 20px">
      <el-col :span="24">
        <el-card shadow="always">
          <el-row class="dh" type="flex" :gutter="24">
            <el-col :span="3">
              <router-link to="/mdmdefine/index">
                <svg-icon class="svg-icon" icon-class="mou" /><br >
                <span>维护模板</span>
              </router-link>
            </el-col>
            <el-col :span="3">
              <router-link to="/mdmmanager/index">
                <svg-icon class="svg-icon" icon-class="project" /><br >
                <span>维护项目</span>
              </router-link>
            </el-col>
            <el-col :span="3">
              <router-link to="/setting/userinfo">
                <svg-icon class="svg-icon" icon-class="userdh" /><br >
                <span>用户管理</span>
              </router-link>
            </el-col>
            <el-col :span="3">
              <router-link to="/setting/index">
                <svg-icon class="svg-icon" icon-class="csszdh" /><br >
                <span>参数设置</span>
              </router-link>
            </el-col>
            <el-col :span="3">
              <router-link to="/mdmmanager/index">
                <svg-icon class="svg-icon" icon-class="jkgldh" /><br >
                <span>接口管理</span>
              </router-link>
            </el-col>
            <el-col :span="3">
              <router-link to="/report/index">
                <svg-icon class="svg-icon" icon-class="bbdh" /><br >
                <span>管理报表</span>
              </router-link>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="dcard" shadow="always">
          <div slot="header" class="clearfix">
            <span>数据维护说明</span>
          </div>
          <el-row :gutter="24">
            <el-col :span="24">
              <p>1、力高地产控股集团运营管理中心的运营部作为项目主数据模板和指标字典的维护部门。</p>
              <p>2、城市公司运营中心作为项目主数据的维护部门。</p>
              <p>3、力高地产控股集团总裁办的知识管理部作为项目主数据的初审部门。</p>
              <p>4、力高地产控股集团以及城市公司各责任部门作为项目主数据的审核部门。</p>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="dcard" shadow="always">
          <div slot="header" class="clearfix">
            <span>相关文件</span>
          </div>
          <el-row :gutter="24">
            <el-col :span="24">
              <p>1、<a href="#" @click="downloadFile('【力高主数据管理平台】项目主数据指标库_v1.3.xlsx')">力高集团主数据指标库.xls</a></p>
              <p>2、<a href="#" @click="downloadFile('【力高主数据管理平台】项目主数据指标库_v1.3.xlsx')">主数据管理规范与方法.xls</a></p>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="dcard" shadow="always">
          <div slot="header" class="clearfix">
            <span>常用报表</span>
          </div>
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="date"
              label="报表名称">
              <template slot-scope="scope">
                  <!-- target="_blank" -->
                  <router-link :to="{ path: `/report/detail/${encodeURIComponent(scope.row.url)}`}" tag="a">{{ scope.row.date }}</router-link>
                </template>
              </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import { downloadForFilename } from '@/api/downloadFile'



export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard',
      tableData: [{
          date: '投资指标报表',
          url: 'http://report.redco.cn/WebReport/ReportServer?reportlet=fsy%2FERP%5B5ba1%5D%5B6279%5D%5B6a21%5D%5B5f0f%5D%5B76d1%5D%5B63a7%5D.cpt',
        }, {
          date: '经营决策报表',
          url: 'http://report.redco.cn/WebReport/ReportServer?reportlet=fsy%2FERP%5B5ba1%5D%5B6279%5D%5B6a21%5D%5B5f0f%5D%5B76d1%5D%5B63a7%5D.cpt',

        }, {
          date: '投资收益报表',
          url: 'http://report.redco.cn/WebReport/ReportServer?reportlet=fsy%2FERP%5B5ba1%5D%5B6279%5D%5B6a21%5D%5B5f0f%5D%5B76d1%5D%5B63a7%5D.cpt',

        }, {
          date: '动态成本报表',
          url: 'http://report.redco.cn/WebReport/ReportServer?reportlet=fsy%2FERP%5B5ba1%5D%5B6279%5D%5B6a21%5D%5B5f0f%5D%5B76d1%5D%5B63a7%5D.cpt',

        },]
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  methods:{
    downloadFile: function(fileName){
      // IE下待解决中文问题
      window.location.href = process.env.BASE_API+'/api/File/DownloadFile?name='+encodeURI(fileName)
    }
  },
  created() {
    
  }
}
</script>

<style scoped>
.svg-icon {
  width: 3em;
  height: 3em;
  vertical-align: -0.15em;
  fill: "red";
  overflow: hidden;
}
.dcard{
  margin-top:20px;
}
p{
  color:#777777;
  line-height: 120%;
  text-indent: 1em;
  font-size:9pt;
}
.dh el-col{
  margin:0 auto;
}
</style>
