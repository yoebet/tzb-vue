<template>
  <div class="sample-data-title">错误数据示例</div>

  <el-table
      :data="dataRows"
      v-loading="tableDataLoading"
      class="errdata-table"
      empty-text="无数据"
      stripe
      size="medium"
      max-height="700"
      v-if="columns.length>1">
    <el-table-column
        type="index"
        align="right"
        label="#">
    </el-table-column>
    <el-table-column v-for="col in columns"
                     :prop="col.code"
                     :label="col.name"
                     :key="col">
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import {Vue, Options} from "vue-class-component";
import {getSampleErrordata} from "@/api/task-result-api";
import {ColHeader, DataRow, DmcTaskResultErrordata} from "@/models/dmc-task-result-errordata";


@Options({
  props: {
    oid: String
  }
})
export default class SampleErrordataList extends Vue {
  oid!: string

  columns: ColHeader[] = []
  dataRows: DataRow[] = []
  tableDataLoading = false

  async created(): Promise<void> {
    await this.fetchData()
  }

  async fetchData(): Promise<void> {
    if (!this.oid) {
      return
    }
    this.tableDataLoading = true
    const sampleData: DmcTaskResultErrordata = await getSampleErrordata(this.oid)
    this.tableDataLoading = false

    let colCodes: string[]
    let errorDataRows: string[][]
    try {
      colCodes = JSON.parse(sampleData.metaInfo)
      errorDataRows = JSON.parse(sampleData.errorData)
    } catch (e) {
      return
    }

    this.columns = colCodes.map((code: string, index: number) => ({index, code, name: code}))
    this.dataRows = errorDataRows.map((cells: string[], index: number) => {
      const row: DataRow = {}
      cells.forEach((cellValue: string, index: number) => {
        const colCode = colCodes[index]
        row[colCode] = cellValue
      })
      return row
    })
  }


}

</script>

<style lang="scss" scoped>

.sample-data-title {
  font-weight: bold;
  color: #108ee9;
  margin-bottom: 1em;
}

.errdata-table {
  width: 90%;
}
</style>
