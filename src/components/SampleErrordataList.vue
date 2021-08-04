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
                     :key="col">
      <template #header>
        <span v-if="col.code!==col.name">{{ col.code }}<br></span>
        {{ col.name }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import {Vue, Options} from "vue-class-component";
import {getSampleErrordata, getStructFields} from "@/api/task-result-api";
import {ColHeader, DataRow, DmcTaskResultErrordata} from "@/models/dmc-task-result-errordata";
import {DmcAuditRuleResult} from "@/models/dmc-audit-rule-result";
import {MetaStructField} from "@/models/meta-struct-field";


@Options({
  props: {
    ruleResult: {sampleErrorDataOid: String},
    structsMap: Map
  }
})
export default class SampleErrordataList extends Vue {
  ruleResult!: DmcAuditRuleResult
  // structId -> (fieldCode -> field)
  structsMap!: Map<string, (Map<string, MetaStructField>)>

  columns: ColHeader[] = []
  dataRows: DataRow[] = []
  tableDataLoading = false

  async created(): Promise<void> {
    await this.fetchData()
  }

  async fetchData(): Promise<void> {
    if (!this.ruleResult) {
      return
    }
    const sampleErrorDataOid = this.ruleResult.sampleErrorDataOid
    if (!sampleErrorDataOid) {
      return
    }
    this.tableDataLoading = true
    const sampleData: DmcTaskResultErrordata = await getSampleErrordata(sampleErrorDataOid)
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

    const structId = this.ruleResult.tab.structId
    let fieldsMap: Map<string, MetaStructField> | undefined = this.structsMap.get(structId)
    if (!fieldsMap) {
      let fields: MetaStructField[] = await getStructFields(structId)
      if (!fields) {
        fields = []
      }
      fieldsMap = new Map<string, MetaStructField>()
      for (const field of fields) {
        fieldsMap.set(field.fieldCode, field)
      }
      this.structsMap.set(structId, fieldsMap)
    }

    this.columns.forEach(column => {
      const field: MetaStructField | undefined = (fieldsMap as Map<string, MetaStructField>).get(column.code)
      if (field) {
        column.name = field.fieldName
      }
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
  width: 96%;
}
</style>
