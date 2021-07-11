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
      style="width: 100%">
    <el-table-column
        sortable="true"
        prop="workflowName"
        label="表">
    </el-table-column>
    <el-table-column
        sortable="true"
        prop="runType"
        label="runType">
    </el-table-column>
    <el-table-column
        sortable="true"
        prop="accountType"
        label="accountType">
    </el-table-column>
    <el-table-column
        sortable="true"
        prop="startTimeLabel"
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
        sortable="true"
        prop="runErrCode"
        label="runErrCode">
    </el-table-column>
    <el-table-column
        sortable="true"
        prop="runStatusCode"
        label="runStatusCode">
    </el-table-column>
  </el-table>

  <div class="pagination">
    <el-pagination
        layout="sizes, prev, pager, next"
        :page-size="filter.pageSize"
        :current-page="filter.page"
        :total="page.totalElements"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="pageSizeChange"
        @current-change="gotoPage">
    </el-pagination>
  </div>
</template>

<script lang="ts">
import {Vue} from "vue-class-component";
import {Page} from "@/api/page";
import {getEtlWflowRuns} from "@/api/etl-wflow-run-api";
import {EtlWflowRun, EtlWflowRunFilter} from "@/models/etl-wflow-run";
import moment from 'moment';
import {DateTimeFormat, DateFormat, DateShortcuts} from "@/config";
import {timeElapseLabel} from "@/helper";

export default class EtlWflowRunList extends Vue {
  dateFormat = DateFormat
  tableData0: EtlWflowRun[] = []
  tableDataLoading = false
  filter: EtlWflowRunFilter = new EtlWflowRunFilter()
  page: Page<EtlWflowRun> = {
    totalElements: 0,
    content: []
  }

  dateShortcuts = DateShortcuts

  set tableData(value: EtlWflowRun[]) {
    value.forEach(wf => {
      if (wf.startTime) {
        const st = moment(+wf.startTime)
        wf.startTimeLabel = st.format(DateTimeFormat)
      }
      // if (wf.endTime) {
      //   wf.endTimeLabel = moment(+wf.endTime).format(DateTimeFormat)
      // }
      wf.timeElapse = timeElapseLabel(wf.startTime, wf.endTime)
    })
    this.tableData0 = value
    this.tableDataLoading = false
  }

  get tableData(): EtlWflowRun[] {
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
    this.page = await getEtlWflowRuns(this.filter)
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

</style>
