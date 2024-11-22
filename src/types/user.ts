export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  firstname: string;
  lastname: string;
  createdAt: string;
  publishedAt: string;
}
