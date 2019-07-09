<template>
  <el-tooltip style="cursor:pointer" :hide-after="100" @click.native="isShow = !isShow" @mouseleave.native="isShow=false" :value="isShow" :manual="true"  effect="dark" placement="top-start">
    <div v-show="remark && remark!=''" slot="content" v-html="remark"/>
    <slot></slot>
  </el-tooltip>
</template>

<script>

export default {
  name: "ToolTip",
  props: {
    remark:{
      type:String
    }
  },
  data() {
    return {
      isShow:false
    }
  }
}
</script>
