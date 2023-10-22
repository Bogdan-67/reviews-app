import { AxiosResponse } from 'axios';
import $api from '../http';
import { IRequest } from '../models/IRequest';
import { IQuestionType } from '../models/IQuestionType';
import { IFeedback } from '../models/IFeedback';
import { IPoll } from '../models/IPoll';

export default class PollService {
  static fetchQuestionTypes(): Promise<AxiosResponse<IQuestionType[]>> {
    return $api.get<IQuestionType[]>(`/question-types`);
  }
  static createPoll(
    data: string,
    id_request: number
  ): Promise<AxiosResponse<string>> {
    return $api.post<string>(`/create-poll`, { data, id_request });
  }

  static getPoll(id: number): Promise<AxiosResponse<IPoll>> {
    return $api.get<IPoll>(`/get-poll/${id}`);
  }
}
