<template>
  <el-page-header @back="goback" class="page-header">
    <template #content>
      <div class="page-header-content" v-if="etlWflowRun">
        <span class="page-title">规则执行详情</span>
        &nbsp;&nbsp;
        流程名称：<span class="flow-prop-value">{{ etlWflowRun.workflowName }}</span>
        &nbsp;&nbsp;
        编号：<span class="flow-prop-value">{{ etlWflowRun.oid.substr(0, 16) }}</span>
        &nbsp;&nbsp;
        开始执行时间：<span class="flow-prop-value">{{ etlWflowRun.startTimeLabel }}</span>
      </div>
    </template>
  </el-page-header>

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
          stripe
          :data="group.tableData"
          :cell-class-name="cellClassName"
          @filter-change="tableFilterChange($event,group)"
          row-key="resdOid"
          style="width: 100%">
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
            :sort-method="sortByFieldCode"
            label="源字段">
          <template #default="scope">
            {{ scope.row.fieldCode }} <br>
            {{ scope.row.fieldName }}
          </template>
        </el-table-column>
        <el-table-column
            sortable
            :sort-method="sortByStdFieldCode"
            width="160"
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
            prop="resdResultName"
            width="80"
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
            <sample-errordata-list :rule-result="scope.row"
                                   :structs-map="structsMap"
                                   v-if="scope.row.sampleErrorDataOid"></sample-errordata-list>
          </template>
        </el-table-column>
        <el-table-column
            min-width="100"
            prop="ruleFlagVal"
            column-key="ruleFlagVal"
            label="规则标记"
            :filters="ruleFlagFilterOptions"
            :filter-multiple="false"
            :filter-method="filterHandler">
          <template #default="scope">
            <el-select v-model="scope.row.ruleFlagVal" placeholder="标记" v-if="scope.row.failed"
                       @change="ruleFlagSelectChanged(scope.row)">
              <el-option
                  v-for="item in ruleFlagOptions"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
            sortable
            :sort-method="sortByRuleFlagDate"
            prop="ruleFlag.flagUpdatedAt"
            label="标记日期">
          <template #default="scope">
            {{ ruleFlagDate(scope.row.ruleFlag) }}
          </template>
        </el-table-column>
        <el-table-column
            min-width="150"
            prop="sendToDep"
            label="发送部门">
          <template #header>
            发送部门&nbsp;
            <el-popover
                :width="300"
                trigger="click"
            >
              <template #reference>
                <span class="uddt">
                  全部设置为<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <!--                <el-button size="small">全部设置为</el-button>-->
              </template>
              <el-input
                  size="small"
                  placeholder=""
                  clearable
                  v-model="organTreeFilterText1">
              </el-input>
              <el-tree :data="organTreeData"
                       :props="organTreeProps"
                       :filter-node-method="filterTreeNode"
                       @node-click="setUniDepartment(group,$event)"
                       class="filter-tree"
                       ref="treeH1"></el-tree>
            </el-popover>
            <!--            <el-dropdown>
                          <span class="uddt">
                            全部设置为<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                          </span>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item v-for="dep in deps" :key="dep.orgid" @click="setUniDepartment(group,dep)">
                                {{ dep.orgName }}
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>-->
          </template>
          <template #default="scope">
            <el-select v-model="scope.row.sendToDep"
                       multiple
                       filterable
                       placeholder="部门"
                       :filter-method="filterSelectNode1"
                       @change="depSelectChanged(scope.row)"
                       @focus="resetFilteredOrganGroups1"
                       v-if="scope.row.failed">
              <el-option-group
                  v-for="group in filteredOrganGroups1"
                  :key="group.label"
                  :label="group.label">
                <el-option
                    v-for="item in group.organs"
                    :key="item.orgid"
                    :label="item.indentLabel"
                    :value="item.orgid">
                </el-option>
              </el-option-group>
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
          stripe
          :data="group.tableData"
          :cell-class-name="cellClassName"
          @filter-change="tableFilterChange($event,group)"
          row-key="resdOid"
          style="width: 100%">
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
            min-width="250"
            label="规则名">
        </el-table-column>
        <el-table-column
            sortable
            width="80"
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
            <sample-errordata-list :rule-result="scope.row"
                                   :structs-map="structsMap"
                                   v-if="scope.row.sampleErrorDataOid"></sample-errordata-list>
          </template>
        </el-table-column>
        <el-table-column
            min-width="100"
            prop="ruleFlagVal"
            column-key="ruleFlagVal"
            label="规则标记"
            :filters="ruleFlagFilterOptions"
            :filter-multiple="false"
            :filter-method="filterHandler">
          <template #default="scope">
            <el-select v-model="scope.row.ruleFlagVal" placeholder="标记" v-if="scope.row.failed"
                       @change="ruleFlagSelectChanged(scope.row)">
              <el-option
                  v-for="item in ruleFlagOptions"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
            sortable
            :sort-method="sortByRuleFlagDate"
            prop="ruleFlag.flagUpdatedAt"
            label="标记日期">
          <template #default="scope">
            {{ ruleFlagDate(scope.row.ruleFlag) }}
          </template>
        </el-table-column>
        <el-table-column
            min-width="150"
            prop="sendToDep"
            label="发送部门">
          <template #header>
            发送部门&nbsp;
            <el-popover
                :width="300"
                trigger="click"
            >
              <template #reference>
                <span class="uddt">
                  全部设置为<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <!--                <el-button size="small">全部设置为</el-button>-->
              </template>
              <el-input
                  size="small"
                  placeholder=""
                  clearable
                  v-model="organTreeFilterText2">
              </el-input>
              <el-tree :data="organTreeData"
                       :props="organTreeProps"
                       :filter-node-method="filterTreeNode"
                       @node-click="setUniDepartment(group,$event)"
                       class="filter-tree"
                       ref="treeH2"></el-tree>
            </el-popover>
            <!-- <el-dropdown>
                          <span class="uddt">
                            全部设置为<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                          </span>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item v-for="dep in deps" :key="dep.orgid" @click="setUniDepartment(group,dep)">
                                {{ dep.orgName }}
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>-->
          </template>
          <template #default="scope">
            <el-select v-model="scope.row.sendToDep"
                       multiple
                       filterable
                       placeholder="部门"
                       :filter-method="filterSelectNode2"
                       @change="depSelectChanged(scope.row)"
                       @focus="resetFilteredOrganGroups2"
                       v-if="scope.row.failed">
              <el-option-group
                  v-for="group in filteredOrganGroups2"
                  :key="group.label"
                  :label="group.label">
                <el-option
                    v-for="item in group.organs"
                    :key="item.orgid"
                    :label="item.indentLabel"
                    :value="item.orgid">
                </el-option>
              </el-option-group>
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
          prop="userid"
          label="责任人">
        <template #default="scope">
          <el-select v-model="scope.row.userid" placeholder="责任人">
            <el-option
                v-for="item in scope.row.dep.users"
                :key="item.userid"
                :label="item.userName"
                :value="item.userid">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
          prop="ruleResultIds.size"
          label="涉及规则数">
        <template #default="scope">
          <span :class="scope.row.ruleResultIds.size>0? 'dep-rules-count':''">{{ scope.row.ruleResultIds.size }}</span>
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
      <el-button type="primary" @click="sentOa" :disabled="depRuleRels.length===0" :loading="sendingOa">发送OA</el-button>
    </div>
  </div>

