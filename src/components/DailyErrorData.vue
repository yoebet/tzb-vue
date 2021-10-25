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
    <!--    稽核日期<span class="exec-date">{{ execDate }}</span>-->
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
            prop="resultDesc"
            label="错误信息">
        </el-table-column>
        <el-table-column
            min-width="50"
            type="expand"
            prop="sampleErrorDataOid"
            label="样例">
          <template #default="scope">
            <sample-errordata-list :rule-result="scope.row"
                                   :structs-map="structsMap"
                                   :tabCodeStructIdMap="tabCodeStructIdMap"
                                   v-if="scope.row.sampleErrorDataOid"></sample-errordata-list>
          </template>
        </el-table-column>
        <el-table-column
            min-width="50"
            sortable
            prop="resultDataFile.dataRowCount"
            label="总行数"
            align="right">
        </el-table-column>
        <el-table-column
            min-width="50"
            label="下载日期">
          <template #default="scope">
            {{ fileDownloadDate(scope.row.resultDataFile) }}
          </template>
        </el-table-column>
        <el-table-column
            min-width="50"
            label="下载">
          <template #default="scope">
            <el-link :href="scope.row.resultDataFile.fileDownloadUrl" target="_blank"
                     @click="onDownloadFile(scope.row)" v-if="scope.row.resultDataFile">下载
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>
  </el-collapse>

  <p>&nbsp;</p>
  <p>&nbsp;</p>

</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import SentOaRecordList from "@/components/SentOaRecordList.vue";
import SampleErrordataList from "@/components/SampleErrordataList.vue";
import {MetaStructField} from "@/models/meta-struct-field";
import {DateFormat, DateShortcuts} from "@/config";
import moment from "moment";
import {getErrorRuleResultsByDataDate, setRuleFileDownloaded} from "@/api/task-result-api";
import {DmcErrorRuleResult} from "@/models/dmc-error-rule-result";
import {DmcRuleResultDataFile} from "@/models/dmc-rule-result-data-file";

interface CollapseGroup {
  code: string,
  name: string,
  failedCount: number
  tableData: DmcErrorRuleResult[]
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
  errorRuleResult: DmcErrorRuleResult[] | null = null
  sGroups: CollapseGroup[] = []
  filter: any = {}

  // structId -> (fieldCode -> field)
  structsMap: Map<string, (Map<string, MetaStructField>)> = new Map<string, Map<string, MetaStructField>>()
  tabCodeStructIdMap: Map<string, string> = new Map<string, string>()

  tableDataLoading = false
  private collapseNames: string[] | null = null

  dataDate: string | null = null
  execDate: string | null = null

  groupRules(ruleResults: DmcErrorRuleResult[],
             pushCollapseName: boolean): CollapseGroup[] {

    const groupsMap = new Map<string, DmcErrorRuleResult[]>()
    for (const rr of ruleResults) {
      const code = rr.tabCode
      let list = groupsMap.get(code)
      if (!list) {
        list = []
        groupsMap.set(code, list)
      }
      list.push(rr)
    }

    const groups: CollapseGroup[] = []
    for (const [code, list] of Array.from(groupsMap)) {
      const failedCount = list.length
      groups.push({code, name: list[0].tabName, failedCount, tableData: list})

      if (pushCollapseName && this.collapseNames) {
        this.collapseNames.push(code)
      }
    }

    return groups
  }

  set tableData(ruleResults: DmcErrorRuleResult[]) {
    const pushCollapseName = this.collapseNames === null
    if (pushCollapseName) {
      this.collapseNames = []
    }
    this.sGroups = this.groupRules(ruleResults, pushCollapseName)

    this.tableDataLoading = false
  }

  get tableData(): DmcErrorRuleResult[] {
    return []
  }

  async created(): Promise<void> {
    this.filter.dataDate = moment().subtract(1, 'day').format(this.dateFormat)
    await this.fetchData()
  }

  async fetchData(): Promise<void> {
    this.tableDataLoading = true

    const dataDate = this.filter.dataDate
    let list: DmcErrorRuleResult[] = await getErrorRuleResultsByDataDate(dataDate)
    if (!list) {
      this.tableDataLoading = false
      return
    }
    this.dataDate = dataDate
    // this.execDate = moment(dataDate).add(1, 'day').format(this.dateFormat)

    list = list.map(wf => {
      if (wf.resultDesc) {
        wf.resultDesc = wf.resultDesc.replace('数据错误,', '数据错误，')
        if (wf.resultDesc.indexOf('&') >= 0) {
          wf.resultDesc = wf.resultDesc.replace('&lt;', '<')
          wf.resultDesc = wf.resultDesc.replace('&gt;', '>')
        }
      }

      return wf
    })
    this.tableData = list

    this.errorRuleResult = list
  }

  cellClassName({row, column}: { row: DmcErrorRuleResult, column: any }): string {
    if (column.property === 'sampleErrorDataOid') {
      return row.sampleErrorDataOid ? 'expandable' : 'no-expand'
    }
    return ''
  }

  sortByFieldCode(a: DmcErrorRuleResult, b: DmcErrorRuleResult): number {
    return (a.fieldCode || '').localeCompare(b.fieldCode || '')
  }


  tableFilterChange(filters: any, group: CollapseGroup): void {
    group.filters = filters
  }

  async onDownloadFile(ruleResult: DmcErrorRuleResult) {
    const resultDataFile: DmcRuleResultDataFile | undefined = ruleResult.resultDataFile
    if (!resultDataFile) {
      return
    }
    const result = await setRuleFileDownloaded(resultDataFile)
    if (result.code === 0) {
      resultDataFile.downloadedAt = new Date().toISOString()
      resultDataFile.downloaded = true
    }
  }


  fileDownloadDate(resultDataFile: DmcRuleResultDataFile): string {
    if (!resultDataFile) {
      return ''
    }
    const date = resultDataFile.downloadedAt
    if (!date) {
      return ''
    }
    return moment(date).format(DateFormat)
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
