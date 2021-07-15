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

  <el-table
      :data="tableData"
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
      <template #default="scope">
        <el-tooltip class="item" effect="dark" :content="scope.row.ruleName" placement="top">
          <div>{{ scope.row.ruleName }}</div>
        </el-tooltip>
      </template>
    </el-table-column>
    <!--    <el-table-column
            sortable="true"
            prop="resdExecStatusName"
            class-name="exec-status"
            label="运行状态">
          <template #default="scope">
            <span :class="'run-status-'+scope.row.resdExecStatus">{{ scope.row.resdExecStatusName }}</span>
          </template>
        </el-table-column>-->
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

</template>

<script lang="ts">
import {Vue, Options} from "vue-class-component";
import {getAuditRuleResults} from "@/api/etl-wflow-run-api";
import {DmcAuditRuleResult, DmcAuditRuleResultCodes} from "@/models/dmc-audit-rule-result";

@Options({
  // props: {
  //   runOid: String
  // }
})
export default class RuleResultList extends Vue {
  tableData0: DmcAuditRuleResult[] = []
  tableDataLoading = false
  private runOid = ''

  set tableData(value: DmcAuditRuleResult[]) {
    this.tableData0 = value.map(wf => {

      wf.resdResultStatusName = DmcAuditRuleResultCodes.ResultStatusNames['s' + wf.resdResultStatus]
      wf.resdExecStatusName = DmcAuditRuleResultCodes.ExecStatusNames['s' + wf.resdExecStatus]

      return wf
    })
    this.tableDataLoading = false
  }

  get tableData(): DmcAuditRuleResult[] {
    return this.tableData0
  }

  async created(): Promise<void> {
    if (this.$route.params.runOid) {
      this.runOid = this.$route.params.runOid as string
      console.log(this.runOid)
    }
    await this.fetchData()
  }

  async fetchData(): Promise<void> {
    if (!this.runOid) {
      return
    }
    this.tableDataLoading = true
    const list: DmcAuditRuleResult[] = await getAuditRuleResults(this.runOid)
    if (list) {
      this.tableData = list
    } else {
      this.tableDataLoading = false
    }
  }

}

</script>

<style lang="scss" scoped>

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
