<template>
  <span style="height:21px;padding:0px"><font style="color:#409eff; font-size:13px">是否手动填写</font>:
    <el-switch
    style="height:20px"
      size="mini"
      :active-value="1"
      :inactive-value="0"
      :value="value"
      @change="handleChange"
      >
    </el-switch>
  </span>
</template>


<script>
import { mapState, mapActions } from "vuex";

export default {
  name: 'AutoCalc',
  data() {
    return {
    };
  },
  props:{
    type:{
      type: String,
    },
    value:{
      type: Number,
      default: 0
    }
  },
  computed: {
    // ...mapState({
    //   mpiVersionInfo: state => state.outline_info.mpiVersionInfo,
    //   mpiTableManualInfo: state => state.outline_info.mpiTableManualInfo
    // }),
    // value() {
    //   const setting = this.mpiTableManualInfo.find(item => {
    //     return item.typeName === this.type;
    //   });
    //   return setting;
    // },
  },
  methods:{
    ...mapActions([
      "ChangeAutoCalc"
    ]),
    handleChange(val) {
      const type = this.type
      this.$emit('loadingShow', true)
      this.ChangeAutoCalc({val, type}).then(response=>{
        if(val === 0){
          this.$emit('reCalc', false)
        }
        this.$emit('loadingShow', false)
      });
    }
  }
}
</script>
