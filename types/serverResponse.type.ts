export interface ServerResponse<T> {
  isError: boolean;
  message?: string | null;
  status: number;
  data: T;
}
