<template>
  <!--  <el-form :inline="true" class="filter-form">
      <el-form-item label="流程名称">
        <el-input v-model="filter.workflowName" placeholder="流程名称">
          <template #suffix>
            <i class="el-input__icon el-icon-close" @click="filter.workflowName=''" v-if="filter.workflowName"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">筛选</el-button>
      </el-form-item>
    </el-form>-->

  <!--  <el-divider></el-divider>-->

  <el-collapse v-model="collapseName" :accordion="false" class="rules-accordions">
    <el-collapse-item name="srcDataRules">
      <template #title>
        <span class="accordion-title">源头稽核</span>
        &nbsp;（{{ sTableData.length }}）
      </template>
      <el-table
          :data="sTableData"
          v-loading="tableDataLoading"
          style="width: 100%">
        <el-table-column
            sortable="true"
            prop="tab.dbResourceName"
            class-name="ds-name"
            label="数据源">
        </el-table-column>
        <el-table-column
            sortable="true"
            prop="tab.tabName"
            class-name="tab-name"
            label="表名">
        </el-table-column>
        <el-table-column
            sortable="true"
            prop="ruleName"
            class-name="rule-name"
            min-width="250"
            label="规则名">
        </el-table-column>
        <el-table-column
            sortable="true"
            prop="resdResultStatusName"
            class-name="result-status"
            label="结果">
          <template #default="scope">
            <span :class="'result-status-'+scope.row.resdResultStatus">{{ scope.row.resdResultStatusName }}</span>
          </template>
        </el-table-column>
        <el-table-column
            sortable="true"
            prop="fieldCode"
            label="源字段">
          <template #default="scope">
            {{ scope.row.fieldCode }} {{ scope.row.fieldName }}
          </template>
        </el-table-column>
        <el-table-column
            sortable="true"
            prop="stdFieldCode"
            label="标准字段">
          <template #default="scope">
            {{ scope.row.stdFieldCode }} {{ scope.row.stdFieldName }}
          </template>
        </el-table-column>
        <el-table-column
            sortable="true"
            prop="stdDepName"
            label="管理部门">
        </el-table-column>
      </el-table>
    </el-collapse-item>

    <el-collapse-item name="xDataRules">
      <template #title>
        <span class="accordion-title">跨系统校验</span>
        &nbsp;（{{ xTableData.length }}）
      </template>
      <el-table
          :data="xTableData"
          v-loading="tableDataLoading"
          style="width: 100%">
        <el-table-column
            sortable="true"
            prop="tab.dbResourceName"
            class-name="ds-name"
            label="数据源">
        </el-table-column>
        <el-table-column
            sortable="true"
            prop="tab.tabName"
            class-name="tab-name"
            label="表名">
        </el-table-column>
        <el-table-column
            sortable="true"
            prop="ruleName"
            class-name="rule-name"
            min-width="250"
            label="规则名">
        </el-table-column>
        <el-table-column
            sortable="true"
            prop="resdResultStatusName"
            class-name="result-status"
            label="结果">
          <template #default="scope">
            <span :class="'result-status-'+scope.row.resdResultStatus">{{ scope.row.resdResultStatusName }}</span>
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

export default class RuleResultList extends Vue {
  sTableData: DmcAuditRuleResult[] = []
  xTableData: DmcAuditRuleResult[] = []
  tableDataLoading = false
  private runOid = ''
  private collapseName: string[] = []
  private resdResultStatus = -1

  set tableData(value: DmcAuditRuleResult[]) {
    const sTableData: DmcAuditRuleResult[] = []
    const xTableData: DmcAuditRuleResult[] = []
    value.forEach(wf => {

      wf.resdResultStatusName = Codes.ResultStatusNames['s' + wf.resdResultStatus]
      wf.resdExecStatusName = Codes.ExecStatusNames['s' + wf.resdExecStatus]

      if (wf.xsRule) {
        xTableData.push(wf)
      } else {
        sTableData.push(wf)
      }
    })

    this.collapseName = []
    if (sTableData.length > 0) {
      this.collapseName.push('srcDataRules')
    }
    if (xTableData.length > 0) {
      this.collapseName.push('xDataRules')
    }
    this.sTableData = sTableData
    this.xTableData = xTableData

    this.tableDataLoading = false
  }

  get tableData(): DmcAuditRuleResult[] {
    return this.sTableData
  }

  async created(): Promise<void> {
    if (this.$route.params.runOid) {
      this.runOid = this.$route.params.runOid as string
    }
    await this.fetchData()
  }

  async fetchData(): Promise<void> {
    if (!this.runOid) {
      return
    }
    this.tableDataLoading = true
    const list: DmcAuditRuleResult[] = await getAuditRuleResults(this.runOid, this.resdResultStatus)
    if (list) {
      this.tableData = list
    } else {
      this.tableDataLoading = false
    }
  }

}

</script>

<style lang="scss" scoped>

.rules-accordions {
  margin-left: 50px;
}

.accordion-title {
  font-weight: bold;
}

.el-icon-close {
  cursor: pointer;
}

.run-status-3 {
  color: green;
}

.run-status-4 {
  color: rgba(255, 0, 0, 0.7);
}

.result-status-1 {
  color: green;
}

.result-status-4 {
  color: rgba(255, 0, 0, 0.7);
}


</style>
