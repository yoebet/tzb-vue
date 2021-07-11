function timeElapseLabel(startTime: number | string, endTime: number | string): string {
  if (!startTime || !endTime) {
    return ''
  }
  let timeElapse = ''
  let seconds = Math.round(((+endTime) - (+startTime)) / 1000)
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 60)
    seconds = seconds % 3600
    timeElapse = hours + '小时'
  }
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60)
    seconds = seconds % 60
    timeElapse = timeElapse + minutes + '分'
  }
  timeElapse = timeElapse + seconds + '秒'
  return timeElapse
}


export {timeElapseLabel}
