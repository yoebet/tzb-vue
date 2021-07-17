import {DmcAuditSentOaDep} from "@/models/dmc-audit-sent-oa-dep";

export interface DmcAuditSentOa {

  oid?: string

  wflowRunOid: string

  operator?: string
  operatorName?: string
  sentTime?: string

  sentDepCount?: number

  memo?: string

  sentOaDeps: DmcAuditSentOaDep[]
}
