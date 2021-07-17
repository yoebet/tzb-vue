import {DmcAuditSentOa} from "@/models/dmc-audit-sent-oa";
import {Result} from "@/models/result";

export async function getSentOaRecords(runOid: string): Promise<DmcAuditSentOa[]> {
  const response = await fetch('/api/audit-oa/sent-records/' + runOid)
  const records: DmcAuditSentOa[] = await response.json()
  return Promise.resolve(records)
}

export async function sendOa(runOid: string): Promise<Result<DmcAuditSentOa>> {
  const response = await fetch('/api/audit-oa/send-oa/' + runOid,
    {method: 'post'})
  const result: Result<DmcAuditSentOa> = await response.json()
  return Promise.resolve(result)
}
