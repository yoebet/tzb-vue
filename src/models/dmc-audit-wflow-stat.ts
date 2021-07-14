import {EtlWflowRun} from "@/models/etl-wflow-run";
import {Model} from "@/models/model";

export interface DmcAuditWflowStat extends Model {

  wflowRun: EtlWflowRun

  wflowRunOid: string

  tableCount: number

  ruleCount: number
  ruleFailCount: number

  stdRuleCount: number
  stdRuleFailCount: number

  xRuleCount: number
  xRuleFailCount: number

  // I: initial, S: sent, D: done
  oaStatus: number
  oaRemark: string

  oaOperator: string
  oaSentTime: string
  oaSolvedTime: string

  oaSentContentJson: string

  memo: string
  createTime: string

}
