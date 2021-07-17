<template>
  <el-form :inline="true" class="filter-form">
    <el-form-item label="流程名称">
      <el-input v-model="filter.workflowName" placeholder="流程名称">
        <template #suffix>
          <i class="el-input__icon el-icon-close" @click="filter.workflowName=''" v-if="filter.workflowName"></i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="执行时间">
      <el-date-picker
          v-model="filter.startDateFrom"
          type="date"
          placeholder="起"
          :shortcuts="dateShortcuts"
          :format="dateFormat"
          :value-format="dateFormat"
          class="date-field"
      >
      </el-date-picker>
      &nbsp; - &nbsp;
      <el-date-picker
          v-model="filter.startDateTo"
          type="date"
          placeholder="止"
          :shortcuts="dateShortcuts"
          :format="dateFormat"
          :value-format="dateFormat"
          class="date-field"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="fetchData">筛选</el-button>
    </el-form-item>
  </el-form>

  <el-table
      :data="tableData"
      v-loading="tableDataLoading"
      :default-sort="{prop: 'startTimeLabel', order: 'descending'}"
      @sort-change="sortData"
      row-key="oid"
      style="width: 100%">
    <el-table-column type="expand" column-key="expand">
      <template #default="scope">

        <el-collapse :model-value="['tab-list','oa-records']" :accordion="false">
          <el-collapse-item name="tab-list" title="数据表">
            <wflow-run-table-list :run-oid="scope.row.wflowRunOid"></wflow-run-table-list>
          </el-collapse-item>

          <el-collapse-item name="oa-records" title="OA发送">
            <ul>
              <li>部门1 &nbsp; <span class="sent-rules-count">3</span></li>
              <li>部门2 &nbsp; <span class="sent-rules-count">8</span></li>
              <li>部门3 &nbsp; <span class="sent-rules-count">12</span></li>
            </ul>
            <div>审批意见：xxx</div>
          </el-collapse-item>
        </el-collapse>

      </template>
    </el-table-column>
    <el-table-column
        prop="workflowName"
        label="流程名称">
    </el-table-column>
    <!--    <el-table-column
            prop="accountTypeName"
            label="账期">
        </el-table-column>-->
    <el-table-column
        prop="runTypeName"
        label="启动方式">
    </el-table-column>
    <el-table-column
        sortable
        prop="startTimeLabel"
        width="160"
        label="开始执行时间">
    </el-table-column>
    <el-table-column
        prop="timeElapse"
        label="运行时间">
      <template #default="scope">
        <i class="el-icon-time" v-if="scope.row.timeElapse"></i>
        <span style="margin-left: 3px">{{ scope.row.timeElapse }}</span>
      </template>
    </el-table-column>
    <el-table-column
        prop="runStatusName"
        label="运行状态">
      <template #default="scope">
        <span :class="'run-status-'+scope.row.runStatusCode">{{ scope.row.runStatusName }}</span>
      </template>
    </el-table-column>
    <el-table-column
        align="right"
        prop="tableCount"
        label="表数">
    </el-table-column>
    <el-table-column
        align="right"
        prop="ruleCount"
        label="全部规则">
      <template #default="scope">
        <template v-if="scope.row.ruleCount>0">
          <span class="fail-count">{{ scope.row.ruleFailCount }}</span> /
        </template>
        <span class="total-count">{{ scope.row.ruleCount }}</span>
      </template>
    </el-table-column>
    <el-table-column
        align="right"
        prop="stdRuleCount"
        label="标准字段规则">
      <template #default="scope">
        <template v-if="scope.row.stdRuleFailCount>0">
          <span class="fail-count">{{ scope.row.stdRuleFailCount }}</span> /
        </template>
        <span class="total-count">{{ scope.row.stdRuleCount }}</span>
      </template>
    </el-table-column>
    <el-table-column
        align="right"
        prop="xRuleCount"
        label="跨系统校验规则">
      <template #default="scope">
        <template v-if="scope.row.xRuleFailCount>0">
          <span class="fail-count">{{ scope.row.xRuleFailCount }}</span> /
        </template>
        <span class="total-count">{{ scope.row.xRuleCount }}</span>
      </template>
    </el-table-column>
    <el-table-column
        prop="oaStatusName"
        label="OA状态">
      <template #default="scope">
        <span :class="'oa-status-'+scope.row.oaStatus">{{ scope.row.oaStatusName }}</span>
      </template>
    </el-table-column>
    <el-table-column
        align="right"
        label="操作">
      <template #default="scope">
        <router-link :to="'/wflow-rules/'+scope.row.wflowRunOid" v-if="scope.row.ruleCount>0">
          <el-button type="primary" @click="fetchData">执行详情</el-button>
        </router-link>
      </template>
    </el-table-column>
  </el-table>

  <div class="pagination">
    <el-pagination
        layout="sizes, prev, pager, next"
        :page-size="filter.pageSize"
        :current-page="filter.page"
        :total="page.totalElements"
        :page-sizes="[10, 20, 30, 50]"
        @size-change="pageSizeChange"
        @current-change="gotoPage">
    </el-pagination>
  </div>
