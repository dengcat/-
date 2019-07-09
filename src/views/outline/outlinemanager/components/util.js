import numeral from 'numeral'

export function calcTotal(row, key, sumKey) {
  const xj = row.datas.filter(item => {
    return item.year.indexOf('小计') >= 0
  })
  xj.forEach(item => {
    item[key] = 0
  })
  row.datas.forEach(element => {
    if (element.year.indexOf('小计') < 0) {
      const curxj = xj.find(xjitem => {
        return xjitem.year.replace('小计', '') === element.year
      })
      if (!curxj[key]) {
        curxj[key] = myNumeral(element[key]).value()
      } else {
        curxj[key] = myNumeral(curxj[key]).add(myNumeral(element[key]).value()).value()
      }
    }
  })
  let sum = 0
  xj.forEach(item => {
    sum = myNumeral(sum).add(myNumeral(item[key]).value()).value()
  })
  row[sumKey] = sum
  row.datas.forEach(item => {
    item[sumKey] = sum
  })
}

// 计算IRR
export function IRRCalc(CArray) {
  let min = -1.0
  let max = 1.0
  let NPV = 0
  let guest = (min + max) / 2
  do {
    guest = (min + max) / 2
    NPV = 0
    for (var j = 0; j < CArray.length; j++) {
          NPV += CArray[j] / Math.pow((1 + guest), j)
    }
    if (NPV > 0) {
      min = guest
    } else {
      max = guest
    }
  } while (Math.abs(NPV) > 0.000001)
  return guest * 100
}

export function myNumeral(val) {
  if (!val) {
    val = 0
  }

  if (numeral.isNumeral(val)) {
    return val
  } else {
    return numeral(val)
  }
}
