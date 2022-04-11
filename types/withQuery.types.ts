export type WithQuery<T> = {
  data: T | null;
  loading: boolean;
  error?: string | null;
};
