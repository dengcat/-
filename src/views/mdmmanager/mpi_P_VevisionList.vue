<template >
<div id='main'>
    <el-table :data="businessData" border >
      <el-table-column type="index" label="序号" >
      <!-- <template slot="append" > <el-checkbox v-model="checked"></el-checkbox> <template> -->
      </el-table-column>
      <el-table-column
        prop="code"
        label="项目编码"
        >
      </el-table-column>
      <el-table-column
        prop="name"
        label="项目名称">
      </el-table-column>
        <el-table-column
        prop="editonName"
        label="版本号">
      </el-table-column>
       <el-table-column
        prop="buName"
        label="所属公司">
      </el-table-column>
       <el-table-column
        label="审核状态">
            <template slot-scope="scope">
              {{ scope.row.approveState|ApproveStateNamelist}}
            </template>
      </el-table-column>
         <el-table-column
        prop="editionCreatedName"
        label="编制人">
      </el-table-column>
         <el-table-column
        label="编制时间"  width='150px'>
              <template slot-scope="scope">
              {{ scope.row.editionCreatedTime | moment("YYYY-MM-DD HH:MM:SS") }}
              <!-- {{moment(scope.row.creationTime,"MM-DD-YYYY")}} -->
            </template>
      </el-table-column>
         <el-table-column
        label="操作" >
              <template slot-scope="scope">
          <el-button type="primary" @click="selectProject(scope.row.name,scope.row.businessDataGUID,scope.row.parentGUID)" >选择</el-button>
            </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10,20,30, 50]"
            :page-size="limit"
            :total="total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
  </div>
</template>
  <script>
  import { GetBusinessData} from "@/api/OutLineManaege";
  import ItemVue from '../layout/components/Sidebar/Item.vue';
   export default {
  name: "VerisionTable",
  components: { },
  props: {},
  data() {
    return{
      activeName: this.$route.params.step,
      businessDataGuid: this.$route.params.businessDataGuid,
      businessData: undefined,
      loading: false,
      total: null,
      limit: 10,
      currentPage: 1,
      pageLoading: false
    }
  },
  filters:{
   ApproveStateNamelist:function(value){
      const statusMap = {
        0: "创建",
        1: "修订中",
        2: "审核中",
        5: "已审核"
      };
      return statusMap[value];
    }
  },
  computed: {},
  created() {
    this.loading=true;
    GetBusinessData({}).then(response=>{
        let result=response.data.result.data;
        var list=[];
      result.forEach(element => {
        var i=0;
        if(element.分期集合) {
        element.分期集合.forEach(ItemVue => {  
          i++;      
            var json={"name":ItemVue.name,"parentGUID":ItemVue.parentGUID,"parentGUID":ItemVue.parentGUID,
            "businessDataGUID":ItemVue.businessDataGUID,"editonName":ItemVue.editonName,"approveState":
            ItemVue.approveState,"editionCreatedTime":ItemVue.editionCreatedTime,
            "editionCreatedName":ItemVue.editionCreatedName,"buName":element.name,"code":element.code}
          list.push(json);
        });
        }
      });
        this.businessData =list;       
       // this.list = response.data.result.items;
        this.total=list.length;
        this.loading = false;          
    })
  },
  methods: {
    selectProject:function(val,businessDataGUID,projectid){
      // alert(val);
       this.$confirm('确定引入“'+val+'”主数据信息？', '', {
          confirmButtonText: '确认并下一步',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
           this.$emit("listToChildEvent",val+"_"+businessDataGUID+"_"+projectid);          
          });
    },
    handleSizeChange:function(val){
      this.limit = val;
      this.initPage();
    },
    handleCurrentChange:function(val){
      this.currentPage = val;
      this.initPage();
    },initPage: function() {
      this.listLoading = true;
    //  getMpi_P_VevisionList({}).then(response=>{
    //     this.businessData = response.data.result;       
    //     this.total=response.data.result.length;
    //     this.loading = false;          
    // })
    }
  }
};
  </script>
  <style lang='scss'>
  // #main{
  //   padding:2rem;
  //   // margin-top: 1rem;
  // }
  </style>
