import {DmcAuditSentOa} from "@/models/dmc-audit-sent-oa";
import {Result} from "@/models/result";
import {API_BASE_PATH} from "@/config";

export async function getSentOaRecords(runOid: string): Promise<DmcAuditSentOa[]> {
  const response = await fetch(API_BASE_PATH + '/api/audit-oa/sent-records/' + runOid)
  const records: DmcAuditSentOa[] = await response.json()
  return Promise.resolve(records)
}

export async function sendOa(runOid: string, sentOa: DmcAuditSentOa): Promise<Result<DmcAuditSentOa>> {
  const response = await fetch(API_BASE_PATH + '/api/audit-oa/send-oa/' + runOid,
    {
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(sentOa)
    })
  const result: Result<DmcAuditSentOa> = await response.json()
  return Promise.resolve(result)
}
