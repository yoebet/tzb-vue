import {DmcRuleResultDataFile} from "@/models/dmc-rule-result-data-file";

export interface DmcErrorRuleResult {

  resOid: string

  tabCode: string

  tabName: string

  resdOid: string

  ruleId: string

  ruleName: string

  checkTypeCode: string

  fieldCode: string

  fieldName: string

  resultDesc: string

  sampleErrorDataOid?: string

  resultDataFile?: DmcRuleResultDataFile

}
