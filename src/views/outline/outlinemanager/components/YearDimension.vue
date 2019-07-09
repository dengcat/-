<template>
  <span style="height:21px;padding:0px">{{label}}:
        <el-select
          size="mini"
          style="width:150px;height:21px"
          v-model="setting.years"
          @change="settingChange()"
          placeholder="请选择"
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
          v-model="setting.dimension"
          @change="settingChange()"
          placeholder="请选择"
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
      </span>
</template>


<script>
import { mapState, mapActions } from "vuex";

export default {
  name: 'YearDimension',
  data() {
    return {
      // years: 4,
      // dimension: '季度'
    };
  },
  props:{
    label:{
      type: String,
      default: '年限'
    },
    type:{
      type: String,
    },
    // years:{
    //   type: Number,
    //   default: 4
    // },
    // dimension:{
    //   type: Number,
    //   default: '季度'
    // },
    setting:{
      type: Object,
      default: {
        years: undefined,
        dimension: undefined
      }
    }
  },
  created(){
    // if(!type){
    //   console.warn('需要一个年份维度类型')
    // }else{
    //   const setting = this.mpiTableSettingInfo.find(item => {
    //     return item.typeName === this.type;
    //   });
    //   this.years = setting.years
    //   this.dimension = setting.dimension
    // }
  },
  computed: {
    // ...mapState({
    //   mpiTableSettingInfo: state => state.outline_info.mpiTableSettingInfo
    // }),
  },
  methods:{
    ...mapActions([
      "ChangeYearDimension"
    ]),
    settingChange() {
      this.$emit('loadingShow', true)
      this.ChangeYearDimension(this.setting).then(response=>{
        this.$emit('loadingShow', false)
      });
    }
  }
}
</script>
