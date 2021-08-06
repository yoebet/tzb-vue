export interface DmcAuditRuleFlag {

  ruleId: string

  // Z: 整改中；Q: 确认中
  flag: string

  resdOid: string

  resOid: string

  flagAddedAt?: string | number

  flagUpdatedAt?: string | number
}
