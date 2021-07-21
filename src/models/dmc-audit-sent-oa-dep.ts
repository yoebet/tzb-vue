export interface DmcAuditSentOaDep {
  wflowRunOid?: string
  sentOaOid?: string
  oid?: string

  depId: string
  depName: string
  userId: string // loginId
  userName: string

  checkType: string
  tableCount: number
  failedRulesCount: number
  remark: string

  accountTime: string
}
