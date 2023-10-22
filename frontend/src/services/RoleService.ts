import $api from '../http';
import { AxiosResponse } from 'axios';
import { IUser } from '../models/IUser';
import { IRole } from '../models/IRole';

export default class RoleService {
  static fetchRoles(): Promise<AxiosResponse<IRole[]>> {
    return $api.get<IRole[]>('/roles');
  }
  static giveRoles(
    id_role: number,
    users: number[]
  ): Promise<AxiosResponse<IUser[]>> {
    return $api.post<IUser[]>('/roles', { id_role, users });
  }
  static removeRoles(
    id_role: number,
    users: number[]
  ): Promise<AxiosResponse<IUser[]>> {
    return $api.post<IUser[]>('/remove-roles', { id_role, users });
  }
}
