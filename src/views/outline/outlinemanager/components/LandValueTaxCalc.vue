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
      <span style="margin-left:10px;">土地增值税清算表</span>
    </div>
    <template>
      <el-table
        :data="mpiLandValueTaxCalcInfo"
        border
        fit
        style="width: 100%"
        row-key="id"
        :row-class-name="rowclass"
      >
        <el-table-column
          prop="accountingItem"
          label="核算项"
          width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="sumTax"
          label="合计"
          width="180"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
        <template slot-scope="scope">
          {{scope.row.sumTax | numberFormat}}
        </template>
        </el-table-column>
        <el-table-column
          prop="ordinaryHouse"
          label="普通住宅"
          width="180"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
        <template slot-scope="scope">
          {{scope.row.ordinaryHouse | numberFormat}}
        </template>
        </el-table-column>
        
        <el-table-column
          prop="house"
          label="普通标准以上住宅"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
        <template slot-scope="scope">
          {{scope.row.house | numberFormat}}
        </template>
        </el-table-column>
       
          <el-table-column
            prop="unHouse"
            label="非住宅类"
            header-align="center"    :show-overflow-tooltip="true"       align="right"
          >
          <template slot-scope="scope">
            {{scope.row.unHouse | numberFormat}}
          </template>
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="备注说明"
          >
          </el-table-column>
          <el-table-column
              label="填写"
              fixed="right"
              width="60"
            >
              <template slot-scope="scope">
                <el-button v-if="scope.$index < 3"
                  @click="handleEdit(scope.row, scope.$index)"
                  type="text"
                >填写</el-button>
              </template>
            </el-table-column>
      </el-table>
    </template>
    <!-- 编辑填写页面 -->
      <el-dialog
      :close-on-click-modal="false"
        top="50px"
        v-if="editRowInfo"
        :title="`${editRowInfo.accountingItem}`"
        :visible="dialogVisible"
        width="900px"
      >
        <div class="formitemdiv">
          <form-item
            label="核算项"
            v-model="editRowInfo.accountingItem"
            :disabled="true"
          ></form-item>
          <form-item
            label="普通住宅"
            v-model="editRowInfo.ordinaryHouse"
            type="number"
          ></form-item>
          <form-item
            label="普通标准以上住宅"
            v-model="editRowInfo.house"
            type="number"
          ></form-item>
          <form-item
            label="非住宅类"
            v-model="editRowInfo.unHouse"
            type="number"
          ></form-item>
         <form-item
          userClass="formitemoneline"
            label="备注说明"
            v-model="editRowInfo.remarks"
            type="textarea"
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

</template>

<script>
import { mapState, mapActions } from "vuex";
import EditGridItem from "./EditGridItem";
import cloneDeep from "lodash/cloneDeep";
import FormItem from "./FormItem";
import numeral from "numeral";
import accounting from 'accounting'
import mixin_calc from './mixin_calc'


export default {
  name: "LandValueTaxCalc",
  components: { EditGridItem,FormItem },
  mixins: [mixin_calc],
  data() {
    return {
      year: 4,
      wd: "季度",
      data: [],
      currEditRow: undefined, // 当前选中编辑行
      dialogVisible: false,
      editRowInfo: undefined,
      pageLoading: true
    };
  },
  computed: {
    ...mapState({
      mpiLandValueTaxCalcInfo: state => state.outline_info.mpiLandValueTaxCalcInfo
    }),
  },
  watch: {
  },
  methods: {
    ...mapActions(['SetOutlineInfo']),
    handleEdit(row) {
      this.currEditRow = row;
      this.editRowInfo = cloneDeep(row);
      this.dialogVisible = true;

    },
    handleSave(type) {
      this.currEditRow.ordinaryHouse = this.editRowInfo.ordinaryHouse
      this.currEditRow.house = this.editRowInfo.house
      this.currEditRow.unHouse = this.editRowInfo.unHouse
      this.currEditRow.remarks = this.editRowInfo.remarks
      const house = isNaN(Number(this.currEditRow.house))? 0: Number(this.currEditRow.house)
      const unHouse = isNaN(Number(this.currEditRow.unHouse))? 0: Number(this.currEditRow.unHouse)
      const ordinaryHouse = isNaN(Number(this.currEditRow.ordinaryHouse))? 0: Number(this.currEditRow.ordinaryHouse)
      this.currEditRow.sumTax = house + unHouse + ordinaryHouse
      const mpiLandValueTaxCalcInfo = this.calcTdzzsqs()
      this.SetOutlineInfo({mpiLandValueTaxCalcInfo})
      // 保存后清空或者继续下一条
      if (type === "next") {
        const currIndex = this.mpiLandValueTaxCalcInfo.findIndex(item => {
          return item.id === this.currEditRow.id;
        });
        if (currIndex + 1 < this.mpiLandValueTaxCalcInfo.length) {
          const nextRow = this.mpiLandValueTaxCalcInfo[currIndex + 1];
          this.currEditRow = this.mpiLandValueTaxCalcInfo[currIndex + 1];
          this.editRowInfo = cloneDeep(this.mpiLandValueTaxCalcInfo[currIndex + 1]);
        } else {
          // 全部填写完成
        }
      } else {
        this.currEditRow = undefined;
        this.editRowInfo = undefined;
        this.dialogVisible = false;
      }
    },
    rowclass(row){
      if(row.rowIndex>2){
        return 'row_noedit'
      }
      else{
        return ''
      }
    }
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
    numberFormat(val){
      if(val!==undefined && val!==null){
        return accounting.formatNumber(val, 2);
      }else{
        return val
      }
    }
  },
};
</script>


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
  width: calc(50% - 50px);
}

.formitem_div {
  line-height: 28px;
  flex: 0 0 120px;
  font-size: small;
}
.formitemoneline {
  align-items: flex-start;
  margin: 2px 20px;
  width: calc(100% - 50px);
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
<style lang="scss">
.editCard {
  margin-top: 10px;
  .el-card__header {
    padding: 10px 20px;
  }
}
.el-card {
  border-radius: 0px !important;
  overflow: unset;
}
</style>