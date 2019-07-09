<template>
  <el-table v-if="collectionPropertyItem" :data="formatData" :row-style="showRow">
    <el-table-column show-overflow-tooltip :align="toLowerCaseFirst(item.field)==='normName'?'left':'center'" v-for="(item,index) in collectionPropertyItem.gridHeader.columns" :min-width="toLowerCaseFirst(item.field)==='normName'? '150px':'100px'" :fixed="toLowerCaseFirst(item.field)==='normName'? true:false" :key="item.field" :label="item.name" >
      <template v-if="!item.children" slot-scope="scope">
        <!-- <template v-if="toLowerCaseFirst(item.field)==='normName'">
          <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
          <span v-if="iconShow(scope.$index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-caret-right"/>
            <i v-else class="el-icon-caret-bottom"/>
          </span>
        </template>
        <template v-else>
          <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
          <span v-if="iconShow(scope.$index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-caret-right"/>
            <i v-else class="el-icon-caret-bottom"/>
          </span>
        </template> -->
        <!-- Todo -->
        <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
        <div style="width:100%;display:inline">
        <span v-for="space in scope.row._level" v-if="toLowerCaseFirst(item.field)==='normName'" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-caret-right"/>
          <i v-else class="el-icon-caret-bottom"/>
        </span>
        <!-- <svg-icon v-if="scope.row.icon && scope.row.icon!==''" :icon-class="scope.row.icon" style="margin-right:5px" /> -->
          <span v-if="scope.row[toLowerCaseFirst(item.field)]!==''">{{ scope.row[toLowerCaseFirst(item.field)] }}</span>
          <el-alert v-if="scope.row[toLowerCaseFirst(item.field)]==='' && toLowerCaseFirst(item.field)==='normName'" style="display:inline;width:50px;padding: 0px 0px"
                    :title="scope.row.modifyState_ | modiStateFilter"
                    :type="scope.row.modifyState_ | modiColorFilter"
                    :closable="false">
                  </el-alert>
        </div>
        
        <!-- 
        <span style="float:left">
          <el-alert v-if="scope.row[toLowerCaseFirst(item.field)]==='' && scope.row.modifyState_" style="width:50px;padding: 0px 0px"
                    :title="scope.row.modifyState_ | modiStateFilter"
                    :type="scope.row.modifyState_ | modiColorFilter"
                    :closable="false">
                  </el-alert>
        </span> -->
      </template>
      <el-table-column align="center" v-if="item.children" v-for="childrenItem in item.children" :key="childrenItem.field" :label="childrenItem.name" min-width="100px">
        <template v-if="childrenItem.children===undefined || childrenItem.children===null || childrenItem.children.length===0" slot-scope="scope">
          {{ scope.row[toLowerCaseFirst(childrenItem.field)] }}
        </template>
          <el-table-column align="center" v-if="childrenItem.children!==undefined && childrenItem.children!==null && childrenItem.children.length>0" v-for="childrenTwoItem in childrenItem.children" :key="childrenTwoItem.field" :label="childrenTwoItem.name" min-width="100px">
          <template v-if="!childrenTwoItem.children" slot-scope="scope">
            <font :color="scope.row[toLowerCaseFirst(childrenTwoItem.field).replace('currentValue_','modifyState_')]!=='0'? '#FF0000':''">{{ scope.row[toLowerCaseFirst(childrenTwoItem.field)] }}</font>
          </template>
          </el-table-column>
        </el-table-column>
    </el-table-column>
  </el-table>

</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
import treeToArray from "./eval";
import {arrayTransTree} from '@/utils'
export default {
  name: "TreeTableCom",
  props: {
    /* eslint-disable */
    collectionPropertyItem:{},
  },
  filters:{
    stateFilter(type) {
      const statusMap = {
        0: '创建',
        1: '修订中',
        2: '审核中',
        5: '已审核',
      }
      return statusMap[type]
    },
    modiStateFilter(state){
      const statusMap = {
        0: '新增',
        1: '新增',
        2: '修改',
        3: '删除'
      }
      return statusMap[state]
    },
    modiColorFilter(state){
      const statusMap = {
        0: 'success',
        1: 'success',
        2: 'warning',
        3: 'error'
      }
      return statusMap[state]
    }  
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      return treeToArray(arrayTransTree(this.collectionPropertyItem.gridData,'parentId','id'),true)
    }
  },
  methods: {
    arrayTransTree,
    treeToArray,
    toLowerCaseFirst(str) {
      if (str === undefined || str === null) {
        return str
      }
      return str[0].toLowerCase() + str.substr(1)
    },
    showRow: function(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      return show
        ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;cursor: pointer;"
        : "display:none;";
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex];
      record._expanded = !record._expanded;
    },
    // 图标显示
    iconShow(index, record) {
      return index === 0 && record.children && record.children.length > 0;
    }
  }
};
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue:#c0c4cc;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  cursor: pointer;
  &::before {
    content: "";
  }
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
  cursor: pointer;
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
  margin-left: -$space-width;
}
.el-table__row {
  cursor: pointer;
}


</style>
