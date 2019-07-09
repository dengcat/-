<template>
  <el-card class="editCard">
    <div
      slot="header"
      class="clearfix"
    >
      <i
        class="el-icon-news"
        style="color:RGB(255,204,102)"
      ></i>
      <span style="margin-left:10px;">融资计划表</span>
    </div>
    <template>
      <el-table
        :data="mpiFinancingPlanInfo"
        border
        fit
        style="width: 100%"
        row-key="id"
        stripe
      >
        <el-table-column
          prop="financingCategory"
          label="融资类别"
          width="150"
        >
        <template slot-scope="scope">
          <EditGridItem
            :value="scope.row.financingCategory"
            @input="val => scope.row.financingCategory = val.id"
            type="select"
            :isEdit="true"
            :options="[{id:'股权融资', label:'股权融资'},{id:'开贷', label:'开贷'},{id:'资管+委贷', label:'资管+委贷'}]"
            :clearable="false"
          ></EditGridItem>
        </template>
        </el-table-column>
        <el-table-column
          prop="currency"
          label="币种"
          width="180"
        >
        <template slot-scope="scope">
          <EditGridItem
            :value="scope.row.currency"
            @input="val => scope.row.currency = val.id"
            type="select"
            :isEdit="true"
            :options="[{id:'RMB', label:'RMB'},{id:'HKD', label:'HKD'},{id:'USD', label:'USD'}]"
            :clearable="false"
          ></EditGridItem>
        </template>
        </el-table-column>
        <el-table-column
          prop="financingScale"
          label="融资规模（万元）"
          width="180"
        >
        <template slot-scope="scope">
          <EditGridItem
            :value="scope.row.financingScale"
            @input="val => scope.row.financingScale = val"
            type="number"
            :isEdit="true"
          ></EditGridItem>
        </template>
        </el-table-column>
        
        <el-table-column
          prop="financingPeriod"
          label="融资期限（年）"
        >
        <template slot-scope="scope">
          <EditGridItem
            :value="scope.row.financingPeriod"
            @input="val => scope.row.financingPeriod = val.id"
            type="select"
            :isEdit="true"
            :options="[{id:'3', label:'3'},{id:'5', label:'5'},{id:'8', label:'8'}]"
            :clearable="false"
          ></EditGridItem>
        </template>
        </el-table-column>
       
          <el-table-column
            prop="rate"
            label="年利率"
          >
        <template slot-scope="scope">
          <EditGridItem
            :value="scope.row.rate"
            @input="val => scope.row.rate = val"
            type="number"
            :isEdit="true"
          ></EditGridItem>
        </template>
          </el-table-column>
          <el-table-column
            prop="rateRules"
            label="利率调整原则"
          >
          <template slot-scope="scope">
          <EditGridItem
            :value="scope.row.rateRules"
            @input="val => scope.row.rateRules = val"
            :isEdit="true"
            ></EditGridItem>
          </template>
          </el-table-column>
          <el-table-column
            prop="poundage"
            label="手续费"
          >
          <template slot-scope="scope">
          <EditGridItem
            :value="scope.row.poundage"
            @input="val => scope.row.poundage = val"
            type="number"
            :isEdit="true"
          ></EditGridItem>
        </template>
          </el-table-column>
          <el-table-column
            prop="interestPayment"
            label="利息支付方式"
          >
          <template slot-scope="scope">
          <EditGridItem
            :value="scope.row.interestPayment"
            @input="val => scope.row.interestPayment = val.id"
            type="select"
            :isEdit="true"
            :options="[{id:'月付', label:'月付'},{id:'季付', label:'季付'},{id:'年付', label:'年付'}]"
            :clearable="false"
          ></EditGridItem>
        </template>
          </el-table-column>
          <el-table-column
            label="操作"
            :width="60"
          >
          <template slot-scope="scope">
            <el-button type="text" @click="handleDelete(scope.row,scope.$index)">删除</el-button>
          </template>
          </el-table-column>
      </el-table>
    </template>
  </el-card>

</template>

<script>
import { mapState } from "vuex";
import EditGridItem from "./EditGridItem";


export default {
  name: "FinancingPlanInfo",
  components: { EditGridItem },
  data() {
    return {
      year: 4,
      wd: "季度",
      data: [],
    };
  },
  computed: {
    ...mapState({
      mpiFinancingPlanInfo: state => state.outline_info.mpiFinancingPlanInfo
    }),
  },
  watch: {
  },
  methods: {
    handleDelete(row,index){
      this.mpiFinancingPlanInfo.splice(index,1)
    }
  }
};
</script>
