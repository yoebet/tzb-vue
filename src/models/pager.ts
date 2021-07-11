import {DefaultPageSize} from "@/config";

export class Pager implements Record<string, any> {
  [x: string]: any;

  page = 1
  pageSize = DefaultPageSize
  sort?: string
  sortDir?: 'asc' | 'desc' // asc, desc
}

export function buildFilterParams(filter: Pager): string {
  const filterRec: Record<string, string> = {}
  const hop = Object.prototype.hasOwnProperty
  for (const k in filter) {
    if (!hop.call(filter, k)) {
      continue
    }
    const v = filter[k]
    if (v === null || typeof v === 'undefined') {
      continue
    }
    filterRec[k] = '' + v
  }
  if (!filterRec['sort']) {
    delete filterRec['sortDir']
  }

  const usp = new URLSearchParams(filterRec)
  return usp.toString()
}
