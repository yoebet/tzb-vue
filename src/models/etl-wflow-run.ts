import {Pager} from "@/models/pager";
import {Model} from "@/models/model";

export interface EtlWflowRun extends Model {

  // 流程运行ID(=WORKFLOW_RUN_KEY)
  oid: string

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
  runStatusCode: number

  userName: string

  // 2代表调度启动
  runType: number

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

  // 是否单例
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

  // 是否上线
  isOnline: number

  // 流程进度值
  processSequence: number

  // 是否发送流程启动超时提醒信息，0不发送，1发送；普通流程默认为0，调度流程时默认为1；已发送过提醒的流程的该字段 也将变为0
  whetherSendMessage: string

  // 大图创建时间
  graphCreateTime: number

  // 账期类型，0其他，1日，2月
  accountType: string

}

export class EtlWflowRunFilter extends Pager {
  workflowName?: string

  startDateFrom?: string
  startDateTo?: string
}
