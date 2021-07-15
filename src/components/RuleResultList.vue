<template>
  <el-form :inline="true" class="filter-form">
    <el-form-item label="规则">
      <el-switch v-model="filter.showAllRules" active-text="显示全部" @change="filterChange"></el-switch>
    </el-form-item>
    <!--    <el-form-item label="流程名称">
          <el-input v-model="filter.workflowName" placeholder="流程名称">
            <template #suffix>
              <i class="el-input__icon el-icon-close" @click="filter.workflowName=''" v-if="filter.workflowName"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">筛选</el-button>
        </el-form-item>-->
  </el-form>

  <!--  <el-divider></el-divider>-->

  <el-collapse v-model="collapseName" :accordion="false" class="rules-accordions">
    <el-collapse-item name="srcDataRules">
      <template #title>
        <div class="accordion-title">
          源头稽核
          &nbsp;（<span class="rules-count">{{ sTableData.length }}</span>）
        </div>
      </template>
      <el-table
          :data="sTableData"
          style="width: 100%">
        <el-table-column
            sortable
            prop="tab.dbResourceName"
            class-name="ds-name"
            label="数据源">
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

    <el-collapse-item :name="'x-'+xRuleGroup.dsCode" v-for="xRuleGroup in xds" :key="xRuleGroup.dsCode">
      <template #title>
        <div class="accordion-title">跨系统校验：
          <span class="collapse-group-name">{{ xRuleGroup.dsName }}</span>
          &nbsp;（<span class="rules-count">{{ xRuleGroup.tableData.length }}</span>）
        </div>
      </template>
      <el-table
          :data="xRuleGroup.tableData"
          style="width: 100%">
        <el-table-column
            sortable
            prop="tab.dbResourceName"
            class-name="ds-name"
            label="数据源">
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
  dsCode: string,
  dsName: string,
  tableData: DmcAuditRuleResult[]
}

export default class RuleResultList extends Vue {
  allRuleData: DmcAuditRuleResult[] | null = null
  errorRuleData: DmcAuditRuleResult[] | null = null
  sTableData: DmcAuditRuleResult[] = []
  xds: CollapseGroup[] = []
  tableDataLoading = false
  private runOid = ''
  private collapseName: string[] = []
  private resdResultStatus = -2
  private filter: any = {}

  set tableData(value: DmcAuditRuleResult[]) {
    const sTableData: DmcAuditRuleResult[] = []
    const xTableData: DmcAuditRuleResult[] = []
    value.forEach(wf => {

      wf.resdResultStatusName = Codes.ResultStatusNames['s' + wf.resdResultStatus]
      wf.resdExecStatusName = Codes.ExecStatusNames['s' + wf.resdExecStatus]
      wf.resdResultName = wf.resdResultStatusName
      if (!wf.resdResultName && wf.resdExecStatus === 4) {
        wf.resdResultName = '执行错误'
      }

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
    // if (xTableData.length > 0) {
    //   this.collapseName.push('xDataRules')
    // }
    this.sTableData = sTableData
    // this.xTableData = xTableData


    const xdsMap = new Map<string, DmcAuditRuleResult[]>()
    for (const rr of xTableData) {
      const dsCode = rr.tab.dbResourceCode
      // const dsCode = rr.tab.tabCode
      let list = xdsMap.get(dsCode)
      if (!list) {
        list = []
        xdsMap.set(dsCode, list)
      }
      list.push(rr)
    }

    this.xds = []
    for (const [dsCode, list] of Array.from(xdsMap)) {
      const dsName = list[0].tab.dbResourceName
      // const dsName = list[0].tab.tabName
      this.xds.push({dsCode, dsName, tableData: list})

      this.collapseName.push('x-' + dsCode)
    }

    this.tableDataLoading = false
  }

  get tableData(): DmcAuditRuleResult[] {
    return this.sTableData
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
    if (this.filter.showAllRules) {
      list = await getAuditRuleResults(this.runOid, null)
      this.allRuleData = list
    } else {
      list = await getAuditRuleResults(this.runOid, this.resdResultStatus)
      this.errorRuleData = list
    }
    if (list) {
      this.tableData = list
    } else {
      this.tableDataLoading = false
    }
  }

  async filterChange(vv: any): Promise<void> {
    const showAll = this.filter.showAllRules
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