</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {getAuditRuleResults, getWflowRunByOid} from "@/api/etl-wflow-run-api";
import {DmcAuditRuleResult, DmcAuditRuleResultCodes as Codes} from "@/models/dmc-audit-rule-result";
import {Organ} from "@/models/organ";
import {getDepartments} from "@/api/user-dep-api";
import {User} from "@/models/user";
import {DmcAuditSentOa} from "@/models/dmc-audit-sent-oa";
import {DmcAuditSentOaDep} from "@/models/dmc-audit-sent-oa-dep";
import {sendOa} from "@/api/send-oa-api";
import {Result} from "@/models/result";
import SentOaRecordList from "@/components/SentOaRecordList.vue";
import SampleErrordataList from "@/components/SampleErrordataList.vue";
import {MetaStructField} from "@/models/meta-struct-field";
import {DateFormat, DateTimeHMSFormat, DefaultOaRemark} from "@/config";
import {EtlWflowRun} from "@/models/etl-wflow-run";
import moment from "moment";
import {removeRuleFlag, setRuleFlag} from "@/api/rule-flag-api";
import {DmcAuditRuleFlag} from "@/models/dmc-audit-rule-flag";

interface CollapseGroup {
  code: string,
  names: string[],
  failedCount: number
  accountTimes: string
  tableData: DmcAuditRuleResult[]
  filters?: any
}

