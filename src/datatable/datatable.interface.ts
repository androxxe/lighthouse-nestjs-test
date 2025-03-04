export interface DatatableInterface<T, Q> {
  data: T[];
  meta: {
    page: number;
    per_page: number;
    total_page: number;
    total: number;
    has_more: boolean;
    query: Q;
  };
}
