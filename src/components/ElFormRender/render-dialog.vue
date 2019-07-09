<template>
  <div>
    <el-form ref="form" :model="form" label-position="left" label-width="100px">

      <el-form-item>
        <el-button type="primary" >保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import numeral from 'numeral'

export default {
  name: 'AddProperty',
  filters: {
    intFilter(i) {
      const intMap = {
        0: '是',
        1: '否',
        true: '是',
        false: '否'
      }
      return intMap[i]
    },
    numberFilter(num) {
      return numeral(num).format('0,0.00')
    }
  },
  // props: {
  //   type: {
  //     type: String,
  //     default: '项目',
  //   }
  // },
  data() {
    return {
      form: {
        'id': undefined, // ID
        'name': '数值', // 控件名称 label
        'groupId': 'f75c56c0-70c0-e811-80c3-00155d0a2546', // 所属分组
        'isSystem': true, // 是否系统级  前台不需要
        'isReadonly': false, // 是否只读
        'defaultValue': '', // 默认值
        'propertyType': 0, // 前端不用
        'serviceLine': '运营', // 根据传进来的参数，判断是否只读，比如传进来的是运营，则可以填写，其他的不能填写
        'modifyReasonReq': false, // 修改的时候显示文本框 需要填写修改属性，页面编辑状态才需要
        'isMustFill': false, // 是否必填
        'valueType': '数值', // 控件类型
        'remark': '数值', // 前台不需要
        'unit': '', // 数字类型时  显示的单位
        'dec': 2, // 数字类型时，保留位
        'limitFileCount': 0, // 文件类型时  上传文件限制数量
        'dataItems': '', // 枚举类型时对应的值，逗号分隔
        'businessObjectName': '',
        'legalPersonCompanyUrl': null,
        'businessParamName': '', // 类型为业务参数时，选择的业务参数名字
        'fieldName': null,
        'formulaCondition': null, // 当字段有公式计算时 公式表达式
        'formulaConditionText': null, // 当字段有公式计算时 公式表达式文本形式
        'filterRuleText': null, // 公式的计算规则的文本形式
        'isRefByBusinessData': 0,
        'orderBy': 2, // 页面字段显示顺序
        'parentName': null,
        'isOneLine': false, // 是否独占一行
        'displayFields': null,
        'displayFields__text': '',
        'IsHidden': false, // 是否是隐藏的属性
        'DBKey': null,
        'DisKey': null,
        'isPrimary': false, // 重复分组时用到，是否是主键，主键唯一校验
        'fieldType': null,
        'groupType': 0, // 0 不可重复分组  1可重复分组
        'dataFromType': 0,
        'canSetPrimary': 0,
        'canCancelPrimary': 0,
        'belongProductBusinessObjectGUID': null,
        'belongProductGroupId': null,
        'interfaceId': null,
        'isMulti': false // 是否允许多选
      }
    }
  },
  computed: {
    defaultValueType: function() {
      let result = 'text'
      switch (this.form.valueType) {
        case '数值':
          result = 'number'
          break
      }
      return result
    },
    // defaultValueDisplay: {
    //   get: function(){
    //     return numeral(this.form.defaultValue).format('0,0.00')
    //     // return
    //   },
    //   set: function(value){
    //     console.log('defaultValueDisplayset',value)
    //     this.form.defaultValue =value
    //   }
    // },

  },
  watch: {
  },
  created() {
  },
  methods: {

  }
}
</script>