</template>

<script lang="ts">
import {Vue, Options} from "vue-class-component";
import {Page} from "@/api/page";
import {getWflowRunStats} from "@/api/etl-wflow-run-api";
import {EtlWflowRun, EtlWflowRunCodes as Codes, EtlWflowRunFilter} from "@/models/etl-wflow-run";
import moment from 'moment';
import {DateFormat, DateShortcuts, DateTimeFormat} from "@/config";
import {timeElapseLabel} from "@/helper";
import {DmcAuditWflowStat, DmcAuditWflowStatCodes} from "@/models/dmc-audit-wflow-stat";
import WflowRunTableList from "@/components/WflowRunTableList.vue";

@Options({
  components: {
    WflowRunTableList
  }
})
export default class WflowRunStatList extends Vue {
  dateFormat = DateFormat
  tableData0: DmcAuditWflowStat[] = []
  tableDataLoading = false
  filter: EtlWflowRunFilter = new EtlWflowRunFilter()
  page: Page<DmcAuditWflowStat> = {
    totalElements: 0,
    content: []
  }

  dateShortcuts = DateShortcuts

  set tableData(value: DmcAuditWflowStat[]) {
    const hop = Object.prototype.hasOwnProperty
    this.tableData0 = value.map(wf0 => {
      const wf = wf0 as DmcAuditWflowStat & EtlWflowRun
      const run = wf.wflowRun
      if (run) {
        for (const key in run) {
          if (!hop.call(run, key)) {
            continue
          }
          wf[key] = run[key]
        }
      }

      wf.accountTypeName = Codes.AccountTypeNames['s' + wf.accountType]
      wf.runTypeName = Codes.RunTypeNames['s' + wf.runType]
      wf.runStatusName = Codes.RunStatusNames['s' + wf.runStatusCode]
      wf.oaStatusName = DmcAuditWflowStatCodes.OaStatusNames['s' + (wf.oaStatus || 'i')]

      if (wf.startTime) {
        const st = moment(+wf.startTime)
        wf.startTimeLabel = st.format(DateTimeFormat)
      }
      wf.timeElapse = timeElapseLabel(wf.startTime, wf.endTime)

      return wf
    })
    this.tableDataLoading = false
  }

  get tableData(): DmcAuditWflowStat[] {
    return this.tableData0
  }

  resetFilter(): void {
    this.filter = new EtlWflowRunFilter()
  }

  async created(): Promise<void> {
    this.filter.pageSize = 2
    // this.filter.workflowName = 'eas'
    await this.fetchData()
  }

  async fetchData(): Promise<void> {
    this.tableDataLoading = true
    this.page = await getWflowRunStats(this.filter)
    if (this.page && this.page.content) {
      this.tableData = this.page.content
    } else {
      this.tableDataLoading = false
    }
  }

  async pageSizeChange(pageSize: number): Promise<void> {
    this.filter.pageSize = pageSize
    await this.fetchData()
  }

  async gotoPage(page: number): Promise<void> {
    // if (this.tableDataLoading) {
    //   return
    // }
    if (!page) {
      return
    }
    // console.log('gotoPage ' + page)
    this.filter.page = page
    await this.fetchData()
  }

  async sortData({order, prop}: {
    order: 'ascending' | 'descending',
    prop: string
  }): Promise<void> {
    if (prop === 'startTimeLabel') {
      prop = 'startTime'
    }
    this.filter.sort = prop
    this.filter.sortDir = (order === 'ascending') ? 'asc' : 'desc'
    await this.fetchData()
  }

}

</script>

<style lang="scss" scoped>

.el-icon-close {
  cursor: pointer;
}

.run-status-8 {
  color: rgba(255, 0, 0, 0.6);
}

.run-status-9 {
  color: green;
}

.fail-count {
  color: rgba(255, 0, 0, 0.6);
}

.total-count {
  font-weight: bold;
}

.oa-status-i {

}

.oa-status-s {
  color: #108ee9;
}

.oa-status-d {
  color: green;
}

.expand-block {
  margin-top: 1em;

  .block-title {
    font-weight: bold;
  }

  li {
    list-style: none;
  }

  .sent-rules-count {
    font-weight: bold;
    color: #108ee9;
  }
}


</style>
