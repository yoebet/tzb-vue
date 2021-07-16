export interface DmcAuditTabStat {

  runResOid: string

  runOid: string

  auditEntityId: string

  auditEntity: string

  auditResource: string

  dbResourceCode: string

  dbResourceName: string

  structId: string

  tabOwner: string

  tabCode: string

  tabName: string

  etOid: string

  etlTaskName: string

  etlNodeInstanceid: string

  checkObjId: string

  tmResultStatus: number

  tmResultDesc: string

  resOid: string

  // 执行状态，1-创建实例；2-正在执行；3-执行成功;4-执行失败
  execStatus: number

  execStatusName?: string

  // 执行类型，1-ETL执行，2-手动执行
  execType: number

  // 结果状态，1-正常；2-告警；4-错误
  resultStatus: number

  resultStatusName: string

  resultDesc: string

  resBeginTime: string

  resEndTime: string

  accountTime: string

  // 账期类型：1-日，2-月
  accountTimeType: number

  accountTimeTypeName?: number
}

export class DmcAuditTabCodes {

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

  static AccountTypeNames: Record<string, string> = {
    s1: '日',
    s2: '月',
  }
}
