export type Role = {
  role_id: number;
  role_name: string;
};

export interface IUser {
  id_user: number;
  firstname: string;
  lastname: string;
  middlename: string; // отчество
  email: string;
  phone: string;
  roles: Role[];
  rating: number;
}
