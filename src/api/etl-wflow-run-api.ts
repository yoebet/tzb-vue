import {Page} from "@/api/page";
import {EtlWflowRun, EtlWflowRunFilter} from "@/models/etl-wflow-run";
import {buildFilterParams} from "@/models/pager";
import {DmcAuditWflowStat} from "@/models/dmc-audit-wflow-stat";
import {DmcAuditRuleResult} from "@/models/dmc-audit-rule-result";
import {DmcAuditTab} from "@/models/dmc-audit-tab";
import {Result} from "@/models/result";

export async function getEtlWflowRuns(filter: EtlWflowRunFilter): Promise<Page<EtlWflowRun>> {
  const paramStr = buildFilterParams(filter)
  const response = await fetch('/api/wflow-runs?' + paramStr)
  const page: Page<EtlWflowRun> = await response.json()
  return Promise.resolve(page)
}

export async function getWflowRunByOid(oid: string): Promise<EtlWflowRun> {
  const response = await fetch('/api/wflow-runs/' + oid)
  const run: EtlWflowRun = await response.json()
  return Promise.resolve(run)
}

export async function getWflowRunStats(filter: EtlWflowRunFilter): Promise<Page<DmcAuditWflowStat>> {
  const paramStr = buildFilterParams(filter)
  const response = await fetch('/api/wflow-stats?' + paramStr)
  const page: Page<DmcAuditWflowStat> = await response.json()
  return Promise.resolve(page)
}

export async function setWflowOaStatus(runOid: string, status: string): Promise<Result<never>> {
  const response = await fetch(`/api/wflow-stats/oa-status/${runOid}/${status}`,
    {
      method: 'post',
      headers: {'content-type': 'application/json'}
    })
  const result: Result<never> = await response.json()
  return Promise.resolve(result)
}


export async function getAuditTabStats(runOid: string): Promise<DmcAuditTab[]> {
  const response = await fetch(`/api/audit-mat/wfrun-tabs/${runOid}`)
  const page: DmcAuditTab[] = await response.json()
  return Promise.resolve(page)
}

export async function getAuditRuleResults(runOid: string,
                                          resdResultStatus: number | string | null): Promise<DmcAuditRuleResult[]> {
  let url = `/api/audit-mat/wfrun-rules/${runOid}`
  if (resdResultStatus) {
    url += '?resdResultStatus=' + resdResultStatus
  }
  const response = await fetch(url)
  const page: DmcAuditRuleResult[] = await response.json()
  return Promise.resolve(page)
}
