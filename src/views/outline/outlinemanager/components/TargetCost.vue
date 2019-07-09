<template>
  <div class="targetcost">
    <el-card class="editCard">
      <div
        slot="header"
        class="clearfix"
      >
        <i
          class="el-icon-news"
          style="color:RGB(255,204,102)"
        ></i>
        <span style="margin-left:10px;">目标成本</span>
      </div>
      <ul class="tjList">
        <li><span>版本号:</span><span style="color:#40a9ff">CS00</span><span>建筑面积:</span><span style="color:#40a9ff">{{(showData && showData.length>0? showData[0].buildArea : 0) | numberFormat}}㎡</span><span>可售面积:</span><span style="color:#40a9ff">{{(showData && showData.length>0? showData[0].saleArea : 0) | numberFormat}}㎡</span></li>
        <!-- <li><span>版本号:</span><span style="color:#40a9ff">CS01</span><span>建筑面积:</span><span style="color:#40a9ff">0.00㎡</span><span>可售面积:</span><span style="color:#40a9ff">0.00㎡</span></li> -->
      </ul>
      <template>
        <lazy-render
          :time="300"
          :immediately="true"
        >
          <vcl-table
            :speed="1"
            width="100%"
            height="100%"
            slot="tip"
            :rows="10"
            :columns="10"
          ></vcl-table>
          <el-bigdata-table
            :height="tableHeight"
            :data="showData"
            border
            fit
            style="width: 100%"
            :isTree="true"
            row-key="id"
            :isTreeExpandAll="true"
            :highlight-current-row="false"
            header-row-class-name="b_blue"
            stripe
          >
            <el-table-column
              file-icon="icon icon-file"
              folder-icon="icon icon-folder"
              prop="costName"
              label="科目"
              width="220"
              treeKey="costName"
              :expandAll="true"
              :show-overflow-tooltip="true"
              fixed
            >
            </el-table-column>
            <el-table-column
              prop="costCode"
              label="科目编号"
              width="220"
              :tree="true"
              fixed
            ></el-table-column>
            <el-table-column
              prop="department"
              label="责任部门"
              width="180"
            >
            </el-table-column>
            <el-table-column label="CS00">
              <el-table-column
                label="成本(万元)"
                header-align="center"    :show-overflow-tooltip="true"       align="right"
                width="100"
              >
                <template slot-scope="scope">
                  {{scope.row.tcCost | numberFormat}}
                </template>
              </el-table-column>

              <el-table-column
                label="建筑单方(元/平)"
                header-align="center"    :show-overflow-tooltip="true"       align="right"
                width="100"
              >
                <template slot-scope="scope">
                  {{scope.row.tcBuildPrice | numberFormat}}
                </template>
              </el-table-column>
              <el-table-column
                label="可售单方(成本)(元/平)"
                header-align="center"    :show-overflow-tooltip="true"       align="right"
                width="100"
              >
                <template slot-scope="scope">
                  {{scope.row.tcSalePrice | numberFormat}}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="CS01">
              <el-table-column
                prop="qdCost"
                label="成本(万元)"
                header-align="center"    :show-overflow-tooltip="true"       align="right"
                width="100"
              >
                <template slot-scope="scope">
                  {{scope.row.qdCost | numberFormat}}
                </template>
              </el-table-column>

              <el-table-column
                prop="qdBuildPrice"
                label="建筑单方(元/平)"
                header-align="center"    :show-overflow-tooltip="true"       align="right"
                width="100"
              >
                <template slot-scope="scope">
                  {{scope.row.qdBuildPrice | numberFormat}}
                </template>
              </el-table-column>
              <el-table-column
                prop="qdSalePrice"
                label="可售单方(成本)(元/平)"
                header-align="center"    :show-overflow-tooltip="true"       align="right"
                width="100"
              >
                <template slot-scope="scope">
                  {{scope.row.qdSalePrice | numberFormat}}
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column label="差异变动">
              <el-table-column
                prop="balance"
                label="差额"
                header-align="center"    :show-overflow-tooltip="true"       align="right"
                width="100"
              >
                <template slot-scope="scope">
                  {{scope.row.balance | numberFormat}}
                </template>
              </el-table-column>
              <el-table-column
                prop="varAnalysis"
                label="变动分析"
                width="100"
                :show-overflow-tooltip="true"
              >
              </el-table-column>

            </el-table-column>
            <el-table-column
              label="填写"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  @click="handleEdit(scope.row)"
                  type="text"
                >填写</el-button>
              </template>
            </el-table-column>
          </el-bigdata-table>
        </lazy-render>
      </template>
      <!-- 编辑填写页面 -->
      <el-dialog
      :close-on-click-modal="false"
        top="50px"
        v-if="editRowInfo"
        :title="`${editRowInfo.costName}`"
        :visible="dialogVisible"
        width="900px"
      >
        <div class="formitemdiv">
          <form-item
            label="科目"
            v-model="editRowInfo.costName"
            :disabled="true"
          ></form-item>
          <form-item
            label="科目编号"
            v-model="editRowInfo.costCode"
            :disabled="true"
          ></form-item>
          <form-item
            label="责任部门"
            v-model="departmentObject"
            type="select"
            :options="departmentList"
            :normalizer="normalizer"
            value-format="object"
          ></form-item>
          <form-item
            label="差额"
            type="number"
            v-model="editRowInfo.balance"
            :disabled="true"
          ></form-item>
          <form-item
            userClass="formitemoneline"
            label="变动分析"
            type="textarea"
            :show-overflow-tooltip="true"
            v-model="editRowInfo.varAnalysis"
          ></form-item>
          <el-divider content-position="left">CS00</el-divider>
          <form-item
            label="成本(万元)"
            v-model="editRowInfo.tcCost"
            type="number"
          ></form-item>
          <form-item
            label="建筑单方(元/平)"
            v-model="editRowInfo.tcBuildPrice"
            type="number"
            :disabled="true"
          ></form-item>
          <form-item
            label="可售单方(成本)(元/平)"
            v-model="editRowInfo.tcSalePrice"
            type="number"
            :disabled="true"
          ></form-item>
          <el-divider content-position="left">CS01</el-divider>
          <form-item
            label="成本(万元)"
            v-model="editRowInfo.qdCost"
            type="number"
          ></form-item>
          <form-item
            label="建筑单方(元/平)"
            v-model="editRowInfo.qdBuildPrice"
            type="number"
            :disabled="true"
          ></form-item>
          <form-item
            label="可售单方(成本)(元/平)"
            v-model="editRowInfo.qdSalePrice"
            type="number"
            :disabled="true"
          ></form-item>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSave()"
          >确定</el-button>
          <el-button
            type="primary"
            @click="handleSave('next')"
          >确定并填写下一条</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import mixin_commom from "@/utils/mixin_commom";