interface DepRuleRel {
  dep: Organ
  userid: string
  remark: string
  ruleResultIds: Set<string>
}

interface OrganGroup {
  label: string
  topOrgan: Organ
  organs: Organ[]
}


@Options({
  watch: {
    organTreeFilterText1(val: string) {
      (this.$refs.treeH1 as any).filter(val);
    },
    organTreeFilterText2(val: string) {
      (this.$refs.treeH2 as any).filter(val);
    },
  },
  components: {
    SentOaRecordList,
    SampleErrordataList
  }
})
export default class RuleResultList extends Vue {
  etlWflowRun: EtlWflowRun | undefined
  sendingOa = false
  allRuleData: DmcAuditRuleResult[] | null = null
  errorRuleData: DmcAuditRuleResult[] | null = null
  errorRuleDataMap: Map<string, DmcAuditRuleResult> = new Map<string, DmcAuditRuleResult>()
  showAllRules = false
  groupType: 'ds' | 'ds-table' = 'ds'
  sGroups: CollapseGroup[] = []
  xGroups: CollapseGroup[] = []
  ruleFlagKeyValues = [
    {value: 'Z', text: '整改中'},
    {value: 'Q', text: '确认中'}
  ]
  ruleFlagOptions = [
    {value: '', text: ''}
  ].concat(this.ruleFlagKeyValues)
  ruleFlagFilterOptions = [
    {value: '', text: '（无）'}
  ].concat(this.ruleFlagKeyValues)

  deps: Organ[] = []
  depsCodeMap: Map<string, Organ> = new Map<string, Organ>()
  depsMap: Map<string, Organ> = new Map<string, Organ>()
  depsNameMap: Map<string, Organ> = new Map<string, Organ>()
  usersMap: Map<string, User> = new Map<string, User>()
  organGroups: OrganGroup[] = []
  filteredOrganGroups1: OrganGroup[] = []
  filteredOrganGroups2: OrganGroup[] = []

  depRuleRelsMap: Map<string, DepRuleRel> = new Map<string, DepRuleRel>()
  depRuleRels: DepRuleRel[] = []

  // structId -> (fieldCode -> field)
  structsMap: Map<string, (Map<string, MetaStructField>)> = new Map<string, Map<string, MetaStructField>>()

  tableDataLoading = false
  private runOid = ''
  private collapseNames: string[] | null = null
  private resdResultStatus = -2
  organTreeData: Organ[] = []
  organTreeProps = {
    children: 'children',
    label: 'label'
  }
  organTreeFilterText1 = ''
  organTreeFilterText2 = ''

  filterTreeNode = (value: string, data: Organ): boolean => {
    if (!value) return true;
    return data.label?.indexOf(value) !== -1;
  }

  filterSelectNode1 = (value: string): void => {
    this.filteredOrganGroups1 = this.filterSelectNode(value)
  }

  filterSelectNode2 = (value: string): void => {
    this.filteredOrganGroups2 = this.filterSelectNode(value)
  }

  resetFilteredOrganGroups1(): void {
    this.filteredOrganGroups1 = this.organGroups
  }

  resetFilteredOrganGroups2(): void {
    this.filteredOrganGroups2 = this.organGroups
  }

  filterSelectNode(value: string): OrganGroup[] {
    const organGroups: OrganGroup[] = this.organGroups
    if (!value) {
      return organGroups
    }

    let deepFilter = (node: Organ): Organ | null => {
      if (node.children && node.children.length > 0) {
        const children = node.children.map(deepFilter)
        if (children.includes(null)) {
          const node1 = {...node}
          const children2 = children.filter(child => child) as Organ[]
          if (children2.length === 0) {
            node1.children = undefined
            if (node1.orgName.indexOf(value) >= 0) {
              return node1
            }
            return null
          } else {
            node1.children = children2
            return node1
          }
        } else {
          return node
        }
      }
      if (node.orgName.indexOf(value) >= 0) {
        return node
      }
      return null
    }

    return organGroups.map(og => {
      const to = deepFilter(og.topOrgan)
      if (to) {
        og = {...og}
        og.topOrgan = to
        og.organs = []
        let collect = (node: Organ): void => {
          og.organs.push(node)
          if (node.children) {
            node.children.forEach(collect)
          }
        }
        collect(to)
        return og
      }
      return null
    }).filter(og => og) as OrganGroup[]
  }

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
    if (this.$route.params.runOid) {
      this.runOid = this.$route.params.runOid as string
    }
    if (!this.runOid) {
      return
    }
    const run: EtlWflowRun = await getWflowRunByOid(this.runOid)
    if (run.startTime) {
      const st = moment(+run.startTime)
      run.startTimeLabel = st.format(DateTimeHMSFormat)
    }
    this.etlWflowRun = run

