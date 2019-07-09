<template>
  <div class="app-container versioncom" v-loading="pageLoading">
    <el-row>
      <el-col :span="4" :offset="20">
        <span style="font-size:14px">只显示差异</span>
        <el-switch
          v-model="isOnlyShowDiff"
          >
        </el-switch>
      </el-col>
    </el-row>
    <el-row :gutter="4" style="height:100%;margin-top:10px" >
      <el-col :span="4">
        <tree-table v-on:row-click="checkRow" :columns="column" :data="busData" highlight-current-row :expand-all="true" />
      </el-col>
      <el-col v-loading ="dataLoading" :span="20">     
        <el-table v-if="data" :data="formatData" :row-style="showRow" >
          <el-table-column :align="toLowerCaseFirst(item.field)==='normName'?'left':'center'" v-for="(item,index) in data.gridHeader.columns" :key="item.field" :label="item.name" >
            <template v-if="toLowerCaseFirst(item.field)==='normName'" slot-scope="scope">
              <!-- Todo -->
              <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
              <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
              <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
                <i v-if="!scope.row._expanded" class="el-icon-caret-right"/>
                <i v-else class="el-icon-caret-bottom"/>
              </span>
              <!-- <svg-icon v-if="scope.row.i  con && scope.row.icon!==''" :icon-class="scope.row.icon" style="margin-right:5px" /> -->
              {{ scope.row[toLowerCaseFirst(item.field)] }}
            </template>
              <el-table-column align="center" v-if="item.children" v-for="childrenItem in item.children" :key="childrenItem.field" :label="childrenItem.name" min-width="100px">
                <template slot-scope="scope">
                  <font v-if="toLowerCaseFirst(childrenItem.field).includes('differenceValue_')" :color="scope.row[toLowerCaseFirst(childrenItem.field).replace('currentValue_','modifyState_')]!=='0'? '#FF0000':''">{{ scope.row[toLowerCaseFirst(childrenItem.field)] }}</font>
                  <font v-else :color="scope.row[toLowerCaseFirst(childrenItem.field).replace('currentValue_','modifyState_')]!=='0'? '#FF0000':''">{{ scope.row[toLowerCaseFirst(childrenItem.field)] }}</font>                
                </template>
                </el-table-column>
          </el-table-column>
          <slot/>
        </el-table>
        <el-collapse v-if="data && data.extensionData" v-model="activeNames">
          <el-collapse-item v-if="collectionPropertyDisplay"  v-for="item in Object.keys(data.extensionData)" :key="item" :name="item">
            <template slot="title">
              <div style="margin-left:10px">{{item}}</div>
            </template>
            <tree-table-com v-if="collectionPropertyDisplay[item]" :collectionPropertyItem="collectionPropertyDisplay[item]['data']"></tree-table-com>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import treeToArray from "@/components/TreeTable/eval";
import { getVersionContrastResultForMVersions,getProjectDetailBusinessDataWithEditionList,getVersionContrastResultForCollectionPropertyMVersions } from '@/api/mdmmanager'
import {arrayTransTree} from '@/utils'
import TreeTableCom from "@/components/TreeTable/treetablecom";
import { deepClone,deepCopy } from "@/utils/index.js";
import axios from 'axios'



