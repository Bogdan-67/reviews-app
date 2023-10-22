export interface IRequest {
  id_request: number;
  author_id: number;
  intern_id: number;
  author?: string;
  intern?: string;
  created_at: string;
  updated_at: string;
  type_request_id: number;
  curator_id: number | null;
  type_id: number;
  status_id: number;
  status?: string;
  poll_id?: number | null;
}
