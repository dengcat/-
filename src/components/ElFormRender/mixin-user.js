/**
 * 该 mixin 负责处理个性化规则
 */
export default {
  created() {
    this.$watch(
			function() { // 处理你要监听的属性，只要将其return出去就行
				return this.savedata['产品类型__text']
			},
			function(val, oldval) {
        if (val === '地下车位' || val === '地下商业') {
          this.dataContent = this.dataContent.map(item => {
            item.children.map(children => {
              if (children.name === '地下建筑面积') {
                children.isMustFill = true
              }
              return children
            })
            return item
         })
        } else {
          this.dataContent = this.dataContent.map(item => {
            item.children.map(children => {
              if (children.name === '地下建筑面积') {
                children.isMustFill = false
              }
              return children
            })
            return item
         })
        }
			}
		)
  },
}
