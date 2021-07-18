<template>
  <el-page-header @back="goback" content="规则执行详情 & 发送OA" class="page-header"></el-page-header>

  <div class="flex-bar">
    <el-form :inline="true" class="filter-form">
      <el-form-item label="规则显示">
        <el-radio-group v-model="showAllRules" @change="filterChange">
          <el-radio :label="true">全部规则</el-radio>
          <el-radio :label="false">仅错误规则</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="规则分组">
        <el-radio-group v-model="groupType" @change="filterChange">
          <el-radio label="ds">数据源</el-radio>
          <el-radio label="ds-table">数据源 - 表</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="spacer"></div>
    <div>
      <el-button type="text" @click="collapseNames=[]">
        <i class="el-icon-caret-top"></i>
        全部收起
      </el-button>
    </div>
  </div>


  <el-collapse v-model="collapseNames" :accordion="false" class="rules-accordions">
    <el-collapse-item :name="'s-'+group.code" v-for="group in sGroups" :key="group.code">
      <template #title>
        <div class="accordion-title">
          源头稽核：
          <span class="collapse-group-name1" v-if="group.names">{{ group.names[0] }}</span>
          <span class="collapse-group-name2" v-if="group.names&&group.names[1]">{{ group.names[1] }}</span>
          <span class="collapse-group-account-times">&nbsp;&nbsp;{{ group.accountTimes }}</span>
          &nbsp;（<span class="failed-rules-count">{{ group.failedCount }}</span>
          <span class="rules-count" v-if="showAllRules"> / {{ group.tableData.length }}</span>）
        </div>
      </template>
      <el-table
          :data="group.tableData"
          stripe
          :cell-class-name="cellClassName"
          row-key="resdOid"
          style="width: 100%">
        <!--        <el-table-column
                    sortable
                    prop="tab.dbResourceName"
                    class-name="ds-name"
                    label="数据源">
                </el-table-column>-->
        <el-table-column
            type="index"
            align="right"
            label="#">
        </el-table-column>
        <el-table-column
            sortable
            prop="tab.tabName"
            class-name="tab-name"
            v-if="groupType!=='ds-table'"
            label="表名">
        </el-table-column>
        <el-table-column
            sortable
            prop="ruleName"
            class-name="rule-name"
            min-width="150"
            label="规则名">
        </el-table-column>
        <el-table-column
            sortable
            prop="fieldCode"
            label="源字段">
          <template #default="scope">
            {{ scope.row.fieldCode }} <br>
            {{ scope.row.fieldName }}
          </template>
        </el-table-column>
        <el-table-column
            sortable
            width="160"
            prop="stdFieldCode"
            label="标准字段">
          <template #default="scope">
            {{ scope.row.stdFieldCode }} <br>
            {{ scope.row.stdFieldName }}
          </template>
        </el-table-column>
        <el-table-column
            sortable
            prop="stdDepName"
            label="管理部门">
        </el-table-column>
        <el-table-column
            sortable
            width="80"
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
            min-width="200"
            prop="resdResultDesc"
            label="错误信息">
        </el-table-column>
        <el-table-column
            type="expand"
            prop="sampleErrorDataOid"
            label="数据">
          <template #default="scope">
            <sample-errordata-list :oid="scope.row.sampleErrorDataOid"
                                   v-if="scope.row.sampleErrorDataOid"></sample-errordata-list>
          </template>
        </el-table-column>
        <el-table-column
            min-width="150"
            prop="sendToDep"
            label="发送部门">
          <template #header>
            发送部门&nbsp;
            <el-dropdown>
              <span class="uddt">
                全部设置为<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="dep in deps" :key="dep.orgId" @click="setUniDepartment(group.tableData,dep)">
                    {{ dep.orgName }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #default="scope">
            <el-select v-model="scope.row.sendToDep" multiple placeholder="部门" v-if="scope.row.failed"
                       @change="depSelectChanged(scope.row)">
              <el-option
                  v-for="item in deps"
                  :key="item.orgId"
                  :label="item.orgName"
                  :value="item.orgId">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>

    <el-collapse-item :name="'x-'+group.code" v-for="group in xGroups" :key="group.code">
      <template #title>
        <div class="accordion-title">跨系统校验：
          <span class="collapse-group-name1">{{ group.names[0] }}</span>
          <span class="collapse-group-name2" v-if="group.names[1]">{{ group.names[1] }}</span>
          <span class="collapse-group-account-times">&nbsp;&nbsp;{{ group.accountTimes }}</span>
          &nbsp;（<span class="failed-rules-count">{{ group.failedCount }}</span>
          <span class="rules-count" v-if="showAllRules"> / {{ group.tableData.length }}</span>）
        </div>
      </template>
      <el-table
          :data="group.tableData"
          stripe
          :cell-class-name="cellClassName"
          row-key="resdOid"
          style="width: 100%">
        <el-table-column
            type="index"
            align="right"
            label="#">
        </el-table-column>
        <!--        <el-table-column
                    sortable
                    prop="tab.dbResourceName"
                    class-name="ds-name"
                    label="数据源">
                </el-table-column>-->
        <el-table-column
            sortable
            prop="tab.tabName"
            class-name="tab-name"
            v-if="groupType!=='ds-table'"
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
            width="80"
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
            min-width="200"
            prop="resdResultDesc"
            label="错误信息">
        </el-table-column>
        <el-table-column
            type="expand"
            prop="sampleErrorDataOid"
            label="数据">
          <template #default="scope">
            <sample-errordata-list :oid="scope.row.sampleErrorDataOid"
                                   v-if="scope.row.sampleErrorDataOid"></sample-errordata-list>
          </template>
        </el-table-column>
        <el-table-column
            min-width="150"
            prop="sendToDep"
            label="发送部门">
          <template #header>
            发送部门&nbsp;
            <el-dropdown>
              <span class="uddt">
                全部设置为<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="dep in deps" :key="dep.orgId" @click="setUniDepartment(group.tableData,dep)">
                    {{ dep.orgName }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #default="scope">
            <el-select v-model="scope.row.sendToDep" multiple placeholder="部门" v-if="scope.row.failed"
                       @change="depSelectChanged(scope.row)">
              <el-option
                  v-for="item in deps"
                  :key="item.orgId"
                  :label="item.orgName"
                  :value="item.orgId">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>
  </el-collapse>

  <div class="sent-oa-box">

    <el-collapse model-value="oa-records" class="expand-tables oa-sent-records">
      <el-collapse-item name="oa-records">
        <template #title>
          <div class="sent-records-title-bar">OA发送记录</div>
        </template>

        <sent-oa-record-list :run-oid="runOid" ref="oaRecordListComponent"></sent-oa-record-list>

      </el-collapse-item>
    </el-collapse>

    <div class="sent-oa-title-bar">发送OA</div>

    <el-table
        :data="depRuleRels"
        class="deps-table"
        empty-text="请选择部门"
        style="width: 100%">
      <el-table-column
          type="index"
          align="right"
          label="#">
      </el-table-column>
      <el-table-column
          width="150"
          prop="dep.orgName"
          label="部门">
      </el-table-column>
      <el-table-column
          width="150"
          prop="userId"
          label="人员">
        <template #default="scope">
          <el-select v-model="scope.row.userId" placeholder="人员">
            <el-option
                v-for="item in scope.row.dep.users"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
          prop="ruleResultIds.size"
          label="涉及规则数">
        <template #default="scope">
          <span class="dep-rules-count">{{ scope.row.ruleResultIds.size }}</span>
        </template>
      </el-table-column>
      <el-table-column
          min-width="150"
          prop="remark"
          label="审批意见">
        <template #default="scope">
          <el-input
              type="textarea"
              :rows="2"
              placeholder="意见"
              v-model="scope.row.remark">
          </el-input>
        </template>
      </el-table-column>
    </el-table>

    <div align="right" class="sent-oa-box-bb">
      <el-button type="primary" @click="sentOa" :disabled="depRuleRels.length===0">发送OA</el-button>
    </div>
  </div>

</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {getAuditRuleResults} from "@/api/etl-wflow-run-api";
import {DmcAuditRuleResult, DmcAuditRuleResultCodes as Codes} from "@/models/dmc-audit-rule-result";
import {Department} from "@/models/department";
import {getDepartments} from "@/api/user-dep-api";
import {User} from "@/models/user";
import {DmcAuditSentOa} from "@/models/dmc-audit-sent-oa";
import {DmcAuditSentOaDep} from "@/models/dmc-audit-sent-oa-dep";
import {sendOa} from "@/api/send-oa-api";
import {Result} from "@/models/result";
import SentOaRecordList from "@/components/SentOaRecordList.vue";
import SampleErrordataList from "@/components/SampleErrordataList.vue";

interface CollapseGroup {
  code: string,
  names: string[],
  failedCount: number
  accountTimes: string
  tableData: DmcAuditRuleResult[]
}

interface DepRuleRel {
  dep: Department
  userId: string
  remark: string
  ruleResultIds: Set<string>
}


@Options({
  components: {
    SentOaRecordList,
    SampleErrordataList
  }
})
export default class RuleResultList extends Vue {
  allRuleData: DmcAuditRuleResult[] | null = null
  errorRuleData: DmcAuditRuleResult[] | null = null
  errorRuleDataMap: Map<string, DmcAuditRuleResult> = new Map<string, DmcAuditRuleResult>()
  showAllRules = false
  groupType: 'ds' | 'ds-table' = 'ds'
  sGroups: CollapseGroup[] = []
  xGroups: CollapseGroup[] = []

  deps: Department[] = [
    {
      orgId: "151351", orgName: "存款业务部",
      users: [
        {userId: "101011", loginId: "1104", userName: "1104"},
        {userId: "101012", loginId: "1753", userName: "陈莎"},
        {userId: "101013", loginId: "10919", userName: "崔旭"},
        {userId: "101014", loginId: "3010", userName: "尹海斌"},
        {userId: "101015", loginId: "0525", userName: "高峰"},
        {userId: "101016", loginId: "1125", userName: "陈旭"},
        {userId: "101017", loginId: "9022", userName: "金曦巧"},
        {userId: "101018", loginId: "9212", userName: "梁阳勇"},
        {userId: "101019", loginId: "0433", userName: "林菊红"},
        {userId: "101020", loginId: "0521", userName: "王海燕"},
        {userId: "101021", loginId: "1761", userName: "胡国华"},]
    },
    {
      orgId: "65321", orgName: "计划财务部",
      users: [
        {userId: "101034", loginId: "1894", userName: "张荣生"},
        {userId: "101035", loginId: "14498", userName: "方梦兰"},
        {userId: "101036", loginId: "6087", userName: "潘王通"},
        {userId: "101037", loginId: "0084", userName: "陈红"},
        {userId: "101038", loginId: "0406", userName: "林永胜"},
        {userId: "101039", loginId: "1771", userName: "刘丁丁"},
        {userId: "101040", loginId: "0257", userName: "施露莎"},
        {userId: "101041", loginId: "2298", userName: "罗巧"},
        {userId: "101042", loginId: "10042", userName: "应赛赛"},
        {userId: "101043", loginId: "1363", userName: "李双双"},
        {userId: "101044", loginId: "5130", userName: "邱莉莎"},
        {userId: "101045", loginId: "3070", userName: "金梦霞"},
        {userId: "101046", loginId: "1660", userName: "官庆平"},
        {userId: "101047", loginId: "13722", userName: "倪政"},
        {userId: "101048", loginId: "1895", userName: "韩伟"},
        {userId: "101049", loginId: "zxm", userName: "zxm"},
        {userId: "101050", loginId: "14012", userName: "胡亦洲"}
      ]
    },
    {
      orgId: "52313", orgName: "信贷部",
      users: [
        {userId: "101023", loginId: "0771", userName: "林赛金"},
        {userId: "101024", loginId: "9655", userName: "刘雅琪"},
        {userId: "101025", loginId: "3406", userName: "林隽"},
        {userId: "101026", loginId: "5670", userName: "叶婷婷"},
        {userId: "101027", loginId: "15699", userName: "郭欢敏"},
        {userId: "101028", loginId: "4379", userName: "陈禹锘"},
        {userId: "101029", loginId: "9405", userName: "王献梓"},
        {userId: "101030", loginId: "3362", userName: "曹家瑜"},
        {userId: "101032", loginId: "4134", userName: "张敏"},
        {userId: "101033", loginId: "2011", userName: "陈建霖"},
      ]
    }
  ]
  depsMap: Map<string, Department> = new Map<string, Department>()
  depsNameMap: Map<string, Department> = new Map<string, Department>()
  usersMap: Map<string, User> = new Map<string, User>()

  depRuleRelsMap: Map<string, DepRuleRel> = new Map<string, DepRuleRel>()
  depRuleRels: DepRuleRel[] = []

  tableDataLoading = false
  private runOid = ''
  private collapseNames: string[] | null = null
  private resdResultStatus = -2

  groupRules(ruleResults: DmcAuditRuleResult[],
             collapseNamePrefix: string,
             pushCollapseName: boolean): CollapseGroup[] {

    const groupsMap = new Map<string, DmcAuditRuleResult[]>()
    for (const rr of ruleResults) {
      const code = this.groupType === 'ds-table' ? rr.tab.tabCode : rr.tab.dbResourceCode
      let list = groupsMap.get(code)
      if (!list) {
        list = []
        groupsMap.set(code, list)
      }
      list.push(rr)
    }

    const groups: CollapseGroup[] = []
    for (const [code, list] of Array.from(groupsMap)) {
      const tab = list[0].tab
      const dsName = tab.dbResourceName
      const names: string[] = [dsName]
      if (this.groupType === 'ds-table') {
        names.push(tab.tabName)
      }
      const accountTimes = Array.from(new Set<string>(list.map(rr => rr.tab.accountTime).filter(at => at))).join(',')
      const failedCount = list.filter(rr => rr.failed).length
      groups.push({code, names, failedCount, accountTimes, tableData: list})

      if (pushCollapseName && this.collapseNames) {
        this.collapseNames.push(collapseNamePrefix + code)
      }
    }

    return groups
  }

  set tableData(ruleResults: DmcAuditRuleResult[]) {
    const sTableData: DmcAuditRuleResult[] = []
    const xTableData: DmcAuditRuleResult[] = []
    ruleResults.forEach(wf => {
      if (wf.xsRule) {
        xTableData.push(wf)
      } else {
        sTableData.push(wf)
      }
    })

    const pushCollapseName = this.collapseNames === null
    if (pushCollapseName) {
      this.collapseNames = []
    }
    this.sGroups = this.groupRules(sTableData, 's-', pushCollapseName)
    this.xGroups = this.groupRules(xTableData, 'x-', pushCollapseName)

    this.tableDataLoading = false
  }

  get tableData(): DmcAuditRuleResult[] {
    return []
  }

  async created(): Promise<void> {
    await this.fetchData()
    // this.deps = await getDepartments()
    this.depsMap = new Map<string, Department>(this.deps.map(dep => [dep.orgId, dep]))
    this.depsNameMap = new Map<string, Department>(this.deps.map(dep => [dep.orgName, dep]))
    this.deps.forEach(dep => {
      dep.users.forEach(user => this.usersMap.set(user.userId, user))
    })
  }

  async fetchData(): Promise<void> {
    if (this.$route.params.runOid) {
      this.runOid = this.$route.params.runOid as string
    }
    if (!this.runOid) {
      return
    }
    this.tableDataLoading = true
    let list: DmcAuditRuleResult[] = await getAuditRuleResults(this.runOid,
        this.showAllRules ? null : this.resdResultStatus)
    if (!list) {
      this.tableDataLoading = false
      return
    }

    list = list.map(wf => {
      wf.failed = wf.resdExecStatus === 4 || wf.resdResultStatus !== 1
      if (wf.failed) {
        const cur = this.errorRuleDataMap.get(wf.resdOid)
        if (cur) {
          return cur
        }
        this.errorRuleDataMap.set(wf.resdOid, wf)
      }
      wf.resdResultStatusName = Codes.ResultStatusNames['s' + wf.resdResultStatus]
      wf.resdExecStatusName = Codes.ExecStatusNames['s' + wf.resdExecStatus]
      wf.resdResultName = wf.resdResultStatusName
      if (!wf.resdResultName && wf.resdExecStatus === 4) {
        wf.resdResultName = '执行错误'
      }
      if (wf.resdExecStatus === 4) {
        wf.resdResultDesc = ''
      }
      if (wf.resdResultDesc) {
        wf.resdResultDesc = wf.resdResultDesc.replace('数据错误,', '数据错误，')
      }

      if (wf.xsRule && wf.stdDepId) {
        const dep = this.depsMap.get(wf.stdDepId) || this.depsNameMap.get(wf.stdDepName)
        if (dep) {
          this.setSendToDep(wf, [dep.orgId])
        }
      }
      return wf
    })
    this.tableData = list

    if (this.showAllRules) {
      this.allRuleData = list
    } else {
      this.errorRuleData = list
    }
  }

  cellClassName({row, column}: { row: DmcAuditRuleResult, column: any }): string {
    if (column.property === 'sampleErrorDataOid') {
      return row.sampleErrorDataOid ? 'expandable' : 'no-expand'
    }
    return ''
  }

  async filterChange(vv: any): Promise<void> {
    const showAll = this.showAllRules
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
        this.errorRuleData = this.allRuleData.filter(rr => rr.failed)
        this.tableData = this.allRuleData
      } else {
        await this.fetchData()
      }
    }
  }

  removeCommon(sa: string[], sb: string[]): void {
    if (!sa || !sb || sa.length === 0 || sb.length === 0) {
      return
    }
    const common = []
    for (const s of sa) {
      if (sb.includes(s)) {
        common.push(s)
      }
    }
    for (const s of common) {
      sa.splice(sa.indexOf(s), 1)
      sb.splice(sb.indexOf(s), 1)
    }
  }

  setUniDepartment(ruleResults: DmcAuditRuleResult[], dep: Department): void {
    ruleResults.forEach(rr => {
      rr.sendToDep = [dep.orgId]
      this.depSelectChanged(rr)
    })
  }

  depSelectChanged(ruleResult: DmcAuditRuleResult): void {
    this.setSendToDep(ruleResult, ruleResult.sendToDep || [], ruleResult.sendToDepLast)
    ruleResult.sendToDepLast = ruleResult.sendToDep
  }

  setSendToDep(ruleResult: DmcAuditRuleResult, depIds: string[], sendToDepLast: string[] = []): void {
    const toAdd = [...depIds]
    const toRemove = [...sendToDepLast]
    this.removeCommon(toAdd, toRemove)
    const ruleResultId = ruleResult.resdOid

    for (const depId of toRemove) {
      const depRuleRel: DepRuleRel | undefined = this.depRuleRelsMap.get(depId)
      if (depRuleRel) {
        depRuleRel.ruleResultIds.delete(ruleResultId)
      }
    }

    for (const depId of toAdd) {
      let depRuleRel: DepRuleRel | undefined = this.depRuleRelsMap.get(depId)
      if (depRuleRel) {
        depRuleRel.ruleResultIds.add(ruleResultId)
      } else {
        const dep = this.depsMap.get(depId)
        if (dep) {
          const user0 = dep.users ? dep.users[0] : null
          depRuleRel = {
            dep,
            ruleResultIds: new Set<string>([ruleResultId]),
            userId: user0 ? user0.userId : '',
            remark: '这是本月的数据质量问题，请至数据质量管控平台查看，做好排查分析，并制定整改计划。'
          }
          this.depRuleRelsMap.set(depId, depRuleRel)
          this.depRuleRels.push(depRuleRel)
        }
      }
    }
  }

  async sentOa(): Promise<void> {

    const depRuleRels = this.depRuleRels.filter(drr => drr.ruleResultIds.size > 0)
    if (depRuleRels.length === 0) {
      alert(`尚未指派部门`)
      return
    }
    for (const drr of depRuleRels) {
      const depName = drr.dep.orgName
      if (!drr.userId) {
        alert(`（${depName}）未指定人员`)
        return
      }
      if (!drr.remark) {
        alert(`（${depName}）未填写意见`)
        return
      }
    }

    if (!confirm('要发送OA吗？（共' + depRuleRels.length + '个部门）')) {
      return
    }

    let allSelected: DmcAuditRuleResult[] = []

    const sentOaDeps: DmcAuditSentOaDep[] = depRuleRels.map(drr => {

      const errorRuleResults = Array.from(drr.ruleResultIds)
          .map(rid => this.errorRuleDataMap.get(rid)) as DmcAuditRuleResult[]
      allSelected = allSelected.concat(errorRuleResults)

      const rr0: DmcAuditRuleResult | undefined = errorRuleResults.find(rr => rr.tab.accountTime)
      const accountTime: string = rr0 ? rr0.tab.accountTime : ''
      const tableCount = new Set<string>(errorRuleResults.map(rr => rr.tab.tabCode)).size
      const toUser = this.usersMap.get(drr.userId)

      const dep = drr.dep
      const oaDep: DmcAuditSentOaDep = {
        depId: dep.orgId,
        depName: dep.orgName,
        userId: drr.userId,
        userName: toUser ? toUser.userName : '',
        remark: drr.remark,
        failedRulesCount: drr.ruleResultIds.size,
        accountTime,
        tableCount,
      }
      return oaDep
    })

    const sentOa: DmcAuditSentOa = {
      oid: '',// be generated at backend
      wflowRunOid: this.runOid,
      sentOaDeps
    }
    // console.log(sentOa)

    const result: Result<DmcAuditSentOa> = await sendOa(sentOa.wflowRunOid, sentOa)
    if (result.code !== 0) {
      alert(result.message)
      return
    }
    const newRecord: DmcAuditSentOa | undefined = result.data
    if (!newRecord) {
      alert('发送失败')
      return
    }

    // console.log(newRecord)
    alert('发送成功')

    const oaRecordListComponent: SentOaRecordList = this.$refs.oaRecordListComponent as SentOaRecordList
    oaRecordListComponent.append(newRecord)
    this.depRuleRels.splice(0, this.depRuleRels.length)
    this.depRuleRelsMap.clear()
    for (const rr of allSelected) {
      rr.sendToDep = []
      rr.sendToDepLast = []
    }
  }

  goback(): void {
    window.history.back()
  }

}

