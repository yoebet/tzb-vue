import {DmcTaskResult} from "@/models/dmc-task-result";
import {Page} from "@/api/page";

export async function getTaskResults(): Promise<Page<DmcTaskResult>> {
  // base='http://localhost:8100'
  const response = await fetch('/api/task-results')
  const page: Page<DmcTaskResult> = await response.json()
  return Promise.resolve(page)
}
