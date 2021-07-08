export interface DmcTaskResult {
  // 主键
  oid: string

  // 任务ID
  taskId?: string

  // 执行状态，1-创建实例；2-正在执行；3-执行成功;4-执行失败
  execStatus?: number

  // 结果状态，1-正常；2-告警；4-错误
  resultStatus?: number

  // 结果描述
  resultDesc?: string

  // 执行开始时间
  beginTime?: number

  // 执行结束时间
  endTime?: number

  // 稽核表WHERE条件表达式
  whereExp?: string

  // 是否完成问题添加（处理结果工作流使用）
  isAllDealwith?: number

  // 执行类型，1-ETL执行，2-手动执行
  execType?: number

  // 删除标识
  deleteFlag?: number

  // 创建实例过程描述
  createDesc?: string

  // 稽核结果回传状态 0?: 回传中，1：回传完毕
  opStatus?: number

  // 系统生成问题状态 0?: 生成中，1：生成完毕
  proStatus?: number

  // 回传最后扫描时间
  opTime?: string

  // 问题生成时间（扫描）
  proTime?: string

  // 稽核账期
  accountTime?: string

  // 稽核账期类型  1： 表示 yyyyMMdd， 2 ：表示 yyyyMM
  accountTimeType?: number

  // 省份（地域）
  provId?: string

  // 对象所属管理地域编码：纵向是010，横向是-1等|bezf_zone:ZoneParentOid
  workGroup?: string

  // 租户ID
  tenantId?: string

  // 稽核实体对象ID
  objId?: string

  // 稽核实体对象的元模型 meta_model表的model_id
  objType?: string

  // 稽核对象的数据库schema(所属用户)
  objOwner?: string

  // 稽核实体对象名称(common_object_current name)
  objName?: string

  // 稽核实体对象编码（common_object_current code）
  objCode?: string

  // 稽核实体对象所属资源的名称
  resourceName?: string

  // 稽核实体对象所属资源的ID
  resourceId?: string

  // 流程ID（老ETL，或bdi流程的ID）
  nodeInstanceId?: string

  // 稽核错误条数
  errorNum?: number

  // 稽核告警条数
  warnNum?: number

  // 稽核正常条数
  normalNum?: number

  // 执行的总规则数
  totalNum?: number

  // 备用1
  reverse1?: string

  // 资源模型类型
  reverse2?: string

  // 备用3
  reverse3?: string

  // 批次
  batch?: string

  // 分区字段
  graphCreateTime?: number

  // 得分对象ID
  objScoreId?: string

  // 是否为测试执行结果：1是，0否
  isTest?: string

  // 引擎类型：SPARK,SQL
  executeType?: string

  // 是否缓存结果描述信息：1是，0否
  isCached?: number

  saveError?: number

  dataTotalNum?: number

  dataErrorNum?: number
}