</script>

<style lang="scss" scoped>

.page-header {
  margin-bottom: 2em;
}

.el-radio {
  margin-right: 15px;
}

.flex-bar {
  display: flex;
  padding-right: 8px;
}

.spacer {
  flex: auto;
}

.el-form--inline.filter-form .el-form-item:not(:first-child) {
  margin-left: 30px;
}


.sent-oa-box {
  margin-top: 50px;
  margin-bottom: 50px;
  width: 90%;

  .oa-sent-records {
    margin-bottom: 50px;

    .sent-records-title-bar {
      font-size: 1.1rem;
      font-weight: bold;
      color: #2c3e50;
    }
  }

  .sent-oa-title-bar {
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .sent-oa-box-bb {
    margin-top: 20px;
  }

  .deps-table {

    .dep-rules-count {
      font-weight: bold;
      color: indianred;
    }
  }
}


.accordion-title {
  font-weight: bold;
}

.el-icon-close {
  cursor: pointer;
}

.uddt {
  color: rgba(16, 142, 233, 0.8);
  cursor: pointer;
  border: none;
}

.collapse-group-name1 {
  color: darkred;
}

.collapse-group-name2 {
  color: teal;
  margin-left: 16px;
}

.failed-rules-count {
  color: indianred;
}

.rules-count {
  color: #404040;
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
