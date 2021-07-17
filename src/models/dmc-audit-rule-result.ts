import {DmcAuditTabTask} from "@/models/dmc-audit-tab-task";

export interface DmcAuditRuleResult {

  tab: DmcAuditTabTask

  sendToDep?: string[]

  sendToDepLast?: string[]

  resdOid: string

  xsRule?: boolean

  taskResultId: string

  failed?: boolean

  // 执行状态，1-创建实例；2-正在执行；3-执行成功;4-执行失败
  resdExecStatus: number

  resdExecStatusName?: string

  // 结果状态，1-正常；2-告警；4-错误
  resdResultStatus: number

  resdResultStatusName?: string

  resdResultName?: string

  resdResultDesc: string

  etlTaskId: string

  objRuleId: string

  ruleId: string

  ruleName: string

  checkTypeCode: string

  fieldOid: string

  fieldCode: string

  fieldName: string

  fieldType: string

  stdOid: string

  stdFieldCode: string

  stdFieldName: string

  stdDepId: string

  stdDepName: string
}

export class DmcAuditRuleResultCodes {

  static ExecStatusNames: Record<string, string> = {
    s1: '未运行',
    s2: '运行中',
    s3: '成功',
    s4: '失败',
  }

  static ResultStatusNames: Record<string, string> = {
    s1: '正常',
    s2: '告警',
    s4: '错误',
  }
}
