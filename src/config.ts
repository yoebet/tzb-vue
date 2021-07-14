const DefaultPageSize = 10
const DateFormat = 'YYYY-MM-DD'
const DateTimeFormat = 'YYYY-MM-DD HH:mm:ss'

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

export {
  DateFormat,
  DateTimeFormat,
  DateShortcuts,
  DefaultPageSize
}
