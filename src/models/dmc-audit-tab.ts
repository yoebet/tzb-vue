export interface DmcAuditTab {

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

  checkObjId: string

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
