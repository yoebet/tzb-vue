import {Model} from "@/models/model";

export interface DmcAuditNodeCurr extends Model {

  // 工作流KEY
  wfKey: string

  // 工作流KEY(不变)
  wfCpmmonKey: string

  // 工作流稽核任务ID(工作流提供)
  wfInstanceId: string

  // 工作流稽核任务ID(不变，工作流提供)
  wfInstanceCommId: string

  // 稽核节点定义ID
  auditNodeDefId: string

  // 当前版本编号
  version: number

  auditEntityId: string

  // 稽核实体所需的json描述
  auditEntity: string

  // 稽核资源所需的json描述
  auditResource: string

  // 稽核对象所需的json描述
  auditCheckObj: string

  // 稽核规则定义所需的json
  auditRuleDef: string

  // 待执行稽核规则json
  auditRule: string

  commonId: string

  // 删除标识
  deleteFlag: number

  // 租户ID
  tenantId: string

  // 稽核参数所需的json描述
  auditParameters: string

  // 稽核任务类型，local/other，local指数据质量自己调任务，other指第三方调
  taskType: string

  // 稽核队列，可空，空为集群默认队列
  queueName: string

  // 参照性合并sql个数，默认5（主要是针对有参照表的情况）
  referenceNumber: number

  // 稽核执行参数，json数组
  configParam: string

  // 是否重试，是1，否0
  isReConn: number

  // 重连次数，默认值是3
  reConnTimes: number

  // 重试间隔（单位秒），默认值是10
  sleepTime: number

  // 稽核任务主对象id
  commonObjId: string

  // 启动方式，0为一次性，1为计划周期
  runningType: number

  // 计划调度id（统一调度，直接调用接口）
  scheduleId: string

  // 稽核实体对象名称
  auditCheckObjName: string

  // 稽核资源名称
  auditResourceName: string

  // 是否保存错误明细
  isSaveError: number

  // 错误明细的表及字段信息的json串
  errorTableJson: string

  // 是否启动调度：1是，0否
  scheduleIsStart: string

  // 资源模型类型
  resourceModelId: string
}
