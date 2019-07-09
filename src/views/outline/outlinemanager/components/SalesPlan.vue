<template>
<div>
  <sale-plan-grid></sale-plan-grid>
  <returned-plan></returned-plan>
  <carryover-plan></carryover-plan>
</div>
</template>

<script>
import { mapState } from "vuex";
import mixin_commom from "@/utils/mixin_commom";
import EditGridItem from "./EditGridItem";
import SalePlanGrid from "./SalePlanGrid";
import ReturnedPlan from "./ReturnedPlan";
import CarryoverPlan from "./CarryoverPlan";

const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

export default {
  name: "SalesPlan",
  components: { EditGridItem,SalePlanGrid,ReturnedPlan,CarryoverPlan },
  mixins: [mixin_commom],
  data() {
    return {
      year: 4,
      wd: "季度",
      currentYear:currentYear,
      data: [
        {
          id: "1",
          bd: "1",
          bd1: "/",
          bd2: "/",
          bd3: "/",
          ghmj_2019年前:'',
          ghmj_2019年_一季度:'',
          children: [
            {
              id: "2",
              bd: "一标段",
              bd1: "住宅",
              bd2: "住宅",
              bd3: "高层住宅",
              ghmj_2019年前:'222',
              ghmj_2019年_一季度:'',
              ghmj_2019年_二季度:'',
              ghmj_2019年_三季度:'',
              ghmj_2019年_四季度:'',
              ghmj_2019年后:'',
             
            }
          ]
        }
      ],
      columnConfigs: [
        { label: "供货面积(平米)", prop: "ghmj" },
        { label: "供货金额(万元)", prop: "ghje" }
      ]
    };
  },
  computed: {
    tableHeight: function() {
      return this.clientHeight - 340;
    },
    ...mapState({
      outline_stepInfo: state => state.outline_stepInfo,
      outline_info: state => state.outline_info
    }),
    wdArr() {
      if (this.wd === '年度') {
        return []
      } else if (this.wd === '季度') {
        return ['一季度', '二季度', '三季度', '四季度']
      } else {
        return [
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月'
        ]
      }
    },
  },
  watch: {
  },
  methods: {
    handleChange() {
      // const dynamicsData = {}
      // this.$set(dynamicsData)

      // this.data = Object.assign({},this.data,)
    }
  }
};
</script>