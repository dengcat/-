<template>
<div class="orgtree">
  <div style="border: 1px solid #ebeef5;background-color: #fafafa;height:38px; border-bottom-width:2px;">
    <div style="position: relative;
    overflow-wrap: normal;
    text-overflow: ellipsis;
    vertical-align: middle;
    width: 100%;
    box-sizing: border-box;
    line-height: 33px;
    font-size: 12px;
    padding-left: 10px;">组织</div>
  </div>
    <el-tree
      v-loading="loading"
      v-bind="$attrs"
      :data="busData"
      node-key="id"
      :default-expanded-keys="expandedKeys"
      @node-click="checkRow"
      :props="defaultProps"
      ref="orgtree"
      >
      <span class="el-tree-node__label" slot-scope="scope">
        <svg-icon v-if="scope.data.isCompany===1" icon-class="company" style="margin-right: 2px; color: rgb(204, 204, 204);" />
        <svg-icon v-if="scope.data.isCompany===0" icon-class="org" style="margin-right: 2px; color: rgb(204, 204, 204);" />
        <span>{{ scope.node.label }}</span>
      </span>
    </el-tree>
</div>
</template>

<script>
import {
  getBusinessUnits,
  GetBusinessUnitsIncludDepartMent
} from "@/api/mdmmanager";
import {treeToArray} from '@/utils'
export default {
  name: 'OrgTree',
  props:{
    type: {
      //0 公司  //1 公司部门
      type: Number,
      default:0
    },
    expanded:{
      type: Number,
      default:3
    },
    currRow:{
      type:Object
    }
  },
  data(){
    return {
      loading:true,
      busData:undefined,
      defaultProps: {
        children: "children",
        label: "buName"
      },
      currBuGuid:undefined,
      orderHierarchyCode:undefined,
    }
  },
  created(){
    this.getBusinessData()
  },
  methods:{
    getBusinessData: function() {
      if(this.type===0){
        // 获取公司
        getBusinessUnits().then(response => {
          if (Array.isArray(response.data.result)) {
            this.busData = response.data.result;
            // 更新currRow
            this.$emit('update:currRow',response.data.result[0])
            // 触发选中事件
            this.$emit('node-click',response.data.result[0])
          }
          this.$nextTick(() => {
            this.$refs.orgtree.setCurrentKey(this.currRow.id)
          })
          this.loading = false
        });
      }
      else{
        GetBusinessUnitsIncludDepartMent().then(response => {
          if (Array.isArray(response.data.result)) {
            this.busData = response.data.result;
            // 更新currRow
            this.$emit('update:currRow',response.data.result[0])
            // 触发选中事件
            this.$emit('node-click',response.data.result[0])
          }
          this.$nextTick(() => {
            this.$refs.orgtree.setCurrentKey(this.currRow.id)
          })
          this.loading = false
        });
      }
    },
    checkRow:function(data,node,row){
      this.$emit('update:currRow',data)
      this.$emit('node-click',data)
    },
    getCurrRow: function() {
      return this.currRow
    },
    //计算层级
    getChildrenId: function(items){
      let arrResult = [];
      items.forEach(item => {
        arrResult.push(item.id)
      })
    }
  },
  computed:{
    expandedKeys: function() {
      let expandedKeys = [];
      if(this.busData){
        const arrTemp = treeToArray(this.busData)
        arrTemp.forEach(item =>{
          if(item._level && item._level < this.expanded){
            expandedKeys.push(item.id)
          }
        })
      }
      return expandedKeys;
    },
  }
}
</script>

