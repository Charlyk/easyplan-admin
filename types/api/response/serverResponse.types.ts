export type ServerResponse<T> = {
  isError: boolean;
  message?: string | null;
  data?: T | null;
  status: number;
};

export type PaginatedResponse<T> = {
  total: number;
  data: T[];
};
