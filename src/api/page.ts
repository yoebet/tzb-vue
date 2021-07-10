export interface Page<M> {
  totalElements: number
  // totalPages: number
  pageable?: {
    // sort: any,
    // offset: number,
    pageSize: number,
    pageNumber: number,
  }

  content: M[]
}
