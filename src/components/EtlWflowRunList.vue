<template>
  <el-table
      :data="tableData"
      style="width: 100%">
    <el-table-column
        prop="workflowName"
        label="表">
    </el-table-column>
    <el-table-column
        prop="runType"
        label="runType">
    </el-table-column>
    <el-table-column
        prop="accountType"
        label="accountType">
    </el-table-column>
    <el-table-column
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
        prop="runErrCode"
        label="runErrCode">
    </el-table-column>
    <el-table-column
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
        @prev-click="prevPage"
        @next-click="nextPage"
        @size-change="pageSizeChange"
        @current-change="currentPageChange">
    </el-pagination>
  </div>
</template>

<script lang="ts">
import {Vue} from "vue-class-component";
import {Page} from "@/api/page";
import {getEtlWflowRuns} from "@/api/etl-wflow-run-api";
import {EtlWflowRun, EtlWflowRunFilter} from "@/models/etl-wflow-run";
import moment from 'moment';
import {DateTimeFormat} from "@/config";

export default class EtlWflowRunList extends Vue {
  tableData0: EtlWflowRun[] = []
  filter: EtlWflowRunFilter = new EtlWflowRunFilter()
  page: Page<EtlWflowRun> = {
    totalElements: 0,
    content: []
  }

  set tableData(value: EtlWflowRun[]) {
    value.forEach(wf => {
      if (wf.startTime) {
        const st = moment(+wf.startTime)
        wf.startTimeLabel = st.format(DateTimeFormat)
      }
      // if (wf.endTime) {
      //   wf.endTimeLabel = moment(+wf.endTime).format(DateTimeFormat)
      // }
      if (wf.startTime && wf.endTime) {
        let sec = Math.round(((+wf.endTime) - (+wf.startTime)) / 1000)
        let min = sec >= 60 ? Math.floor(sec / 60) : 0
        sec = sec % 60
        wf.timeElapse = sec + '秒'
        if (min > 0) {
          wf.timeElapse = min + '分' + wf.timeElapse
        }
      }
    })
    this.tableData0 = value
  }

  get tableData(): EtlWflowRun[] {
    return this.tableData0
  }

  resetFilter(): void {
    this.filter = new EtlWflowRunFilter()
  }

  async created(): Promise<void> {
    this.filter.pageSize = 2
    this.filter.workflowName = 'eas'
    await this.fetchData()
  }

  async fetchData(): Promise<void> {
    this.page = await getEtlWflowRuns(this.filter)
    this.tableData = this.page.content
  }

  async pageSizeChange(pageSize: number): Promise<void> {
    this.filter.pageSize = pageSize
    await this.fetchData()
  }

  async currentPageChange(page: number): Promise<void> {
    this.filter.page = page
    await this.fetchData()
  }

  async prevPage(): Promise<void> {
    let page = this.filter.page
    if (page > 1) {
      page--
    }
    this.filter.page = page
    await this.fetchData()
  }

  async nextPage(): Promise<void> {
    let page = this.filter.page
    this.filter.page = page + 1
    await this.fetchData()
  }
}

</script>

<style scoped>

</style>
