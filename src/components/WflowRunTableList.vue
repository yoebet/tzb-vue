<template>

  <el-table
      :data="tableData"
      v-loading="tableDataLoading"
      stripe
      size="medium">
    <el-table-column
        type="index"
        align="right"
        label="#">
    </el-table-column>
    <el-table-column
        sortable
        prop="dbResourceName"
        label="数据源">
    </el-table-column>
    <el-table-column
        sortable
        prop="tabCode"
        label="表编码">
    </el-table-column>
    <el-table-column
        sortable
        prop="tabName"
        label="表名">
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import {Vue, Options} from "vue-class-component";
import {getAuditTabStats} from "@/api/etl-wflow-run-api";
import {DmcAuditTab} from "@/models/dmc-audit-tab";


@Options({
  props: {
    runOid: String
  }
})
export default class WflowRunTableList extends Vue {
  runOid!: string

  tableData: DmcAuditTab[] = []
  tableDataLoading = false

  async created(): Promise<void> {
    await this.fetchData()
  }

  async fetchData(): Promise<void> {
    if (!this.runOid) {
      return
    }
    this.tableDataLoading = true
    this.tableData = await getAuditTabStats(this.runOid)
    this.tableDataLoading = false
  }


}

</script>

<style lang="scss" scoped>

</style>
