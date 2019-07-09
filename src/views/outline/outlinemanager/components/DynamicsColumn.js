import EditGridItem from './EditGridItem'

// 生成动态表头配置
export default {
  name: 'DynamicsColumn',

  components: {
    EditGridItem
  },

  props: {
    currentYear: {
      type: Number,
      default: 2019
    },
    year: {
      type: Number,
      default: 4
    },
    wd: {
      type: String,
      default: '季度'
    },
    columnConfigs: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    wdArr: {
      type: Array,
      default: []
    },
    type: {
      type: String,
      default: '货值' // 货值
    },
  },

  render(h) {
    const columns = this.dynamicsColumn
    const columnsNodes = columns.map(item => {
      return this.renderChildrenColumn(item)
    })
    return (
      <el-table-column
            label={this.columnConfigs.label}
            align='center'
          >
        {
          columnsNodes
        }
      </el-table-column>
    )
  },

  computed: {
    dynamicsColumn() {
      if (this.type === '货值') {
        // 动态列
        // 供货面积和供货金额两类
        const arrYear = []
        // 第二级 年份
        arrYear.push({
          label: `${this.currentYear}年前`,
          children: [],
          prop: `${this.columnConfigs.prop}_${this.currentYear}年前`,
          width: this.width,
        })
        for (let i = 0; i < this.year; i++) {
          const objYear = {
            label: `${this.currentYear + i}年`,
            children: [],
            prop: `${this.columnConfigs.prop}_${this.currentYear + i}年`,
            width: this.width,
            align: this.wd !== '年度' ? 'center' : 'right'
          }
          // 第三级 填写维度
          this.wdArr.forEach(wditem => {
            objYear.children.push({
              label: wditem,
              prop: `${this.columnConfigs.prop}_${this.currentYear + i}年_${wditem}`,
              width: this.width
            })
          })
          arrYear.push(objYear)
        }
        arrYear.push({
          label: `${this.currentYear + this.year - 1}年后`,
          children: [],
          prop: `${this.columnConfigs.prop}_${this.currentYear + this.year - 1}年后`,
          width: this.width
        })

        return arrYear
      }
    },
  },

  data() {
    return {
      width: '130px'
    }
  },

  created() {
  },

  methods: {
    renderChildrenColumn(columnConfig) {
      // 递归方法，生成子级的Column配置
      const columNode = (
        <el-table-column
          label={columnConfig.label}
          key={`${this.wd}_${this.year}_${columnConfig.prop}`}
          align={columnConfig.align ? columnConfig.align : 'right'}
          show-overflow-tooltip={true}
          width={columnConfig.width}
          {
            ...{
            scopedSlots: {
                default: props => {
                  if (!columnConfig.children || columnConfig.children.length === 0) {
                    return (<div>{props.row.children[columnConfig.prop]}</div>)
                  }
                }
              }
            }
          }
          >
          {(columnConfig.children && columnConfig.children.length > 0)
                  ? columnConfig.children.map(twoitem => {
            return (this.renderChildrenColumn(twoitem))
            }) : ''}
        </el-table-column>
      )
      return columNode
    },
    valueChange(row, column, val, prop) {
      this.$emit('change', row, column, val, prop)
    }
  }
}
