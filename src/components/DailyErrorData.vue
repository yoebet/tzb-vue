<template>
  <el-page-header @back="goback" class="page-header">
    <template #content>
      <div class="page-header-content" v-if="etlWflowRun">
        <span class="page-title">稽核错误数据</span>
        &nbsp;&nbsp;
        开始执行时间：<span class="flow-prop-value">{{ etlWflowRun.startTimeLabel }}</span>
      </div>
    </template>
  </el-page-header>

  <div class="flex-bar">
    <el-form :inline="true" class="filter-form">
      <el-form-item label="规则显示">
        <el-radio-group v-model="showAllRules" @change="filterChange">
          <el-radio :label="true">全部规则</el-radio>
          <el-radio :label="false">仅错误规则</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="spacer"></div>
    <div>
      <el-button type="text" @click="collapseNames=[]">
        <i class="el-icon-caret-top"></i>
        全部收起
      </el-button>
    </div>
  </div>


  <el-collapse v-model="collapseNames" :accordion="false" class="rules-accordions">
    <el-collapse-item :name="'s-'+group.code" v-for="group in sGroups" :key="group.code">
      <template #title>
        <div class="accordion-title">
          <span class="collapse-group-name1">{{ group.name }}</span>
          <span class="collapse-group-account-times">&nbsp;&nbsp;{{ group.accountTimes }}</span>
          &nbsp;（<span class="failed-rules-count">{{ group.failedCount }}</span>
          <span class="rules-count" v-if="showAllRules"> / {{ group.tableData.length }}</span>）
        </div>
      </template>
      <el-table
          stripe
          :data="group.tableData"
          :cell-class-name="cellClassName"
          @filter-change="tableFilterChange($event,group)"
          row-key="resdOid"
          style="width: 100%">
        <el-table-column
            type="index"
            align="right"
            label="#">
        </el-table-column>
        <el-table-column
            sortable
            prop="tab.tabName"
            class-name="tab-name"
            label="表名">
        </el-table-column>
        <el-table-column
            sortable
            prop="ruleName"
            class-name="rule-name"
            min-width="150"
            label="规则名">
        </el-table-column>
        <el-table-column
            sortable
            :sort-method="sortByFieldCode"
            label="源字段">
          <template #default="scope">
            {{ scope.row.fieldCode }} <br>
            {{ scope.row.fieldName }}
          </template>
        </el-table-column>
        <el-table-column
            sortable
            :sort-method="sortByStdFieldCode"
            width="160"
            label="标准字段">
          <template #default="scope">
            {{ scope.row.stdFieldCode }} <br>
            {{ scope.row.stdFieldName }}
          </template>
        </el-table-column>
        <el-table-column
            sortable
            prop="stdDepName"
            label="管理部门">
        </el-table-column>
        <el-table-column
            sortable
            prop="resdResultName"
            width="80"
            class-name="result-status"
            label="结果">
          <template #default="scope">
            <span :class="'result-status-'+scope.row.resdResultStatus+ ' run-status-'+scope.row.resdExecStatus">
              {{ scope.row.resdResultName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
            min-width="200"
            prop="resdResultDesc"
            label="错误信息">
        </el-table-column>
        <el-table-column
            type="expand"
            prop="sampleErrorDataOid"
            label="数据">
          <template #default="scope">
            <sample-errordata-list :rule-result="scope.row"
                                   :structs-map="structsMap"
                                   v-if="scope.row.sampleErrorDataOid"></sample-errordata-list>
          </template>
        </el-table-column>
        <el-table-column
            min-width="50"
            prop="sendToDep"
            label="下载">
        </el-table-column>
      </el-table>
    </el-collapse-item>
  </el-collapse>

  <p>&nbsp;</p>
  <p>&nbsp;</p>

</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {getAuditRuleResults, getWflowRunByOid} from "@/api/etl-wflow-run-api";
import {DmcAuditRuleResult, DmcAuditRuleResultCodes as Codes} from "@/models/dmc-audit-rule-result";
import SentOaRecordList from "@/components/SentOaRecordList.vue";
import SampleErrordataList from "@/components/SampleErrordataList.vue";
import {MetaStructField} from "@/models/meta-struct-field";
import {DateFormat, DateTimeHMSFormat} from "@/config";
import {EtlWflowRun} from "@/models/etl-wflow-run";
import moment from "moment";

interface CollapseGroup {
  code: string,
  name: string,
  failedCount: number
  accountTimes: string
  tableData: DmcAuditRuleResult[]
  filters?: any
}


@Options({
  watch: {},
  components: {
    SentOaRecordList,
    SampleErrordataList
  }
})
export default class DailyErrorData extends Vue {
  etlWflowRun: EtlWflowRun | null = null
  allRuleData: DmcAuditRuleResult[] | null = null
  errorRuleData: DmcAuditRuleResult[] | null = null
  errorRuleDataMap: Map<string, DmcAuditRuleResult> = new Map<string, DmcAuditRuleResult>()
  showAllRules = false
  sGroups: CollapseGroup[] = []

  // structId -> (fieldCode -> field)
  structsMap: Map<string, (Map<string, MetaStructField>)> = new Map<string, Map<string, MetaStructField>>()

  tableDataLoading = false
  private runOid = ''
  private collapseNames: string[] | null = null
  private resdResultStatus = -2

  groupRules(ruleResults: DmcAuditRuleResult[],
             collapseNamePrefix: string,
             pushCollapseName: boolean): CollapseGroup[] {

    const groupsMap = new Map<string, DmcAuditRuleResult[]>()
    for (const rr of ruleResults) {
      const code = rr.tab.tabCode
      let list = groupsMap.get(code)
      if (!list) {
        list = []
        groupsMap.set(code, list)
      }
      list.push(rr)
    }

    const groups: CollapseGroup[] = []
    for (const [code, list] of Array.from(groupsMap)) {
      const tab = list[0].tab
      const accountTimes = Array.from(new Set<string>(list.map(rr => rr.tab.accountTime).filter(at => at))).join(',')
      const failedCount = list.filter(rr => rr.failed).length
      groups.push({code, name: tab.tabName, failedCount, accountTimes, tableData: list})

      if (pushCollapseName && this.collapseNames) {
        this.collapseNames.push(collapseNamePrefix + code)
      }
    }

    return groups
  }

  set tableData(ruleResults: DmcAuditRuleResult[]) {
    const sTableData: DmcAuditRuleResult[] = []
    ruleResults.forEach(wf => {
      if (!wf.xsRule) {
        sTableData.push(wf)
      }
    })

    const pushCollapseName = this.collapseNames === null
    if (pushCollapseName) {
      this.collapseNames = []
    }
    this.sGroups = this.groupRules(sTableData, 's-', pushCollapseName)

    this.tableDataLoading = false
  }

  get tableData(): DmcAuditRuleResult[] {
    return []
  }

  async created(): Promise<void> {
    if (this.$route.params.runOid) {
      this.runOid = this.$route.params.runOid as string
    }
    if (!this.runOid) {
      return
    }
    const run: EtlWflowRun = await getWflowRunByOid(this.runOid)
    if (run.startTime) {
      const st = moment(+run.startTime)
      run.startTimeLabel = st.format(DateTimeHMSFormat)
    }
    this.etlWflowRun = run

    await this.fetchData()
  }

  async fetchData(): Promise<void> {
    this.tableDataLoading = true
    let list: DmcAuditRuleResult[] = await getAuditRuleResults(this.runOid,
        this.showAllRules ? null : this.resdResultStatus)
    if (!list) {
      this.tableDataLoading = false
      return
    }

    list = list.map(wf => {
      wf.failed = wf.resdExecStatus === 4 || wf.resdResultStatus !== 1
      if (wf.failed) {
        const cur = this.errorRuleDataMap.get(wf.resdOid)
        if (cur) {
          return cur
        }
        this.errorRuleDataMap.set(wf.resdOid, wf)
      }
      wf.resdResultStatusName = Codes.ResultStatusNames['s' + wf.resdResultStatus]
      wf.resdExecStatusName = Codes.ExecStatusNames['s' + wf.resdExecStatus]
      wf.resdResultName = wf.resdResultStatusName
      if (!wf.resdResultName && wf.resdExecStatus === 4) {
        wf.resdResultName = '执行错误'
      }
      if (wf.resdExecStatus === 4) {
        wf.resdResultDesc = ''
      }
      if (wf.resdResultDesc) {
        wf.resdResultDesc = wf.resdResultDesc.replace('数据错误,', '数据错误，')
        if (wf.resdResultDesc.indexOf('&') >= 0) {
          wf.resdResultDesc = wf.resdResultDesc.replace('&lt;', '<')
          wf.resdResultDesc = wf.resdResultDesc.replace('&gt;', '>')
        }
      }

      if (wf.ruleFlag) {
        wf.ruleFlagVal = wf.ruleFlag.flag
      } else {
        wf.ruleFlagVal = ''
      }
      return wf
    })
    this.tableData = list

    if (this.showAllRules) {
      this.allRuleData = list
    } else {
      this.errorRuleData = list
    }
  }

  cellClassName({row, column}: { row: DmcAuditRuleResult, column: any }): string {
    if (column.property === 'sampleErrorDataOid') {
      return row.sampleErrorDataOid ? 'expandable' : 'no-expand'
    }
    return ''
  }

  async filterChange(vv: any): Promise<void> {
    const showAll = this.showAllRules
    if (showAll) {
      if (this.allRuleData) {
        this.tableData = this.allRuleData
      } else {
        await this.fetchData()
      }
    } else {
      if (this.errorRuleData) {
        this.tableData = this.errorRuleData
      } else if (this.allRuleData) {
        this.errorRuleData = this.allRuleData.filter(rr => rr.failed)
        this.tableData = this.allRuleData
      } else {
        await this.fetchData()
      }
    }
  }

  sortByFieldCode(a: DmcAuditRuleResult, b: DmcAuditRuleResult): number {
    return (a.fieldCode || '').localeCompare(b.fieldCode || '')
  }

  sortByStdFieldCode(a: DmcAuditRuleResult, b: DmcAuditRuleResult): number {
    return (a.stdFieldCode || '').localeCompare(b.stdFieldCode || '')
  }


  tableFilterChange(filters: any, group: CollapseGroup): void {
    group.filters = filters
  }

  goback(): void {
    window.history.back()
  }

}

</script>

<style lang="scss" scoped>

.page-header {
  margin-bottom: 2em;

  .page-title {
    color: #108ee9;
  }

  .page-header-content {

    .flow-prop-value {
      color: darkgreen;
    }
  }
}

.el-radio {
  margin-right: 15px;
}

.flex-bar {
  display: flex;
  padding-right: 8px;
}

.spacer {
  flex: auto;
}

.el-form--inline.filter-form .el-form-item:not(:first-child) {
  margin-left: 30px;
}

.accordion-title {
  font-weight: bold;
}

.el-icon-close {
  cursor: pointer;
}

.collapse-group-name1 {
  color: darkred;
}

.failed-rules-count {
  color: indianred;
}

.rules-count {
  color: #404040;
}

.run-status-3 {
  color: green;
}

.run-status-4 {
  color: coral;
}

.result-status-1 {
  color: green;
}

.result-status-4 {
  color: rgba(255, 0, 0, 0.6);
}


</style>
