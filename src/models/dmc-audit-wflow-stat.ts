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

  // i: initial, s: sent, d: done
  oaStatus: string

  oaOperator: string
  oaSolvedTime: string

  oaSentCount: number

  memo: string
  createTime: string

}

export class DmcAuditWflowStatCodes {
  static OaStatusNames: Record<string, string> = {
    si: '未发送',
    ss: '已发送',
    sd: '已终结',
  }

}
