export interface DmcRuleResultDataFile {

  oid: string

  dataDate: string
  execDate: string
  tabCode: string
  ruleId: string

  fileName: string
  fileReady: boolean
  zipFile: boolean
  contentFormat: string
  fieldCodeHeader: boolean
  fieldNameHeader: boolean
  dataRowCount: number
  columnCount: number

  downloaded: boolean
  downloadedAt: string

  fileDownloadUrl: string
}
