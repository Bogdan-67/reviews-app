import { AxiosResponse } from 'axios';
import $api from '../http';
import { IFeedback } from '../models/IFeedback';

type CreateFeedbackBody = {
  id_author: number;
  request_id?: number;
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

  static enabledFeedbacks(
    id_user: number
  ): Promise<AxiosResponse<IFeedback[]>> {
    return $api.get<IFeedback[]>('/enabled-feedbacks/' + id_user);
  }
}
