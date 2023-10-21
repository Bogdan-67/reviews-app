import { AxiosResponse } from 'axios';
import $api from '../http';
import { IRequest } from '../models/IRequest';

export default class RequestService {
  static fetchRequests(author: number): Promise<AxiosResponse<IRequest[]>> {
    return $api.get<IRequest[]>(`/requests/` + author);
  }
  static fetchOneRequest(id_request: number): Promise<AxiosResponse<IRequest>> {
    return $api.get<IRequest>('/request/' + id_request);
  }

  static createRequest(
    id_interns: number[],
    id_author: number,
    type_request: number,
  ): Promise<AxiosResponse<string>> {
    return $api.post<string>('/request', {
      id_interns,
      id_author,
      type_request,
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
}
