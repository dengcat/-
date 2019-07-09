<template>
  <div v-loading="pageLoading">
    <!-- <development-cost id="ce1fe666-1b76-4820-a723-b1af46028b4c" :mode="edit" :step="6" :childrenStep="2"></development-cost> -->
  </div>
</template>

<script>

import DevelopmentCost from "./components/DevelopmentCost";

export default {
  name:'Test',
  components:{DevelopmentCost},
  data(){
    return {
      pageLoading:false,
    }
  },
  computed: {
  },
  methods:{
    
  }
}
</script>

