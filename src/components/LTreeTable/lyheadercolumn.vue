<template>
    <div class="tree-column" v-bind:style="{ width: width + 'px', flex: flex}" v-if="flex">
      <template v-if="columnObj && columnObj.children && columnObj.children.length > 0">
        <lyheadercolumn
          v-for="(item, index) in columnObj.children"
          :width="item.width"
          :flex="item.flex"
          :key="index"
          :columnObj ="item"
          :title ="item.title"
        >
        </lyheadercolumn>
      </template>
      <template >
        {{title}}
      </template>
    </div>
    <div class="tree-column" v-bind:style="{ width: width + 'px'}" v-else>
      <template v-if="columnObj && columnObj.children && columnObj.children.length>0">
        <lyheadercolumn
          v-for="(item, index) in columnObj.children"
          :width="item.width"
          :flex="item.flex"
          :key="index"
          :columnObj ="item"
          :title ="item.title"
        >
        </lyheadercolumn>
      </template>
      <template >
        {{title}}
      </template>
    </div>
</template>
<script>
export default {
  name: 'lyheadercolumn',
  props: {
    width: Number,
    field: String,
    label: String,
    flex: Number,
    columnObj: {
      type: Object,
      default: undefined
    },
    title: String
  },
  data() {
      return {
          open: false
      }
  },
  created(){
  }
}
</script>
<style>
  .tree-column{
    padding: 0px 4px;
    min-width: 60px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
