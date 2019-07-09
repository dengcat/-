/**
 * 该 mixin 提供vue页面公用方法
 */
export default {
  data() {
    return {
      clientHeight: document.documentElement.clientHeight
    }
  },
  mounted: function() {
      window.addEventListener('resize', this.handleResize)
    },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize(event) {
      this.clientHeight = document.documentElement.clientHeight
    },
  }
}
