import { Locale } from './locale';

export interface StrapiResponse<T> {
  data: T & {
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: Locale;
  };
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
