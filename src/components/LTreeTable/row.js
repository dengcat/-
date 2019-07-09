import column from './column.vue'
import space from './space.vue'

// 生成动态表头配置
export default {
  name: 'row',
  props: ['data', 'depth', 'columns', 'isdraggable', 'custom_field'],
  data() {
    return {
      open: false,
      visibility: 'visible'
    }
  },
  components: {
    column,
    space
  },
  computed: {
    isFolder() {
      return this.data.children && this.data.children.length > 0
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
    }
  },

  render(h) {
    const tr = this.renderTr()
    const nextTrs = []
    if (this.isFolder) {
      this.data.children.forEach(childrenitem => {
        nextTrs.push(
          <row v-else
            v-show={this.open}
            data={childrenitem}
            columns={this.columns}
            key={childrenitem.id}
            depth={this.depth * 1 + 1}
            custom_field={this.custom_field}
          >
          </row>
        )
      })
    }

    return (
      <fragment>
        {[tr, ...nextTrs]}
      </fragment>
    )
  },
}
