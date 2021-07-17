export interface DmcAuditSentOaDep {
  wflowRunOid?: string
  sentOaOid?: string

  oid?: string

  depId: string
  depName: string
  userId: string
  tableCount: number
  failedRulesCount: number
  remark: string

  accountTime: string
}