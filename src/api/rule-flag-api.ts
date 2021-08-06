import {Result} from "@/models/result";
import {API_BASE_PATH} from "@/config";
import {DmcAuditRuleFlag} from "@/models/dmc-audit-rule-flag";

export async function removeRuleFlag(ruleId: string): Promise<Result<void>> {
  const response = await fetch(API_BASE_PATH + '/api/rule-flag/rm/' + ruleId,
    {
      method: 'delete',
    })
  const result: Result<void> = await response.json()
  return Promise.resolve(result)
}

export async function setRuleFlag(ruleFlag: DmcAuditRuleFlag): Promise<Result<void>> {
  const response = await fetch(API_BASE_PATH + '/api/rule-flag/set',
    {
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(ruleFlag)
    })
  const result: Result<void> = await response.json()
  return Promise.resolve(result)
}
