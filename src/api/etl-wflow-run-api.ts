import {Page} from "@/api/page";
import {EtlWflowRun, EtlWflowRunFilter} from "@/models/etl-wflow-run";
import {buildFilterParams} from "@/models/pager";
import {DmcAuditWflowStat} from "@/models/dmc-audit-wflow-stat";

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
