<template>
  <el-card class="editCard" v-loading="pageLoading">
    <div
      slot="header"
      class="clearfix"
    >
      <i
        class="el-icon-news"
        style="color:RGB(255,204,102)"
      ></i>
      <span style="margin-left:10px;">成本支付计划</span>
      <span style="float:right;height:21px;padding:0px">支付年限:
        <el-select
          size="mini"
          style="width:150px;height:21px"
          v-model="year"
          placeholder="请选择"
          @change="settingChange()"
        >
          <el-option
            :label="2"
            :value="2"
          ></el-option>
          <el-option
            :label="3"
            :value="3"
          ></el-option>
          <el-option
            :label="4"
            :value="4"
          ></el-option>
          <el-option
            :label="5"
            :value="5"
          ></el-option>
          <el-option
            :label="6"
            :value="6"
          ></el-option>

        </el-select>
        填写维度:
        <el-select
          style="width:150px;height:21px"
          size="mini"
          v-model="wd"
          placeholder="请选择"
          @change="settingChange()"
        >
          <el-option
            label="年度"
            value="年度"
          ></el-option>
          <el-option
            label="季度"
            value="季度"
          ></el-option>
          <el-option
            label="月度"
            value="月度"
          ></el-option>
        </el-select>
        <el-checkbox v-model="showRate">显示支付比例</el-checkbox>
        <el-checkbox v-model="hasRate">含税</el-checkbox>
      </span>
    </div>
    <template>
      <lazy-render :time="300" :immediately="true">
      <vcl-table :speed="1" width="100%" height="100%" slot="tip" :rows="10" :columns="10"></vcl-table>
      <!-- <el-bigdata-table
        :height="tableHeight"
        :data="showData"
        border
        fit
        style="width: 100%"
        :isTree="true"
        row-key="id"
        :isTreeExpandAll="true"
        :highlight-current-row="false"
        stripe
        :key="`${year}_${wd}_${showRate}`"
      >
        <vxe-table-column
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
        </vxe-table-column>
        <vxe-table-column
          prop="costCode"
          label="科目编号"
          width="220"
          :tree="true"
          fixed
        ></vxe-table-column>
        <vxe-table-column
          header-align="center"    :show-overflow-tooltip="true"       align="right"
          label="目标成本"
          width="180"
        >
          <template slot-scope="scope">
            {{scope.row.targetCost | numberFormat}}
          </template>
        </vxe-table-column>

        <vxe-table-column label="合计比例" header-align="center"    :show-overflow-tooltip="true"       align="right">
          <template slot-scope="scope">
            {{scope.row.sumRate | numberFormat}}
          </template>
        </vxe-table-column>
        <vxe-table-column
          label="小计"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
          <vxe-table-column
            :label="`${currentYear}年前`"
            header-align="center"    :show-overflow-tooltip="true"       align="right"
          >
            <vxe-table-column
              label="支付金额"
              header-align="center"    :show-overflow-tooltip="true"       align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`小计${currentYear}年前_zfje`] | numberFormat}}
              </template>
            </vxe-table-column>
            <vxe-table-column
              v-if="showRate===true"
              label="支付比例(%)"
              header-align="center"    :show-overflow-tooltip="true"       align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`小计${currentYear}年前_zfbl`] | numberFormat}}
              </template>
            </vxe-table-column>
          </vxe-table-column>
          <vxe-table-column
            v-for="yearindex in year"
            :key="`小计${currentYear+yearindex-1}年`"
            :label="`${currentYear+yearindex-1}年`"
            header-align="center"    :show-overflow-tooltip="true"       align="right"
          >
            <vxe-table-column
              label="支付金额"
              header-align="center"    :show-overflow-tooltip="true"       align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`小计${currentYear+yearindex-1}年_zfje`] | numberFormat}}
              </template>
            </vxe-table-column>
            <vxe-table-column
              v-if="showRate===true"
              label="支付比例(%)"
              header-align="center"    :show-overflow-tooltip="true"       align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`小计${currentYear+yearindex-1}年_zfbl`] | numberFormat}}
              </template>
            </vxe-table-column>
          </vxe-table-column>
          <vxe-table-column
            header-align="center"    :show-overflow-tooltip="true"       align="right"
            :label="`${currentYear+year-1}年后`"
          >
            <vxe-table-column
              label="支付金额"
              header-align="center"    :show-overflow-tooltip="true"       align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`小计${currentYear+year-1}年后_zfje`] | numberFormat}}
              </template>
            </vxe-table-column>
            <vxe-table-column
              v-if="showRate===true"
              label="支付比例(%)"
              header-align="center"    :show-overflow-tooltip="true"       align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`小计${currentYear+year-1}年后_zfbl`] | numberFormat}}
              </template>
            </vxe-table-column>
          </vxe-table-column>
        </vxe-table-column>
        <vxe-table-column
          :label="`${currentYear}年前`"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
          <vxe-table-column
            label="支付金额"
            header-align="center"    :show-overflow-tooltip="true"       align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`${currentYear}年前_zfje`] | numberFormat}}
            </template>
          </vxe-table-column>
          <vxe-table-column
            v-if="showRate===true"
            label="支付比例(%)"
            header-align="center"    :show-overflow-tooltip="true"       align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`${currentYear}年前_zfbl`] | numberFormat}}
            </template>
          </vxe-table-column>
        </vxe-table-column>
        <vxe-table-column
          v-for="yearindex in year"
          :key="`${currentYear+yearindex-1}年_详细`"
          :label="`${currentYear+yearindex-1}年`"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
          <vxe-table-column
            v-for="wditem in wdArr"
            :key="`${currentYear+yearindex-1}年_${wditem}`"
            :label="wditem"
            header-align="center"    :show-overflow-tooltip="true"       align="right"
          >
            <vxe-table-column
              label="支付金额"
              header-align="center"    :show-overflow-tooltip="true"       align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`${currentYear+yearindex-1}年_${wditem}_zfje`] | numberFormat}}
              </template>
            </vxe-table-column>
            <vxe-table-column
              v-if="showRate===true"
              label="支付比例(%)"
              header-align="center"    :show-overflow-tooltip="true"       align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`${currentYear+yearindex-1}年_${wditem}_zfbl`] | numberFormat}}
              </template>
            </vxe-table-column>
          </vxe-table-column>
          <vxe-table-column
            v-if="wd==='年度'"
            label="支付金额"
            header-align="center"    :show-overflow-tooltip="true"       align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`${currentYear+yearindex-1}年_zfje`] | numberFormat}}
            </template>
          </vxe-table-column>
          <vxe-table-column
            v-if="wd==='年度' && showRate===true"
            label="支付比例(%)"
            header-align="center"    :show-overflow-tooltip="true"       align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`${currentYear+yearindex-1}年_zfbl`] | numberFormat}}
            </template>
          </vxe-table-column>

        </vxe-table-column>
        <vxe-table-column
          :prop="`${currentYear+year-1}年后`"
          :label="`${currentYear+year-1}年后`"
          header-align="center"    :show-overflow-tooltip="true"       align="right"
        >
          <vxe-table-column
            :prop="`${currentYear+year-1}年后_zfje`"
            label="支付金额"
            header-align="center"    :show-overflow-tooltip="true"       align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`${currentYear+year-1}年后_zfje`] | numberFormat}}
            </template>
          </vxe-table-column>
          <vxe-table-column
            v-if="showRate===true"
            :prop="`${currentYear+year-1}年后_zfbl`"
            label="支付比例(%)"
            header-align="center"    :show-overflow-tooltip="true"       align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`${currentYear+year-1}年后_zfbl`] | numberFormat}}
            </template>
          </vxe-table-column>
        </vxe-table-column>

        <vxe-table-column
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button v-if="!scope.row.children || scope.row.children.length === 0"
              @click="handleEdit(scope.row)"
              type="text"
            >填写</el-button>
            <el-button v-else
              @click="handleEdit(scope.row)"
              type="text"
            >详情</el-button>
          </template>
        </vxe-table-column>
      </el-bigdata-table> -->
      <vxe-grid
          :data.sync="showData"
          :tree-config="{key: 'id', children: 'children', expandAll: true}"
          show-overflow
          show-header-overflow
          height="300"
          resizable
          >
          <vxe-table-column
          file-icon="icon icon-file"
          folder-icon="icon icon-folder"
          prop="costName"
          label="科目"
          width="220"
          treeKey="costName"
          :expandAll="true"
          :show-overflow-tooltip="true"
          fixed
          tree-node
        >
        </vxe-table-column>
        <vxe-table-column
          prop="costCode"
          label="科目编号"
          width="220"
          :tree="true"
          fixed
        ></vxe-table-column>
        <vxe-table-column
          header-align="center"    :show-overflow-tooltip="true"       align="right"
          label="目标成本"
          width="180"
        >
          <template slot-scope="scope">
            {{scope.row.targetCost | numberFormat}}
          </template>
        </vxe-table-column>

        <vxe-table-column label="合计比例" header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right">
          <template slot-scope="scope">
            {{scope.row.sumRate | numberFormat}}
          </template>
        </vxe-table-column>
        <vxe-table-column
          label="小计"
          header-align="center"    :show-overflow-tooltip="true"    align="right"
        >
          <vxe-table-column
            :label="`${currentYear}年前`"
            header-align="center"    :show-overflow-tooltip="true"   width="120"    align="right"
          >
            <vxe-table-column
              label="支付金额"
              header-align="center"    :show-overflow-tooltip="true"   width="120"    align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`小计${currentYear}年前_zfje`] | numberFormat}}
              </template>
            </vxe-table-column>
            <vxe-table-column
              v-if="showRate===true"
              label="支付比例(%)"
              header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`小计${currentYear}年前_zfbl`] | numberFormat}}
              </template>
            </vxe-table-column>
          </vxe-table-column>
          <vxe-table-column
            v-for="yearindex in year"
            :key="`小计${currentYear+yearindex-1}年`"
            :label="`${currentYear+yearindex-1}年`"
            header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
          >
            <vxe-table-column
              label="支付金额"
              header-align="center" width="120"   :show-overflow-tooltip="true"       align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`小计${currentYear+yearindex-1}年_zfje`] | numberFormat}}
              </template>
            </vxe-table-column>
            <vxe-table-column
              v-if="showRate===true"
              label="支付比例(%)"
              header-align="center"   width="120" :show-overflow-tooltip="true"       align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`小计${currentYear+yearindex-1}年_zfbl`] | numberFormat}}
              </template>
            </vxe-table-column>
          </vxe-table-column>
          <vxe-table-column
            header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
            :label="`${currentYear+year-1}年后`"
          >
            <vxe-table-column
              label="支付金额"
              header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`小计${currentYear+year-1}年后_zfje`] | numberFormat}}
              </template>
            </vxe-table-column>
            <vxe-table-column
              v-if="showRate===true"
              label="支付比例(%)"
              header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`小计${currentYear+year-1}年后_zfbl`] | numberFormat}}
              </template>
            </vxe-table-column>
          </vxe-table-column>
        </vxe-table-column>
        <vxe-table-column
          :label="`${currentYear}年前`"
          header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
        >
          <vxe-table-column
            label="支付金额"
            header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`${currentYear}年前_zfje`] | numberFormat}}
            </template>
          </vxe-table-column>
          <vxe-table-column
            v-if="showRate===true"
            label="支付比例(%)"
            header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`${currentYear}年前_zfbl`] | numberFormat}}
            </template>
          </vxe-table-column>
        </vxe-table-column>
        <vxe-table-column
          v-for="yearindex in year"
          :key="`${currentYear+yearindex-1}年_详细`"
          :label="`${currentYear+yearindex-1}年`"
          header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
        >
          <vxe-table-column
            v-for="wditem in wdArr"
            :key="`${currentYear+yearindex-1}年_${wditem}`"
            :label="wditem"
            header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
          >
            <vxe-table-column
              label="支付金额"
              header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`${currentYear+yearindex-1}年_${wditem}_zfje`] | numberFormat}}
              </template>
            </vxe-table-column>
            <vxe-table-column
              v-if="showRate===true"
              label="支付比例(%)"
              header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
            >
              <template slot-scope="scope">
                {{scope.row[`${currentYear+yearindex-1}年_${wditem}_zfbl`] | numberFormat}}
              </template>
            </vxe-table-column>
          </vxe-table-column>
          <vxe-table-column
            v-if="wd==='年度'"
            label="支付金额"
            header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`${currentYear+yearindex-1}年_zfje`] | numberFormat}}
            </template>
          </vxe-table-column>
          <vxe-table-column
            v-if="wd==='年度' && showRate===true"
            label="支付比例(%)"
            header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`${currentYear+yearindex-1}年_zfbl`] | numberFormat}}
            </template>
          </vxe-table-column>

        </vxe-table-column>
        <vxe-table-column
          :prop="`${currentYear+year-1}年后`"
          :label="`${currentYear+year-1}年后`"
          header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
        >
          <vxe-table-column
            :prop="`${currentYear+year-1}年后_zfje`"
            label="支付金额"
            header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`${currentYear+year-1}年后_zfje`] | numberFormat}}
            </template>
          </vxe-table-column>
          <vxe-table-column
            v-if="showRate===true"
            :prop="`${currentYear+year-1}年后_zfbl`"
            label="支付比例(%)"
            header-align="center"  width="120"  :show-overflow-tooltip="true"       align="right"
          >
            <template slot-scope="scope">
              {{scope.row[`${currentYear+year-1}年后_zfbl`] | numberFormat}}
            </template>
          </vxe-table-column>
        </vxe-table-column>

        <vxe-table-column
          label="操作"
          fixed="right"
          width="120"
        >
          <template slot-scope="scope">
            <el-button v-if="!scope.row.children || scope.row.children.length === 0"
              @click="handleEdit(scope.row)"
              type="text"
            >填写</el-button>
            <el-button v-else
              @click="handleEdit(scope.row)"
              type="text"
            >详情</el-button>
          </template>
        </vxe-table-column>
        </vxe-grid>
      </lazy-render>
    </template>
    <!-- 编辑填写页面 -->
    <el-dialog
      :close-on-click-modal="false"
      top="50px"
      v-if="editRowInfo"
      :title="`${editRowInfo.costName}`"
      :visible="dialogVisible"
      :before-close="handleClose"
      width="1000px"
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
          label="目标成本"
          v-model="editRowInfo.targetCost"
          :disabled="true"
          type="number"
        ></form-item>
      </div>
      <el-table
        :data="editRowInfo.datas"
        height="400"
        stripe
        style="width: 100%; margin-top:10px"
      >
        <vxe-table-column
          label="年份"
          prop="year"
          width="180"
        >
        </vxe-table-column>
        <vxe-table-column
          :label="`季度/月度`"
          prop="quarterOrMonth"
          width="180"
        >
        </vxe-table-column>
        <vxe-table-column label="支付金额" align="right">
          <template slot-scope="scope">
            <edit-grid-item
              :value="scope.row.payTotal"
              type='number'
              @input="val => scope.row.payTotal = val"
              :isEdit="false"
            ></edit-grid-item>
          </template>

        </vxe-table-column>
        <vxe-table-column label="支付比例(%)" align="right">
          <template slot-scope="scope">
            <edit-grid-item
              :value="scope.row.payRate"
              type='number'
              @input="val => handlePayRate(val, scope.row)"
              :isEdit="((currEditRow.children && currEditRow.children.length > 0) || scope.row.year.indexOf('小计') >= 0) ? false : true"
            ></edit-grid-item>
          </template>
        </vxe-table-column>
      </el-table>
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
import { mapState,mapActions } from "vuex";
import mixin_commom from "@/utils/mixin_commom";
import EditGridItem from "./EditGridItem";
import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import accounting from 'accounting'
import FormItem from "./FormItem";
import { treeToArrayNoParent } from "@/utils";
import numeral from "numeral";
import { VclTable } from 'vue-content-loading';
import {myNumeral} from './util'




