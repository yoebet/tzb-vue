<template>
  <div class="sample-data-title">错误数据示例</div>

  <el-table
      :data="dataRows"
      v-loading="tableDataLoading"
      class="errdata-table"
      empty-text="无数据"
      stripe
      size="medium"
      max-height="800"
      v-if="columns.length>0">
    <el-table-column
        type="index"
        align="right"
        label="#">
    </el-table-column>
    <el-table-column v-for="col in columns"
                     :prop="col.code"
                     :key="col">
      <template #header>
        {{ col.code }}
        <template v-if="col.name"><br>{{ col.name }}</template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import {Vue, Options} from "vue-class-component"
import {findStructId, getSampleErrordata, getStructFields} from "@/api/task-result-api"
import {ColHeader, DataRow, DmcTaskResultErrordata} from "@/models/dmc-task-result-errordata"
import {MetaStructField} from "@/models/meta-struct-field"


@Options({
  props: {
    ruleResult: {sampleErrorDataOid: String},
    structsMap: Map,
    tabCodeStructIdMap: Map
  }
})
export default class SampleErrordataList extends Vue {
  ruleResult!: { sampleErrorDataOid?: string, tabCode?: string, tab?: { structId?: string } }
  // structId -> (fieldCode -> field)
  structsMap!: Map<string, (Map<string, MetaStructField>)>
  tabCodeStructIdMap: Map<string, string> = new Map<string, string>()

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

    let colCodes: string[]
    let errorDataRows: string[][]
    try {
      colCodes = JSON.parse(sampleData.metaInfo)
      errorDataRows = JSON.parse(sampleData.errorData)
    } catch (e) {
      this.tableDataLoading = false
      return
    }

    const columns = colCodes.map((code: string, index: number) => ({index, code, name: ''}))
    this.dataRows = errorDataRows.map((cells: string[], index: number) => {
      const row: DataRow = {}
      cells.forEach((cellValue: string, index: number) => {
        const colCode = colCodes[index]
        row[colCode] = cellValue
      })
      return row
    })

    let structId
    if (this.ruleResult.tab) {
      structId = this.ruleResult.tab.structId
    } else if (this.ruleResult.tabCode) {
      const tabCode = this.ruleResult.tabCode
      structId = this.tabCodeStructIdMap.get(tabCode)
      if (!structId) {
        structId = await findStructId(tabCode)
        if (structId) {
          this.tabCodeStructIdMap.set(tabCode, structId)
        }
      }
    }
    if (!structId) {
      return
    }
    let fieldsMap: Map<string, MetaStructField> | undefined = this.structsMap.get(structId)
    if (!fieldsMap) {
      try {
        let fields: MetaStructField[] = await getStructFields(structId)
        if (!fields) {
          fields = []
        }
        fieldsMap = new Map<string, MetaStructField>()
        for (const field of fields) {
          fieldsMap.set(field.fieldCode, field)
        }
        this.structsMap.set(structId, fieldsMap)
      } catch (e) {
        this.tableDataLoading = false
        return
      }
    }

    columns.forEach(column => {
      const field: MetaStructField | undefined = (fieldsMap as Map<string, MetaStructField>).get(column.code)
      if (field) {
        column.name = field.fieldName
      }
    })

    this.columns = columns
    this.tableDataLoading = false
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
