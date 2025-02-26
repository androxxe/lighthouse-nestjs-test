import { DatatableInterface } from './datatable.interface';

export const generateMetaDatatable = ({
  page,
  per_page,
  total,
}: {
  page: number;
  per_page: number;
  total: number;
}): DatatableInterface<unknown>['meta'] => {
  return {
    page: page,
    per_page: per_page,
    total_page: Math.ceil(total / per_page),
    total,
    has_more: total > per_page * page,
  };
};
