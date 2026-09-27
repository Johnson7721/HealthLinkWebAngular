export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PagingInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
