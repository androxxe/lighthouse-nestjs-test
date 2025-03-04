import { DatatableInterface } from './datatable.interface';

export const generateMetaDatatable = <Query>({
  page,
  per_page,
  total,
  query,
}: {
  page: number;
  per_page: number;
  total: number;
  query: Query;
}): DatatableInterface<unknown, Query>['meta'] => {
  return {
    page: page,
    per_page: per_page,
    total_page: Math.ceil(total / per_page),
    total,
    has_more: total > per_page * page,
    query,
  };
};
