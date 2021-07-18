import {Model} from "@/models/model";

export interface ColHeader {
  index: number
  code: string
  name?: string
}

export interface DataRow {
  [code: string]: string
}

export interface DmcTaskResultErrordata extends Model {

  resultDetailId: string

  metaInfo: string
  columns?: ColHeader[]

  errorData: string
  dataRows?: DataRow[]
}
