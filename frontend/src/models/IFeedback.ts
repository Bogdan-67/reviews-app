export interface IFeedback {
  id_feedback: number;
  id_author: number;
  id_intern: number;
  date: string;
  text?: string;
  poll_id: number;
  request_id?: number;
  status_request_id?: number;
}
