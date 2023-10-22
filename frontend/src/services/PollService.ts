import { AxiosResponse } from 'axios';
import $api from '../http';
import { IRequest } from '../models/IRequest';
import { IQuestionType } from '../models/IQuestionType';

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
}