import EditGridItem from "./EditGridItem";
import DynamicsColumn from "./DynamicsColumn";
import cloneDeep from "lodash/cloneDeep";
import FormItem from "./FormItem";
import { treeToArrayNoParent } from "@/utils";
import { getDepartmentByBuGuid } from "@/api/outLineManager";
import { VclTable } from "vue-content-loading";

const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

export default {
  name: "TargetCost",
  components: { EditGridItem, DynamicsColumn, FormItem, VclTable },
  mixins: [mixin_commom],
  data() {
    return {
      year: 4,
      wd: "季度",
      data: [],
      tjData: [
        {
          bbh: "CS00",
          jzmj: "",
          ksmj: ""
        },
        {
          bbh: "CS01",
          jzmj: "",
          ksmj: ""
        }
      ],
      currEditRow: undefined, // 当前选中编辑行
      dialogVisible: false,
      editRowInfo: undefined,
      departmentObject: undefined,
      departmentList: []
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
  mounted() {
    getDepartmentByBuGuid(this.mpiVersionInfo.buGuid).then(response => {
      this.departmentList = response.data.result;
    });
  },
  computed: {
    tableHeight: function() {
      return this.clientHeight - 400;
    },
    currentYear: function(){
      if(this.mpiVersionInfo.year){
        return this.mpiVersionInfo.year
      }
      else{
        return currentYear
      }
    },
    ...mapState({
      outline_stepInfo: state => state.outline_stepInfo,
      mpiTargetCostInfo: state => state.outline_info.mpiTargetCostInfo,
      mpiVersionInfo: state => state.outline_info.mpiVersionInfo
    }),
    showData() {
      return this.mpiTargetCostInfo;
    },
    arrData() {
      return treeToArrayNoParent(this.showData);
    }
  },
  watch: {},
  methods: {
    handleChange() {
      // const dynamicsData = {}
      // this.$set(dynamicsData)
      // this.data = Object.assign({},this.data,)
    },
    handleMouseEnter(row, column, cell, event) {
      return false;
    },
    handleEdit(row) {
      this.currEditRow = row;
      this.editRowInfo = cloneDeep(row);
      if (this.editRowInfo.department && this.editRowInfo.departmentCode) {
        this.departmentObject = {
          buName: this.editRowInfo.department,
          orgID: this.editRowInfo.departmentCode
        };
      } else {
        this.departmentObject = undefined;
      }

      this.dialogVisible = true;
    },
    handleSave(type) {
      this.currEditRow = Object.assign(this.currEditRow, this.editRowInfo, {
        department: this.departmentObject ? this.departmentObject.buName : null,
        departmentCode: this.departmentObject
          ? this.departmentObject.orgID
          : null
      });
      this.departmentObject = undefined;
      // 更新父级
      // 父节点
      const currIndex = this.arrData.findIndex(item => {
        return item.id === this.currEditRow.id;
      });
      this.updateParentNodes(this.arrData[currIndex]);
      // 保存后清空或者继续下一条
      if (type === "next") {
        if (currIndex + 1 < this.arrData.length) {
          const nextRow = this.arrData.find((item, index) => {
            return (
              index > currIndex && (!item.children || item.children.length <= 0)
            );
          });
          this.currEditRow = nextRow;
          this.editRowInfo = cloneDeep(nextRow);
        } else {
          // 全部填写完成
        }
      } else {
        this.currEditRow = undefined;
        this.editRowInfo = undefined;
        this.dialogVisible = false;
      }
    },
    // 更新父级的合计
    updateParentNodes(row) {
      // 是否有父级
      if (!row.parentCode || row.parentCode === "") {
        return;
      }
      // 更新当前行的父级
      const sumObj = {
        qdCost: 0,
        tcCost: 0
      };
      this.arrData.forEach(element => {
        if (element.parentCode === row.parentCode) {
          Object.keys(sumObj).forEach(item => {
            if (element[item]) {
              sumObj[item] = sumObj[item] + element[item];
            }
          });
        }
      });

      let parentNode = this.arrData.find(element => {
        return element.costCode === row.parentCode;
      });

      parentNode = Object.assign(parentNode, sumObj);

      // 递归更新
      this.updateParentNodes(parentNode);
    },
    normalizer(node) {
      return {
        id: node.orgID,
        label: node.buName,
        children: node.children
      };
    }
  }
};
</script>

<style>
.b_blue {
  background-color: rgb(192, 228, 251);
  text-align: center;
}
</style>

<style lang="scss">
.targetcost {
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: unset !important;
  }
}
</style>

<style lang="scss" scoped>
.tjList {
  list-style: none;
  margin: 0px;
  font-size: 12px;
}
.tjList li {
  height: 28px;
  padding: 5px;
  span {
    margin: 5px;
  }
}
</style>


<style rel="stylesheet/scss" lang="scss" scoped>
.formitemdiv {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  // justify-content:center;
  margin-left: 20px;
  margin-right: 20px;
}
.formitem {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 2px 20px;
  width: calc(33.33% - 40px);
}

.formitem_div {
  line-height: 28px;
  flex: 0 0 120px;
  font-size: small;
}
.formitemoneline {
  align-items: flex-start;
  margin: 2px 20px;
  width: calc(100% - 40px);
}
.cell-edit-input .el-input,
.el-input__inner {
  width: 100%;
}
.cell-icon {
  cursor: pointer;
  color: #fff;
}
.el-row {
  margin-bottom: 5px;
}
.formiteminline {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  // justify-content:center;
  align-items: flex-start;
}
.fixButton {
  right: 0px;
  left: 0px;
  position: fixed;
  bottom: 0;
  background: #fff;
  z-index: 300;
  height: 47px;
  margin-top: 10px;
  padding-top: 18px;
  border: 0;
  border-top: solid 1px #e9ebee;
}
.error_span {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  left: 0;
}
.el-card {
  border-radius: 0px !important;
  overflow: unset;
}
.date_width {
  width: 245px;
}
</style>


<style rel="stylesheet/scss" lang="scss" scoped>
.formitemdiv {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  // justify-content:center;
  margin-left: 20px;
  margin-right: 20px;
}
.formitem {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 2px 20px;
  width: calc(50% - 40px);
}
.formitem_div {
  line-height: 28px;
  flex: 0 0 160px;
  font-size: small;
}

.formitemoneline {
  align-items: flex-start;
  margin: 2px 20px;
  width: calc(100% - 40px);
}
.cell-edit-input .el-input,
.el-input__inner {
  width: 100%;
}
.cell-icon {
  cursor: pointer;
  color: #fff;
}
.el-row {
  margin-bottom: 5px;
}
.formiteminline {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  // justify-content:center;
  align-items: flex-start;
}
.fixButton {
  right: 0px;
  left: 0px;
  position: fixed;
  bottom: 0;
  background: #fff;
  z-index: 300;
  height: 47px;
  margin-top: 10px;
  padding-top: 18px;
  border: 0;
  border-top: solid 1px #e9ebee;
}
.error_span {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  left: 0;
}
.el-card {
  overflow: unset;
}
.date_width {
  width: 245px;
}
</style>

