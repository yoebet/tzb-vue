import {DmcTaskResult} from "@/models/dmc-task-result";
import {Page} from "@/api/page";
import {DmcTaskResultErrordata} from "@/models/dmc-task-result-errordata";
import {MetaStructField} from "@/models/meta-struct-field";
import {API_BASE_PATH} from "@/config";
import {DmcErrorRuleResult} from "@/models/dmc-error-rule-result";

export async function getTaskResults(): Promise<Page<DmcTaskResult>> {
  const response = await fetch(API_BASE_PATH + '/api/task-results')
  const page: Page<DmcTaskResult> = await response.json()
  return Promise.resolve(page)
}

export async function getSampleErrordata(oid: string): Promise<DmcTaskResultErrordata> {
  const response = await fetch(API_BASE_PATH + '/api/task-results/errordata-sample/' + oid)
  const errordata: DmcTaskResultErrordata = await response.json()
  return Promise.resolve(errordata)
}

export async function getStructFields(structId: string): Promise<MetaStructField[]> {
  const response = await fetch(API_BASE_PATH + '/api/task-results/struct-fields/' + structId)
  const fields: MetaStructField[] = await response.json()
  return Promise.resolve(fields)
}

export async function getErrorRuleResults(execDate: string): Promise<DmcErrorRuleResult[]> {
  const response = await fetch(API_BASE_PATH + '/api/task-results/error-results/exec-date/' + execDate)
  const results: DmcErrorRuleResult[] = await response.json()
  return Promise.resolve(results)
}

export async function findStructId(tabCode: string): Promise<string | null> {
  const response = await fetch(API_BASE_PATH + '/api/task-results/struct-id/' + tabCode)
  const structId: string | null = await response.json()
  return Promise.resolve(structId)
}

