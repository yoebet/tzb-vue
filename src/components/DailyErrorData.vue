<template>
  <el-form :inline="true" class="filter-form">
    <el-form-item label="数据日期">
      <el-date-picker
          v-model="filter.dataDate"
          type="date"
          placeholder=""
          :shortcuts="dateShortcuts"
          :format="dateFormat"
          :value-format="dateFormat"
          class="date-field"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="fetchData">查询</el-button>
    </el-form-item>
  </el-form>

  <div class="flex-bar">
    数据日期<span class="data-date">{{ dataDate }}</span>&nbsp;&nbsp;&nbsp;&nbsp;
    稽核日期<span class="exec-date">{{ execDate }}</span>
    <div class="spacer"></div>
    <div>
      <el-button type="text" @click="collapseNames=[]">
        <i class="el-icon-caret-top"></i>
        全部收起
      </el-button>
    </div>
  </div>


  <el-collapse v-model="collapseNames" :accordion="false" class="rules-accordions">
    <el-collapse-item :name="group.code" v-for="group in sGroups" :key="group.code">
      <template #title>
        <div class="accordion-title">
          <span class="table-name">{{ group.name }}</span>
          &nbsp;（<span class="failed-rules-count">{{ group.failedCount }}</span>）
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
            prop="ruleName"
            class-name="rule-name"
            min-width="200"
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
            min-width="250"
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
import {getAuditRuleResults} from "@/api/etl-wflow-run-api";
import {DmcAuditRuleResult} from "@/models/dmc-audit-rule-result";
import SentOaRecordList from "@/components/SentOaRecordList.vue";
import SampleErrordataList from "@/components/SampleErrordataList.vue";
import {MetaStructField} from "@/models/meta-struct-field";
import {DateFormat, DateShortcuts} from "@/config";
import moment from "moment";

interface CollapseGroup {
  code: string,
  name: string,
  failedCount: number
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
  dateFormat = DateFormat
  dateShortcuts = DateShortcuts
  errorRuleData: DmcAuditRuleResult[] | null = null
  sGroups: CollapseGroup[] = []
  filter: any = {}

  // structId -> (fieldCode -> field)
  structsMap: Map<string, (Map<string, MetaStructField>)> = new Map<string, Map<string, MetaStructField>>()

  tableDataLoading = false
  private collapseNames: string[] | null = null

  dataDate: string | null = null
  execDate: string | null = null

  groupRules(ruleResults: DmcAuditRuleResult[],
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
      const failedCount = list.length
      groups.push({code, name: tab.tabName, failedCount, tableData: list})

      if (pushCollapseName && this.collapseNames) {
        this.collapseNames.push(code)
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
    this.sGroups = this.groupRules(sTableData, pushCollapseName)

    this.tableDataLoading = false
  }

  get tableData(): DmcAuditRuleResult[] {
    return []
  }

  async created(): Promise<void> {
    this.filter.dataDate = moment().subtract(1, 'day').format(this.dateFormat)
    await this.fetchData()
  }

  async fetchData(): Promise<void> {
    this.tableDataLoading = true
    const runOid = 'd99e2113b12741fa935be117421e2e5c'
    let list: DmcAuditRuleResult[] = await getAuditRuleResults(runOid, -2)
    if (!list) {
      this.tableDataLoading = false
      return
    }

    list = list.map(wf => {
      if (wf.resdResultDesc) {
        wf.resdResultDesc = wf.resdResultDesc.replace('数据错误,', '数据错误，')
        if (wf.resdResultDesc.indexOf('&') >= 0) {
          wf.resdResultDesc = wf.resdResultDesc.replace('&lt;', '<')
          wf.resdResultDesc = wf.resdResultDesc.replace('&gt;', '>')
        }
      }

      return wf
    })
    this.tableData = list

    this.errorRuleData = list


    this.dataDate = this.filter.dataDate
    this.execDate = moment(this.dataDate).add(1, 'day').format(this.dateFormat)
  }

  cellClassName({row, column}: { row: DmcAuditRuleResult, column: any }): string {
    if (column.property === 'sampleErrorDataOid') {
      return row.sampleErrorDataOid ? 'expandable' : 'no-expand'
    }
    return ''
  }

  sortByFieldCode(a: DmcAuditRuleResult, b: DmcAuditRuleResult): number {
    return (a.fieldCode || '').localeCompare(b.fieldCode || '')
  }


  tableFilterChange(filters: any, group: CollapseGroup): void {
    group.filters = filters
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
  align-items: center;
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

.table-name {
  color: darkred;
}

.data-date, .exec-date {
  color: teal;
  margin-left: 16px;
}

.failed-rules-count {
  color: indianred;
}

.rules-count {
  color: #404040;
}


</style>
