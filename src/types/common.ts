export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type ID = string;

export interface Timestamped {
  createdAt: string;
  updatedAt: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface Coordinate {
  x: number;
  y: number;
}
