import $api from '../http';
import { IUser } from '../models/IUser';
import { AxiosResponse } from 'axios';

export default class UserService {
  static fetchUser(id_account: number): Promise<AxiosResponse<IUser>> {
    return $api.get<IUser>('/user/' + id_account);
  }
}