export default {
  name: "VersionCom",
  components: {
    treeTable,
    TreeTableCom
  },
  filters: {},
  data() {
    const Versions = this.$route.params.versionlist.split(",")
    // const formatData = this.getFormData(false)
    // const collectionPropertyDisplay = getCollectionPropertyDisplay(false)
    return {
      businessDataGuid:this.$route.params.businessDataGuid,
      versions: Versions,
      versionStandard: Versions[0],
      versioninfo:[],
      tableData: [
        
      ],
      column: [
        {
          text: "项目",
          value: "name"
        }
      ],
      busData: [
      ],
      data: undefined,
      multipleSelection: [],
      activeNames:'',
      isOnlyShowDiff:false,
      collectionProperty:{},
      pageLoading:true,
      formatData:undefined,
      collectionPropertyDisplay:undefined,
      dataLoading:false
    };
  },
  computed: {
    
  },
  watch:{
    isOnlyShowDiff: function(newValue,oldValue){
      this.dataLoading = true
      // formdata
      this.formatData = this.getFormData(newValue)
      // collectionPropertyDisplay
      this.collectionPropertyDisplay = this.getCollectionPropertyDisplay(newValue)
      this.dataLoading = false
    }
  },
  created(){
    getProjectDetailBusinessDataWithEditionList({businessDataGuid:this.businessDataGuid}).then(
        response => {
          this.busData = arrayTransTree(response.data.result.projectDetail,'parentGUID','businessDataGUID')
          this.versioninfo = response.data.result.editionList
        }
      )
    this.initGrid()
  },
  methods: {
    treeToArray,
    arrayTransTree,
    initGrid(){
      getVersionContrastResultForMVersions({businessDataGuid:this.businessDataGuid,baseSerialNo:this.versionStandard,serialNos:this.versions}).then(
        response => {
          const result = response.data.result
          this.data = result
          if(result && result.extensionData){
            this.activeNames = Object.keys(result.extensionData)
          
          Promise.all(
            Object.keys(result.extensionData).map(
              (item) => {
                return getVersionContrastResultForCollectionPropertyMVersions(
                  {
                    "businessDataGuid": this.businessDataGuid,
                    "projectOrStageGuid": this.$route.params.businessDataGuid,
                    "serialNos": this.versions,
                    "groupName": item,
                    "baseSerialNo": this.versionStandard,
                  }
                ).then(
                  response => {
                    this.$set(this.collectionProperty,item,response.data.result)
                  }
                )
              }
            )
          ).then(
            res => {
              // console.log('res',res)
              // Object.keys(result.extensionData).forEach(
              //   (item,index) => {
              //     this.$set(this.collectionProperty,item,res[index].data.result)
              //   }
              // )
              this.formatData = this.getFormData(this.isOnlyShowDiff)
              // collectionPropertyDisplay
              this.collectionPropertyDisplay = this.getCollectionPropertyDisplay(this.isOnlyShowDiff)
              this.dataLoading = false
              this.pageLoading = false
            }       
          )
          }
          
        }
      )
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    showRow: function(row) {
      // let diffShow = true
      // const arr = Object.keys(row).filter(
      //   item => {
      //     if(itemkey.includes('ModifyState_') && dataitem[itemkey]!=='0'){
      //         return true
      //       }
      //       else{
      //         return false
      //       }
      //   }
      // )
      // if(isOnlyShowDiff && arr.length=== 0){
      //   diffShow = false
      // }
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
    },
    toLowerCaseFirst(str) {
      if (str === undefined || str === null) {
        return str
      }
      return str[0].toLowerCase() + str.substr(1)
    },
    checkRow(row, event, column){
      this.businessDataGuid=row.businessDataGUID
      this.dataLoading = true
      this.initGrid()
      // console.log('row',row)
      // this.tableData = temp.filter(element => {return element.company == row.label})
    },
    // formdata
    getFormData(isOnlyShowDiff){
      let gridDataTemp = deepCopy(this.data.gridData)
      let diffArr = []
      if(gridDataTemp){
        if(isOnlyShowDiff){
          let gridDataDiffTemp = []
          const gridDataLastLevelDiffTemp = gridDataTemp.filter(
            item =>{
              diffArr = Object.keys(item).filter(
                itemkey=>{
                  if(itemkey.includes('modifyState_') && item[itemkey]!=='0'){
                    return true
                  }
                  else{
                    return false
                  }
                }
              )
              if(diffArr.length>0){
                  return true
                }
                else{
                  return false
                }
            }
          )
          gridDataDiffTemp = gridDataTemp.filter(item =>{
            let diffChilder = gridDataLastLevelDiffTemp.find(diffitem =>{
              return diffitem.parentId === item.id
            })
            if(diffChilder){
              return true
            }
            else{
              return false
            }
          })
          gridDataDiffTemp = [...gridDataDiffTemp,...gridDataLastLevelDiffTemp]
          return treeToArray(arrayTransTree(gridDataDiffTemp,'parentId','id'), true);
        }
        else{
          return treeToArray(arrayTransTree(gridDataTemp,'parentId','id'), true);
        }
      }
      else{
        return []
      }
    },
    getCollectionPropertyDisplay(isOnlyShowDiff){
      let collectionPropertyTemp = deepCopy(this.collectionProperty)
      let gridDataTemp
      let resultTemp
      let diffArr = []
      if(isOnlyShowDiff){
          resultTemp = Object.keys(collectionPropertyTemp).map(
          (item) => {
            const gridDataLastLevel = collectionPropertyTemp[item].data.gridData.filter(
              (dataitem) =>{
                diffArr = Object.keys(dataitem).filter(
                  itemkey=>{
                    if(itemkey.includes('modifyState_') && dataitem[itemkey]!=='0'){
                      return true
                    }
                    else{
                      return false
                    }
                  }
                )
                console.log('diffArr',diffArr)
                if(diffArr.length>0){
                  return true
                }
                else{
                  return false
                }
              }
            )
            if(resultTemp){
        // 找到父级
              const parentArr = gridDataLastLevel.filter(item =>{
                    let diffChilder = resultTemp.find(diffitem =>{
                      return diffitem.parentId === item.id
                    })
                    if(diffChilder){
                      return true
                    }
                    else{
                      return false
                    }
                  })
                if(Array.isArray(parentArr)){
                    collectionPropertyTemp[item].data.gridData = [...parentArr,...resultTemp]
                }
                else{
                  collectionPropertyTemp[item].data.gridData =resultTemp
                }
            }
            else{
               collectionPropertyTemp[item].data.gridData =[]
            }
            return collectionPropertyTemp[item]
            // collectionPropertyTemp[item].data.gridData=gridDataTemp
          }
        )
        return collectionPropertyTemp
      }
      else{
        return collectionPropertyTemp
      }
    }
    
  }
};
</script>


<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #c0c4cc;
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
<style lang="scss">
  .versioncom{
    .el-collapse-item__content{
      padding-bottom: 0px;
    }
    .el-table thead th {
      background-color: #f5f7fa;
    }
  }

</style>
