<template>
  <div>
    <TaxesCalc></TaxesCalc>
    <LandValueTaxCalc></LandValueTaxCalc>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TaxesCalc from "./TaxesCalc";
import LandValueTaxCalc from "./LandValueTaxCalc";




const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

export default {
  name: "Taxes",
  components: { TaxesCalc,LandValueTaxCalc },
  data() {
    return {
      year: 4,
      wd: "季度",
      currentYear:currentYear,
      data: [  
      ],
    };
  },
  computed: {
    ...mapState({
      outline_stepInfo: state => state.outline_stepInfo,
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
