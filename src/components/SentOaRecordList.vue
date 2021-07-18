<template>

  <div>

    <div v-if="!records||records.length===0" class="empty-tip">尚未发送</div>

    <div v-for="record in records" :key="record.oid" class="sent-record">

      <div class="record-header">
        发送于：{{ formatTime(record.sentTime) }}
      </div>

      <el-table
          :data="record.sentOaDeps"
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
            prop="depName"
            label="部门">
        </el-table-column>
        <el-table-column
            sortable
            prop="userName"
            label="人员">
        </el-table-column>
        <el-table-column
            sortable
            prop="tableCount"
            label="表数">
        </el-table-column>
        <el-table-column
            sortable
            prop="failedRulesCount"
            class-name="failed-rules-count"
            label="涉及规则">
        </el-table-column>
        <el-table-column
            min-width="200"
            sortable
            prop="remark"
            label="审批意见">
        </el-table-column>
      </el-table>

    </div>

  </div>

</template>

<script lang="ts">
import {Vue, Options} from "vue-class-component";
import {DmcAuditSentOa} from "@/models/dmc-audit-sent-oa";
import {getSentOaRecords} from "@/api/send-oa-api";
import moment from 'moment';
import {DateTimeHMFormat} from "@/config";


@Options({
  props: {
    runOid: String
  }
})
export default class SentOaRecordList extends Vue {
  runOid!: string

  records: DmcAuditSentOa[] = []
  tableDataLoading = false

  async created(): Promise<void> {
    await this.fetchData()
  }

  async fetchData(): Promise<void> {
    if (!this.runOid) {
      return
    }
    this.tableDataLoading = true
    this.records = await getSentOaRecords(this.runOid)
    this.tableDataLoading = false
  }

  formatTime(time: any): string {
    return moment(time).format(DateTimeHMFormat)
  }

  append(record: DmcAuditSentOa): void {
    this.records.push(record)
  }


}

</script>

<style lang="scss" scoped>

.empty-tip {
  margin-left: 3em;
}

.sent-record + .sent-record {
  margin-top: 4em;
}

.record-header {
  margin-left: 2em;
  font-weight: bold;
  //color: rgba(0, 0, 0, .6);
  color: teal;
}

</style>
