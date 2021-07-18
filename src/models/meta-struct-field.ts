import {Model} from "@/models/model";

export interface MetaStructField extends Model {
  // 编码
  fieldCode: string

  // 字段名称
  fieldName: string

  // 字段类型
  fieldType: number

  // 结构表ID
  structId: string
}
