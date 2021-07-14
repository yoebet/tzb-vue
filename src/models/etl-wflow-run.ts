import {Pager} from "@/models/pager";
import {Model} from "@/models/model";
import {DmcAuditNodeCurr} from "@/models/dmc-audit-node-curr";

export interface EtlWflowRun extends Model {

  auditNodes?: DmcAuditNodeCurr[]

  auditNodesCount: number

  // 流程运行ID(=WORKFLOW_RUN_KEY)
  // oid: string

  // 流程定义ID
  workflowKey: string

  workflowCurrentKey: string

  // 流程名称
  workflowName: string

  serverId: string

  serverName: string

  // 流程开始时间
  startTime: string

  // 流程结束时间
  endTime: string

  logFile: string

  // 流程运行错误编码
  runErrCode: number

  runErrMsg: string

  // 流程运行状态编码
  // 0，待触发状态；
  // 1，准备状态；
  // 2，运行状态；
  // 3，等待状态；
  // 4，正在暂停状态；
  // 5，暂停状态；
  // 6，正在终止状态；
  // 7，警告状态；
  // 8，失败状态；
  // 9，成功状态；
  // 10，终止状态；
  // 11，忽略状态；
  runStatusCode: number

  runStatusName?: string

  userName: string

  // 实例启动类型（1代表手动启动，2代表调度启动，3代表子流程，4代表事件触发）
  runType: number

  runTypeName?: string

  codepageId: number

  serverNetId: number

  serverNetName: string

  hasFailedTasks: number

  hasInterrupts: number

  serverNodeId: number

  // 用来存储预测信息的pattern
  serverNodeName: string

  osUser: string

  diRunId: string

  deleteFlag: number

  startType: number

  // 是否单例(现在都为单例，默认为1)
  isSingleton: number

  singletoOption: string

  isRepeat: number

  planExecuteKey: string

  planExecuteTime: string

  // 大图ID
  pipeid: string

  fromTaskRunId: string

  // 流程实例名称
  wfInstName: string

  // 是否上线（1代表流程已发布，0代表未发布）
  isOnline: number

  // 流程进度值
  processSequence: number

  // 是否发送流程启动超时提醒信息，0不发送，1发送；普通流程默认为0，调度流程时默认为1；已发送过提醒的流程的该字段 也将变为0
  whetherSendMessage: string

  // 大图创建时间
  graphCreateTime: number

  // 账期类型，0其他，1日，2月
  accountType: string

  accountTypeName?: string

}

export class EtlWflowRunCodes {
  static RunStatusNames: Record<string, string> = {
    s0: '待触发',
    s1: '准备',
    s2: '运行',
    s3: '等待',
    s4: '正在暂停',
    s5: '暂停',
    s6: '正在终止',
    s7: '警告',
    s8: '失败',
    s9: '成功',
    s10: '终止',
    s11: '忽略'
  }

  static RunTypeNames: Record<string, string> = {
    s1: '手动',
    s2: '调度',
    s3: '子流程',
    s4: '事件触发',
  }

  static AccountTypeNames: Record<string, string> = {
    s0: '其他',
    s1: '日',
    s2: '月',
  }
}


export class EtlWflowRunFilter extends Pager {
  workflowName?: string

  startDateFrom?: string
  startDateTo?: string

  auditNodes?: boolean
}

