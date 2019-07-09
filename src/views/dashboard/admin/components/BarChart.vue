<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

const animationDuration = 6000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
        data: ['住宅-高层', '住宅-洋房', '别墅']
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'value',
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'category',
          data: ['合肥-力高澜湖郡', '烟台-力高阳光海岸', '咸阳-御景湾', '南昌-力高冰湖国际'],
          axisTick: {
            show: true
          },
          axisLable: {
            interval: 1,
            rotate: 45
          }
        }],
        series: [{
          name: '住宅-高层',
          type: 'bar',
          stack: 'vistors',
          barWidth: '30%',
          data: [79, 52, 200, 334, 390, 330, 220],
          label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
          animationDuration
        }, {
          name: '住宅-洋房',
          type: 'bar',
          stack: 'vistors',
          barWidth: '30%',
          data: [80, 52, 200, 334, 390, 330, 220],
          label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
          animationDuration
        }, {
          name: '别墅',
          type: 'bar',
          stack: 'vistors',
          barWidth: '30%',
          data: [30, 52, 200, 334, 390, 330, 220],
          label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
          animationDuration
        }]
      })
    }
  }
}
</script>
