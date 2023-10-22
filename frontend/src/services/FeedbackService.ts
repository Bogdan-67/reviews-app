import { AxiosResponse } from 'axios';
import $api from '../http';

type CreateFeedbackBody = {
  id_author: number;
  id_request?: number;
  id_interns: string;
  poll_id: number;
  text?: string;
};

export default class FeedbackService {
  static createFeedback(
    body: CreateFeedbackBody
  ): Promise<AxiosResponse<string>> {
    return $api.post<string>(`/create-feedback`, body);
  }
}
