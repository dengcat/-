<template>
  <div class="drag-tree-table-header">
    <lyheadercolumn
      v-for="(item, index) in columns"
      :width="item.width"
      :flex="item.flex"
      :key="index"
      :columnObj ="item"
      :title ="item.title"
    >
    </lyheadercolumn>
  </div>
</template>

<script>
import lyheadercolumn from "./lyheadercolumn.vue";
export default {
  name: "lyheader",
  components: { lyheadercolumn },
  props: ["columns"],
  created(){
    console.log()
  }
};
</script>
