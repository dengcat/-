
// 生成动态表头配置
export default {
  name: 'LTbody',
  props: ['data', 'depth', 'columns', 'isdraggable', 'custom_field'],
  data() {
    return {
    }
  },
  methods: {
    toggle() {
      if (this.isFolder) {
        this.open = !this.open
        // this.$forceUpdate();
      }
    },
    renderTr() {
      return (
        <tr>
          {
            this.columns.forEach(subItem => {
              return (
                subItem.type === 'selection' ? this.renderSelectionTd(subItem) : this.renderTd(subItem)
              )
            })
          }
        </tr>
      )
    },
    renderSelectionTd(subItem) {
      const deptNode = (<space depth={this.depth} />)
      let spanNode
      let textNode
      if (this.data.children && this.data.children.length) {
        spanNode = (
          <span
            on-click={this.toggle}
            class='zip-icon'
            class={[open ? 'arrow-bottom' : 'arrow-right']}
          >
          </span>
        )
      } else {
        spanNode = (
          <span
          class='zip-icon arrow-transparent'
        >
        </span>
        )
      }

      if (subItem.formatter) {
        textNode = (<span
        >
        {subItem.formatter(this.data)}
        </span>)
      } else {
        textNode = (<span
        >{this.data[subItem.field]}</span>)
      }

      return [deptNode, spanNode, textNode]
    },
    renderTd(subItem) {
      let textNode
      if (subItem.formatter) {
        textNode = (<span
        >
        {subItem.formatter(this.data)}
        </span>)
      } else {
        textNode = (<span
        >{this.data[subItem.field]}</span>)
      }

      return textNode
    },
    renderTrs(item, trs) {
      trs.push((<tr><td>111</td></tr>))
      trs.push((<tr><td>111</td></tr>))
      if (item.children) {
        item.children.forEach(childrenitem => {
          this.renderTrs(childrenitem, trs)
        })
      }
    }
  },

  render(h) {
    const trs = this.renderTrs()
    return (
      <Tbody>
        {trs}
      </Tbody>
    )
  },
}
