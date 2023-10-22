import { AxiosResponse } from 'axios';
import $api from '../http';
import { IRequest } from '../models/IRequest';
import { RequestType } from '../types/RequestTypes';

export default class RequestService {
  static fetchRequests(id_user: number): Promise<AxiosResponse<IRequest[]>> {
    return $api.get<IRequest[]>(`/requests/` + id_user);
  }

  static fetchOneRequest(id_request: number): Promise<AxiosResponse<IRequest>> {
    return $api.get<IRequest>('/request/' + id_request);
  }

  static createRequest(
    interns_id: string,
    author_id: number,
    type_request_id: number,
  ): Promise<AxiosResponse<string>> {
    return $api.post<string>('/request', {
      interns_id,
      author_id,
      type_request_id,
    });
  }

  static changeStatusRequest(
    id_request: number,
    id_status_request: number,
  ): Promise<AxiosResponse<IRequest[]>> {
    return $api.post<IRequest[]>('/request-status', {
      id_request,
      id_status_request,
    });
  }
  static fetchRequestTypes(): Promise<AxiosResponse<RequestType[]>> {
    return $api.get('/request-types');
  }
}
