import {DefaultPageSize} from "@/config";

export class Pager implements Record<string, any> {
  [x: string]: any;

  page = 1
  pageSize = DefaultPageSize
  sort?: string
  sortDir?: 'asc' | 'desc' // asc, desc
}