const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());


export default {
  name: "CostPayPlan",
  components: { EditGridItem, FormItem,VclTable },
  mixins: [mixin_commom],
  data() {
    return {
      year: 4,
      wd: "季度",
      currentYear: currentYear,
      data: [],
      showRate: true,
      currEditRow: undefined, // 当前选中编辑行
      dialogVisible: false,
      editRowInfo: undefined,
      hasRate:true,
      pageLoading: true  
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
    showData() {
      console.time()
      const data = this.mpiCostPayPlanInfo;
      if (data) {
        const showData = data.map(item => {
          this.updateRowNode(item);
          return item;
        });
        console.timeEnd()
        return showData;
      } else {
        return [];
      }
      
    },
    // editTables(){
    //   if(this.editRowInfo && this.editRowInfo.datas){
    //     return this.editRowInfo.datas.filters
    //   }
    //   return this.editRowInfo
    // },
    arrData() {
      return treeToArrayNoParent(this.showData)
    },
    tableHeight: function() {
      return this.clientHeight - 340;
    },
    ...mapState({
      outline_stepInfo: state => state.outline_stepInfo,
      mpiCostPayPlanInfo: state => state.outline_info.mpiCostPayPlanInfo,
      mpiTableSettingInfo: state => state.outline_info.mpiTableSettingInfo
    }),
    setting() {
      const setting = this.mpiTableSettingInfo.find(item => {
        return item.typeName === "成本支付计划";
      });
      return setting;
    },          
    wdArr() {
      if (this.wd === "年度") {
        return [];
      } else if (this.wd === "季度") {
        return ["一季度", "二季度", "三季度", "四季度"];
      } else {
        return [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月"
        ];
      }
    }
  },
  created() {
    this.pageLoading = false;
    this.year = this.setting.years;
    this.wd = this.setting.dimension;      
  },  
  methods: {
    ...mapActions([
      "ChangeYearDimension"
    ]),    
    handleClose(){
      this.editRowInfo = undefined
      this.currEditRow = undefined
      this.dialogVisible = false
    },      
    handleEdit(row) {
      this.currEditRow = row;
      this.editRowInfo = cloneDeep(row);
      this.dialogVisible = true;
    },
    handleChange() {
      // const dynamicsData = {}
      // this.$set(dynamicsData)
      // this.data = Object.assign({},this.data,)
    },
    // 递归增加子级节点
    updateRowNode(row) {
      const dynamicsObj = {};
      row.datas.forEach(datasItem => {
        const key_ghje = datasItem.quarterOrMonth
          ? `${datasItem.year}_${datasItem.quarterOrMonth}_zfbl`
          : `${datasItem.year}_zfbl`;
        const key_ghmj = datasItem.quarterOrMonth
          ? `${datasItem.year}_${datasItem.quarterOrMonth}_zfje`
          : `${datasItem.year}_zfje`;
        dynamicsObj[key_ghje] = datasItem.payRate;
        dynamicsObj[key_ghmj] = datasItem.payTotal;
      });
      row = Object.assign(row, dynamicsObj);
      if (row.children && Array.isArray(row.children)) {
        row.children.forEach(childrenitem => {
          this.updateRowNode(childrenitem);
        });
      }
    },
    handleSave(type) {
      this.currEditRow.sumRate = this.editRowInfo.sumRate
      this.currEditRow.totalSum = this.editRowInfo.totalSum
      this.currEditRow.datas.forEach((item, $index) => {
        this.$set(item, "payRate", this.editRowInfo.datas[$index].payRate);
        this.$set(item, "payTotal", this.editRowInfo.datas[$index].payTotal);
        this.$set(item, "sumRate", this.editRowInfo.sumRate);
        this.$set(item, "totalSum", this.editRowInfo.totalSum);
      });
      // 更新父级
      // 父节点
      const currIndex = this.arrData.findIndex(item => {
        return item.id === this.currEditRow.id;
      });
      this.updateParentNodes(this.arrData[currIndex])
      
      // 保存后清空或者继续下一条
      if (type === "next") {
        if (currIndex + 1 < this.arrData.length) {
          const nextRow = this.arrData.find((item,index)=>{
            return index > currIndex && (!item.children || item.children.length<= 0)
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
    calcTotalRate(row){
      let payTotalSum = numeral(0)
      row.datas.forEach(item=>{
        const payTotal = Number(item.payTotal)
        if(payTotal && !isNaN(payTotal)){
          payTotalSum = numeral(item.payTotal).add(payTotalSum)
        }
      })
      row.totalSum = payTotalSum
      if(row.targetCost){
        row.sumRate = payTotalSum.divide(row.targetCost).multiply(100).value()
      }
      else{
        row.sumRate = 0
      }
    },
    // 更新父级的合计
    updateParentNodes(row){
      // 是否有父级
      if(!row.parentCode || row.parentCode===''){
        return
      }
      // 更新当前行的父级
      // const sumObj = {
      //   payRate: 0,
      //   payTotal: 0,
      // }
      // this.arrData.forEach(element=>{
      //   if(element.parentCode === row.parentCode){
      //     Object.keys(sumObj).forEach(item=>{
      //       if(element[item]){
      //         sumObj[item] = sumObj[item] + element[item]
      //       }
      //     })
      //   }
      // })

      let parentNode = this.arrData.find(element=>{
        return element.costCode === row.parentCode
      })
      // 更新父级的合计
      parentNode.datas.forEach(parentItem=>{
        let payRate = 0;
        let payTotal = 0;
        parentNode.children.forEach(item => {
          item.datas.forEach(datasItem => {
            if (
              datasItem.year === parentItem.year &&
              datasItem.quarterOrMonth === parentItem.quarterOrMonth
            ) {
              // if (datasItem["payRate"]) {
              //   payRate = payRate + datasItem["payRate"];
              // }
              // 支付金额合计
              if (datasItem["payTotal"]) {
                payTotal = myNumeral(datasItem["payTotal"]).add(payTotal).value();
              }

            }
          });
        });
        this.$set(parentItem, "payTotal", payTotal);
        const targetCost = myNumeral(parentItem.targetCost).value()
        if(targetCost === 0){
          payRate = 0
        }
        else{
          payRate = myNumeral(payTotal).divide(targetCost).multiply(100).value()
        }
        this.$set(parentItem, "payRate", payRate);
      })
      this.calcTotal(parentNode)
      // 递归更新
      this.updateParentNodes(parentNode)
      
    },
    handlePayRate(value,row){
      row.payRate = value
      if(value!=null && this.editRowInfo.targetCost){
        const payRateDN = numeral(value)
        row.payTotal = payRateDN.multiply(this.editRowInfo.targetCost).divide(100).value()
      }
      this.calcTotal(this.editRowInfo)
    },
    // 计算小计
    calcTotal(row){
      const xj = row.datas.filter(item=>{
        return item.year.indexOf('小计')>=0
      })
      xj.forEach(item=>{
        item.payRate = 0
        item.payTotal =0
      })
      row.datas.forEach(element=>{
        if(element.year.indexOf('小计')<0){
          const curxj = xj.find(xjitem=>{
            return xjitem.year.replace('小计','')=== element.year
          })
          // 比例
          if(!curxj.payRate){
            curxj.payRate = element.payRate
          }
          else{
            curxj.payRate = myNumeral(element.payRate).add(curxj.payRate).value() 
          }
          // 支付金额
          if(!curxj.payTotal){
            curxj.payTotal = element.payTotal
          }
          else{
            curxj.payTotal = myNumeral(element.payTotal).add(curxj.payTotal).value()
          }
        }
      })
      let sumRate = 0
      let totalSum = 0
      xj.forEach(item=>{
        if(item.payRate){
          sumRate = myNumeral(item.payRate).add(sumRate).value()
        }
        if(item.payTotal){
          totalSum = myNumeral(item.payTotal).add(totalSum).value()
        }
      })
      row.sumRate = sumRate
      row.totalSum = totalSum
      row.datas.forEach(item=>{
        item.sumRate = sumRate
        item.totalSum = totalSum
      })
    },
    settingChange() {
      const setting = this.setting;
      setting.years = this.year;
      setting.dimension = this.wd;
      
      this.pageLoading = true;
      this.ChangeYearDimension(setting).then(response => {
        this.pageLoading = false;
      });
    }
  }
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
