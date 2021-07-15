<template>
  <div class="flex-bar">
    <el-form :inline="true" class="filter-form">
      <el-form-item label="规则显示">
        <el-radio-group v-model="showAllRules" @change="filterChange">
          <el-radio :label="true">全部规则</el-radio>
          <el-radio :label="false">仅错误规则</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="规则分组">
        <el-radio-group v-model="groupType" @change="filterChange">
          <el-radio label="ds">数据源</el-radio>
          <el-radio label="ds-table">数据源-表</el-radio>
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

  <!--  <el-divider></el-divider>-->

  <el-collapse v-model="collapseNames" :accordion="false" class="rules-accordions">
    <el-collapse-item :name="'s-'+group.code" v-for="group in sGroups" :key="group.code">
      <template #title>
        <div class="accordion-title">
          源头稽核：
          <span class="collapse-group-name">{{ group.name }}</span>
          &nbsp;（<span class="rules-count">{{ group.tableData.length }}</span>）
        </div>
      </template>
      <el-table-column
          type="index"
          align="right"
          label="#">
      </el-table-column>
      <el-table
          :data="group.tableData"
          style="width: 100%">
        <!--        <el-table-column
                    sortable
                    prop="tab.dbResourceName"
                    class-name="ds-name"
                    label="数据源">
                </el-table-column>-->
        <el-table-column
            sortable
            prop="tab.tabName"
            class-name="tab-name"
            v-if="groupType!=='ds-table'"
            label="表名">
        </el-table-column>
        <el-table-column
            sortable
            prop="ruleName"
            class-name="rule-name"
            min-width="250"
            label="规则名">
        </el-table-column>
        <el-table-column
            sortable
            prop="resdResultName"
            class-name="result-status"
            label="结果">
          <template #default="scope">
            <span :class="'result-status-'+scope.row.resdResultStatus+ ' run-status-'+scope.row.resdExecStatus">
              {{ scope.row.resdResultName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
            sortable
            prop="fieldCode"
            label="源字段">
          <template #default="scope">
            {{ scope.row.fieldCode }} {{ scope.row.fieldName }}
          </template>
        </el-table-column>
        <el-table-column
            sortable
            prop="stdFieldCode"
            label="标准字段">
          <template #default="scope">
            {{ scope.row.stdFieldCode }} {{ scope.row.stdFieldName }}
          </template>
        </el-table-column>
        <el-table-column
            sortable
            prop="stdDepName"
            label="管理部门">
        </el-table-column>
      </el-table>
    </el-collapse-item>

    <el-collapse-item :name="'x-'+group.code" v-for="group in xGroups" :key="group.code">
      <template #title>
        <div class="accordion-title">跨系统校验：
          <span class="collapse-group-name">{{ group.name }}</span>
          &nbsp;（<span class="rules-count">{{ group.tableData.length }}</span>）
        </div>
      </template>
      <el-table
          :data="group.tableData"
          style="width: 100%">
        <el-table-column
            type="index"
            align="right"
            label="#">
        </el-table-column>
        <!--        <el-table-column
                    sortable
                    prop="tab.dbResourceName"
                    class-name="ds-name"
                    label="数据源">
                </el-table-column>-->
        <el-table-column
            sortable
            prop="tab.tabName"
            class-name="tab-name"
            v-if="groupType!=='ds-table'"
            label="表名">
        </el-table-column>
        <el-table-column
            sortable
            prop="ruleName"
            class-name="rule-name"
            min-width="250"
            label="规则名">
        </el-table-column>
        <el-table-column
            sortable
            prop="resdResultName"
            class-name="result-status"
            label="结果">
          <template #default="scope">
            <span :class="'result-status-'+scope.row.resdResultStatus+ ' run-status-'+scope.row.resdExecStatus">
              {{ scope.row.resdResultName }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>
  </el-collapse>

  <!--  <el-divider></el-divider>-->

</template>

<script lang="ts">
import {Vue} from "vue-class-component";
import {getAuditRuleResults} from "@/api/etl-wflow-run-api";
import {DmcAuditRuleResult, DmcAuditRuleResultCodes as Codes} from "@/models/dmc-audit-rule-result";

interface CollapseGroup {
  code: string,
  name: string,
  tableData: DmcAuditRuleResult[]
}

export default class RuleResultList extends Vue {
  allRuleData: DmcAuditRuleResult[] | null = null
  errorRuleData: DmcAuditRuleResult[] | null = null
  showAllRules = false
  groupType: 'ds' | 'ds-table' = 'ds'
  sGroups: CollapseGroup[] = []
  xGroups: CollapseGroup[] = []

  tableDataLoading = false
  private runOid = ''
  private collapseNames: string[] | null = null
  private resdResultStatus = -2


  groupRules(ruleResults: DmcAuditRuleResult[],
             collapseNamePrefix: string,
             pushCollapseName: boolean): CollapseGroup[] {

    const groupsMap = new Map<string, DmcAuditRuleResult[]>()
    for (const rr of ruleResults) {
      const code = this.groupType === 'ds-table' ? rr.tab.tabCode : rr.tab.dbResourceCode
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
      const dsName = tab.dbResourceName
      const name = this.groupType === 'ds-table' ? `${dsName} - ${tab.tabName}` : dsName
      groups.push({code, name, tableData: list})

      if (pushCollapseName && this.collapseNames) {
        this.collapseNames.push(collapseNamePrefix + code)
      }
    }

    return groups
  }

  set tableData(value: DmcAuditRuleResult[]) {
    const sTableData: DmcAuditRuleResult[] = []
    const xTableData: DmcAuditRuleResult[] = []
    value.forEach(wf => {
      if (wf.xsRule) {
        xTableData.push(wf)
      } else {
        sTableData.push(wf)
      }
    })

    const pushCollapseName = this.collapseNames === null
    if (pushCollapseName) {
      this.collapseNames = []
    }
    this.sGroups = this.groupRules(sTableData, 's-', pushCollapseName)
    this.xGroups = this.groupRules(xTableData, 'x-', pushCollapseName)

    this.tableDataLoading = false
  }

  get tableData(): DmcAuditRuleResult[] {
    return []
  }

  async created(): Promise<void> {
    await this.fetchData()
  }

  async fetchData(): Promise<void> {
    if (this.$route.params.runOid) {
      this.runOid = this.$route.params.runOid as string
    }
    if (!this.runOid) {
      return
    }
    this.tableDataLoading = true
    let list: DmcAuditRuleResult[]
    if (this.showAllRules) {
      list = await getAuditRuleResults(this.runOid, null)
      this.allRuleData = list
    } else {
      list = await getAuditRuleResults(this.runOid, this.resdResultStatus)
      this.errorRuleData = list
    }
    if (list) {
      list.map(wf => {
        wf.resdResultStatusName = Codes.ResultStatusNames['s' + wf.resdResultStatus]
        wf.resdExecStatusName = Codes.ExecStatusNames['s' + wf.resdExecStatus]
        wf.resdResultName = wf.resdResultStatusName
        if (!wf.resdResultName && wf.resdExecStatus === 4) {
          wf.resdResultName = '执行错误'
        }
      })
      this.tableData = list
    } else {
      this.tableDataLoading = false
    }
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
        this.errorRuleData = this.allRuleData.filter(rr => rr.resdExecStatus === 4 || rr.resdResultStatus !== 1)
        this.tableData = this.allRuleData
      } else {
        await this.fetchData()
      }
    }
  }

}

</script>

<style lang="scss" scoped>

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

.el-form-item:not(:first-child) {
  margin-left: 30px;
}

.rules-accordions {
  //margin-left: 50px;
}

.accordion-title {
  font-weight: bold;
}

.el-icon-close {
  cursor: pointer;
}

.collapse-group-name {
  color: teal;
}

.rules-count {
  color: indianred;
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
