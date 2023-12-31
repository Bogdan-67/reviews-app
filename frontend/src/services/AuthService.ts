import $api from '../http';
import { AxiosResponse } from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';

export default class AuthService {
  static async login(login: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/login', { login, password });
  }

  static async registration(
    password: string,
    firstname: string,
    lastname: string,
    middlename: string,
    email: string,
    phone: string,
    recaptha: string,
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/registration', {
      password,
      firstname,
      lastname,
      middlename,
      email,
      phone,
      ['g-recaptcha-response']: recaptha,
    });
  }

  static async logout(): Promise<void> {
    return $api.post('/logout');
  }
}
