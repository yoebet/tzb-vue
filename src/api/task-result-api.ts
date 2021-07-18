import {DmcTaskResult} from "@/models/dmc-task-result";
import {Page} from "@/api/page";
import {DmcTaskResultErrordata} from "@/models/dmc-task-result-errordata";

export async function getTaskResults(): Promise<Page<DmcTaskResult>> {
  const response = await fetch('/api/task-results')
  const page: Page<DmcTaskResult> = await response.json()
  return Promise.resolve(page)
}

export async function getSampleErrordata(oid: string): Promise<DmcTaskResultErrordata> {
  const response = await fetch('/api/task-results/errordata-sample/' + oid)
  const errordata: DmcTaskResultErrordata = await response.json()
  return Promise.resolve(errordata)
}
