export interface DmcAuditSentOaDep {
  wflowRunOid?: string
  sentOaOid?: string
  oid?: string

  depId: string // orgid
  depName: string
  userId: string // userid
  userName: string

  checkType: string
  tableCount: number
  failedRulesCount: number
  remark: string

  accountTime: string
}
