<template>
<div>

   <el-card class="editCard">
    <div
      slot="header"
      class="clearfix"
    >
      <i
        class="el-icon-news"
        style="color:RGB(255,204,102)"
      ></i>
      <span style="margin-left:10px;">业态利润</span>
    </div>
    <template>
      <el-table
        :data="showData"
        border
        fit
        style="width: 100%"
        :isTree="true"
        row-key="id"
        :isTreeExpandAll="true"
        :highlight-current-row="true"
      >
        <el-table-column
          file-icon="icon icon-file"
          folder-icon="icon icon-folder"
          prop="costName"
          label="项目"
          width="220"
          treeKey="costName"
          :expandAll="true"
        ></el-table-column>
        <el-table-column
          v-for="item in dynamicsCol"
          :key="item.productGuid"
          :label="item.productName"
          width="180"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
        <template slot-scope="scope">
          {{scope.row[item.productGuid] | numberFormat}}
        </template>
        </el-table-column>
        <el-table-column
          label="小计"
          width="220"
        ></el-table-column>
      </el-table>
    </template>
  </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import mixin_commom from "@/utils/mixin_commom";
import EditGridItem from "./EditGridItem";
import DynamicsColumn from "./DynamicsColumn";
import FormItem from "./FormItem";
import { treeToArrayNoParent } from "@/utils";
import cloneDeep from "lodash/cloneDeep";



const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

export default {
  name: "ProductIndicators",
  components: { EditGridItem,DynamicsColumn,FormItem },
  mixins: [mixin_commom],
  data() {
    return {
      year: 4,
      wd: "季度",
      currentYear:currentYear,
      data: [
      ],
    };
  },
  filters: {
    dateFormat(val, type) {
      if (!type) {
        type = "YYYY-MM-DD";
      }
      if (val) {
        return moment(val).format(type);
      } else {
        return "";
      }
    },
    numberFormat(val) {
      if (val !== undefined && val !== null) {
        return accounting.formatNumber(val, 2);
      } else {
        return val;
      }
    }
  },
  computed: {
    ...mapState({
      outline_stepInfo: state => state.outline_stepInfo,
      mpiProductInfo: state => state.outline_info.mpiProductInfo,
      mpiYtTargetProfitInfo: state => state.outline_info.mpiYtTargetProfitInfo
    }),
    dynamicsCol: function(){
      if(this.mpiYtTargetProfitInfo && this.mpiYtTargetProfitInfo[0] && this.mpiYtTargetProfitInfo[0].datas){
        return this.mpiYtTargetProfitInfo[0].datas
      }
      else{
        return []
      }
    },
    showData: function() {
      const data = this.mpiYtTargetProfitInfo;
      if (data) {
        const showData = data.map(item => {
          this.updateRowNode(item);
          return item;
        });
        return showData;
      } else {
        return [];
      }
    },
    arrData: function() {
      return treeToArrayNoParent(this.showData);
    },
    tableHeight: function() {
      return this.clientHeight - 340;
    }
  },
  watch: {
  },
  methods: {
    // 递归增加子级节点
    updateRowNode(row) {
      const dynamicsObj = {};
      row.datas.forEach(datasItem => {
        const key = datasItem.productGuid;
        dynamicsObj[key] = datasItem.productCost;
      });
      row = Object.assign(row, dynamicsObj);
      if (row.children && Array.isArray(row.children)) {
        row.children.forEach(childrenitem => {
          this.updateRowNode(childrenitem);
        });
      }
    }
  }
};
</script>

