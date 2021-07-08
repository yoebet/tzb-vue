<template>
  <el-table
      :data="tableData"
      style="width: 100%">
    <el-table-column
        prop="beginTime"
        label="开始执行时间"
        width="180">
    </el-table-column>
    <el-table-column
        prop="objName"
        label="表">
    </el-table-column>
    <el-table-column
        prop="resultDesc"
        label="结果"
        width="180">
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import {Vue} from "vue-class-component";
import {DmcTaskResult} from "@/models/dmc-task-result";
import {Page} from "@/api/page";
import {getTaskResults} from "@/api/task-result-api";

export default class TaskResultList extends Vue {
  tableData: DmcTaskResult[] = []

  async created() {

    const page: Page<DmcTaskResult> & any = await getTaskResults()
    this.tableData = page.content
  }
}

</script>

<style scoped>

</style>