    await this.fetchData()

    await this.setupOrganData()
  }

  async setupOrganData() {
    const deps: Organ[] = await getDepartments()
    this.depsCodeMap = new Map<string, Organ>(deps.map(dep => [dep.orgcode, dep]))
    this.depsMap = new Map<string, Organ>(deps.map(dep => [dep.orgid, dep]))
    this.depsNameMap = new Map<string, Organ>(deps.map(dep => [dep.orgName, dep]))

    const topOrgans: Organ[] = []

    deps.forEach(dep => {
      dep.users.forEach(user => this.usersMap.set(user.userid, user))
      dep.usersCount = dep.users.length
      dep.label = `${dep.orgName}(${dep.usersCount}人)`
      const parent = this.depsMap.get(dep.superid)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(dep)
      } else {
        dep.layer = 1
        dep.indentLabel = dep.orgName
        topOrgans.push(dep)
      }
    })

    this.organTreeData = topOrgans

    let collect = (node: Organ, holder: Organ[]): void => {
      holder.push(node)
      if (node.children) {
        const layer = node.layer || 1
        for (const child of node.children) {
          let indent = ''
          for (let l = 0; l < layer; l++) {
            indent += '    '
          }
          child.indentLabel = indent + child.orgName
          child.layer = layer + 1
          collect(child, holder)
        }
      }
    }

    const organGroups: OrganGroup[] = []

    const sorted: Organ[] = []
    for (const org of topOrgans) {
      let label = org.orgName
      let si = label.indexOf('(')
      if (si === -1) {
        si = label.indexOf('（')
      }
      if (si > 0) {
        label = label.substring(0, si)
      }
      const group: OrganGroup = {
        label,
        topOrgan: org,
        organs: []
      }
      collect(org, group.organs)
      organGroups.push(group)

      sorted.push(...group.organs)
    }

    this.deps = sorted
    this.organGroups = organGroups
    this.filteredOrganGroups1 = organGroups
    this.filteredOrganGroups2 = organGroups
  }

  async fetchData(): Promise<void> {
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
        if (wf.resdResultDesc.indexOf('&') >= 0) {
          wf.resdResultDesc = wf.resdResultDesc.replace('&lt;', '<')
          wf.resdResultDesc = wf.resdResultDesc.replace('&gt;', '>')
        }
      }

      if (wf.xsRule && wf.stdDepId) {
        const dep = this.depsCodeMap.get(wf.stdDepId) || this.depsNameMap.get(wf.stdDepName)
        if (dep) {
          this.setSendToDep(wf, [dep.orgcode])
        }
      }

      if (wf.ruleFlag) {
        wf.ruleFlagVal = wf.ruleFlag.flag
      } else {
        wf.ruleFlagVal = ''
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

  sortByFieldCode(a: DmcAuditRuleResult, b: DmcAuditRuleResult): number {
    return (a.fieldCode || '').localeCompare(b.fieldCode || '')
  }

  sortByStdFieldCode(a: DmcAuditRuleResult, b: DmcAuditRuleResult): number {
    return (a.stdFieldCode || '').localeCompare(b.stdFieldCode || '')
  }

  sortByRuleFlag(a: DmcAuditRuleResult, b: DmcAuditRuleResult): number {
    return (a.ruleFlagVal || '').localeCompare(b.ruleFlagVal || '')
  }

  sortByRuleFlagDate(a: DmcAuditRuleResult, b: DmcAuditRuleResult): number {
    const ruleFlag1 = a.ruleFlag
    const ruleFlag2 = b.ruleFlag
    if (!ruleFlag1) {
      return -1
    }
    if (!ruleFlag2) {
      return 1
    }
    const date1 = ruleFlag1.flagUpdatedAt || ruleFlag1.flagAddedAt
    const date2 = ruleFlag2.flagUpdatedAt || ruleFlag2.flagAddedAt
    if (typeof date1 === 'number' && typeof date2 === 'number') {
      return date1 - date2
    }
    if (typeof date1 === 'string' && typeof date2 === 'string') {
      return date1.localeCompare(date2)
    }
    return moment(date1).isBefore(moment(date2)) ? -1 : 1
  }

  ruleFlagDate(ruleFlag: DmcAuditRuleFlag): string {
    if (!ruleFlag) {
      return ''
    }
    const date = ruleFlag.flagUpdatedAt || ruleFlag.flagAddedAt
    if (!date) {
      return ''
    }
    return moment(date).format(DateFormat)
  }

  tableFilterChange(filters: any, group: CollapseGroup): void {
    group.filters = filters
  }

  filterHandler(value: any, row: any, column: any): boolean {
    const property = column['property'];
    return row[property] === value;
  }

  async ruleFlagSelectChanged(ruleResult: DmcAuditRuleResult): Promise<void> {
    if (!ruleResult.ruleFlagVal) {
      const result: Result<void> = await removeRuleFlag(ruleResult.ruleId)
      if (result.code !== 0) {
        alert(result.message)
        return
      }
      ruleResult.ruleFlag = undefined
      return
    }

    let ruleFlag = ruleResult.ruleFlag
    if (ruleFlag) {
      ruleFlag.flag = ruleResult.ruleFlagVal
    } else {
      ruleFlag = {
        ruleId: ruleResult.ruleId,
        flag: ruleResult.ruleFlagVal,
        resdOid: ruleResult.resdOid,
        resOid: ruleResult.tab.resOid
      }
    }
    const result: Result<void> = await setRuleFlag(ruleFlag)
    if (result.code !== 0) {
      alert(result.message)
      return
    }
    const now = new Date().toISOString()
    ruleFlag.flagUpdatedAt = now
    if (!ruleFlag.flagAddedAt) {
      ruleFlag.flagAddedAt = now
      ruleResult.ruleFlag = ruleFlag
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

  setUniDepartment(group: CollapseGroup, dep: Organ): void {
    const ruleResults: DmcAuditRuleResult[] = group.tableData
    let filtered = ruleResults
    const filters = group.filters
    if (filters && filters['ruleFlagVal']) {
      const ruleFlagVal = filters['ruleFlagVal'][0]
      filtered = ruleResults.filter(rr => rr.ruleFlagVal === ruleFlagVal)
    }
    filtered.forEach(rr => {
      rr.sendToDep = [dep.orgid]
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
            userid: user0 ? user0.userid : '',
            remark: DefaultOaRemark
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
      if (!drr.userid) {
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
      const rrCheckTypeStd = errorRuleResults.find(rr => !rr.xsRule)
      const rrCheckTypeXs = errorRuleResults.find(rr => rr.xsRule)
      let checkType = rrCheckTypeStd ? '源头稽核' : ''
      if (rrCheckTypeXs) {
        if (rrCheckTypeStd) {
          checkType = checkType + '/'
        }
        checkType = checkType + '跨系统校验'
      }
      const toUser = this.usersMap.get(drr.userid)

      const dep = drr.dep
      const oaDep: DmcAuditSentOaDep = {
        depId: dep.orgid,
        depName: dep.orgName,
        userId: drr.userid,
        userName: toUser ? toUser.userName : '',
        remark: drr.remark,
        failedRulesCount: drr.ruleResultIds.size,
        accountTime,
        tableCount,
        checkType
      }
      return oaDep
    })

    const sentOa: DmcAuditSentOa = {
      oid: '',
      wflowRunOid: this.runOid,
      sentOaDeps
    }
    // console.log(sentOa)

    const cuEl = window.top.document.querySelector('#currentUser > li > div> span')
    if (cuEl) {
      let userName = cuEl.textContent
      if (userName) {
        userName = userName.trim()
      }
      if (userName) {
        console.log(userName)
        sentOa.operatorName = userName
      }
    }

    this.sendingOa = true
    const result: Result<DmcAuditSentOa> = await sendOa(sentOa.wflowRunOid, sentOa)
    this.sendingOa = false
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

  .page-title {
    color: #108ee9;
  }

  .page-header-content {

    .flow-prop-value {
      color: darkgreen;
    }
  }
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

.filter-tree {
  margin-top: 1em;
}


</style>
