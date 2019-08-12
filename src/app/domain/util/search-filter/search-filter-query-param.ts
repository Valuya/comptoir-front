export type SearchFilterQueryParams<T> = {
  [key in keyof T]?: string
} & any;
