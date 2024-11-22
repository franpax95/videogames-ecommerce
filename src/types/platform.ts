export interface Platform {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  icon: {
    url: string;
  };
}
