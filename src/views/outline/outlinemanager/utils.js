
// 获取动态列
export function dynamicsColumn(arrTypes, currentYear, wd, ) {

}

const wdArr = function(wd) {
  if (wd === '年度') {
    return []
  } else if (wd === '季度') {
    return ['一季度', '二季度', '三季度', '四季度']
  } else {
    return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  }
}
