import {Page} from "@/api/page";
import {EtlWflowRun, EtlWflowRunFilter} from "@/models/etl-wflow-run";
import {buildFilterParams} from "@/models/pager";
import {DmcAuditWflowStat} from "@/models/dmc-audit-wflow-stat";
import {DmcAuditTabTask} from "@/models/dmc-audit-tab-task";
import {DmcAuditRuleResult} from "@/models/dmc-audit-rule-result";
import {DmcAuditTab} from "@/models/dmc-audit-tab";

export async function getEtlWflowRuns(filter: EtlWflowRunFilter): Promise<Page<EtlWflowRun>> {
  // base='http://localhost:8100'

  const paramStr = buildFilterParams(filter)
  const response = await fetch('/api/wflow-runs?' + paramStr)
  const page: Page<EtlWflowRun> = await response.json()
  return Promise.resolve(page)
}

export async function getWflowRunStats(filter: EtlWflowRunFilter): Promise<Page<DmcAuditWflowStat>> {
  // base='http://localhost:8100'

  const paramStr = buildFilterParams(filter)
  const response = await fetch('/api/wflow-stats?' + paramStr)
  const page: Page<DmcAuditWflowStat> = await response.json()
  return Promise.resolve(page)
}

export async function getAuditTabStats(runOid: string): Promise<DmcAuditTab[]> {
  const response = await fetch(`/api/audit-mat/wfrun-tabs/${runOid}`)
  const page: DmcAuditTab[] = await response.json()
  return Promise.resolve(page)
}

export async function getAuditRuleResults(runOid: string, resdResultStatus: number | string | null): Promise<DmcAuditRuleResult[]> {
  let url = `/api/audit-mat/wfrun-rules/${runOid}`
  if (resdResultStatus) {
    url += '?resdResultStatus=' + resdResultStatus
  }
  const response = await fetch(url)
  const page: DmcAuditRuleResult[] = await response.json()
  return Promise.resolve(page)
}
