import {Page} from "@/api/page";
import {EtlWflowRun, EtlWflowRunFilter} from "@/models/etl-wflow-run";

export async function getEtlWflowRuns(filter: EtlWflowRunFilter): Promise<Page<EtlWflowRun>> {
  // base='http://localhost:8100'

  const response = await fetch('/api/wflow-runs?'
    + new URLSearchParams((filter as unknown) as Record<string, string>))
  const page: Page<EtlWflowRun> = await response.json()
  return Promise.resolve(page)
}
