const DefaultPageSize = 10
const DateFormat = 'YYYY-MM-DD'
const DateTimeHMFormat = 'YYYY-MM-DD HH:mm'
const DateTimeHMSFormat = 'YYYY-MM-DD HH:mm:ss'

const dayMills = 3600 * 1000 * 24

const DateShortcuts = [{
  text: '今天',
  value: new Date(),
}, {
  text: '昨天',
  value: (() => {
    const date = new Date()
    date.setTime(date.getTime() - dayMills)
    return date
  })(),
}, {
  text: '一周前',
  value: (() => {
    const date = new Date()
    date.setTime(date.getTime() - dayMills * 7)
    return date
  })(),
}]

const DefaultOaRemark = '这是本月的数据质量问题，请至数据质量管控平台查看，做好排查分析，并制定整改计划。'

export {
  DateFormat,
  DateTimeHMFormat,
  DateTimeHMSFormat,
  DateShortcuts,
  DefaultPageSize,
  DefaultOaRemark
}
