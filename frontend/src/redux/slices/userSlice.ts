import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../models/IUser';
import { AxiosResponse } from 'axios';
import { Status } from './profileSlice';
import { RootState } from '../store';
import UserService from '../../services/UserService';
import RoleService from '../../services/RoleService';
import {FetchError} from "../../types/FetchError";
// import { UsersFetch } from '../../pages/Players';

type RemoveRoleUsersParams = {
  users: number[];
};

type DeleteUserParams = {
  id_user: number;
};

type GiveRoleUsersParams = RemoveRoleUsersParams & {
  role: string;
};

type PageParams = {
  page: number;
  limit: number;
};
type ParamsSearch = {
  value?: string;
  valueGroup?: string;
  page: number;
  limit: number;
};


//Функция добавления роли у user
export const giveRoleUsers = createAsyncThunk<
  AxiosResponse<IUser[]>,
  GiveRoleUsersParams,
  { rejectValue: FetchError }
>('users/giveRoleUsers', async (params, { rejectWithValue }) => {
  try {
    const { role, users } = params;
    const response = await RoleService.giveRoles(role, users);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response?.data);
  }
});
//Функция удаления роли у user
export const removeRoleUsers = createAsyncThunk<
  AxiosResponse<IUser[]>,
  RemoveRoleUsersParams,
  { rejectValue: FetchError }
>('users/removeRoleUsers', async (params, { rejectWithValue }) => {
  try {
    const { users } = params;
    const response = await RoleService.removeRoles(users);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response?.data);
  }
});

export interface User {
  users: IUser[];
  status: Status;
  isLoading: boolean;
  count: number;
  error: string | null;
}

const initialState: User = {
  users: [],
  isLoading: false,
  status: Status.LOADING,
  count: 0,
  error: null,
};
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    usersFetching(state) {
      state.isLoading = true;
      state.status = Status.LOADING;
      state.error = initialState.error;
    },
    usersFetchingSuccess(state, action: PayloadAction<IUser[]>) {
      state.isLoading = false;
      state.status = Status.SUCCESS;
      state.users = action.payload;
      state.error = initialState.error;
    },
    usersFetchingError(state, action) {
      state.isLoading = false;
      state.status = Status.ERROR;
      state.error = action.payload.message;
    },
  },
  extraReducers: {
    [giveRoleUsers.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.SUCCESS;
      state.error = initialState.error;
      const response = action.payload.data;
      console.log('Тут выдают роль', response);

      const updUsers = state.users.map((user) => {
        console.log('Выдалась роль user', response);

        const findUser = response.find((obj) => obj.id_account === user.id_account);
        if (findUser) {
          return findUser;
        } else return user;
      });
      state.users = updUsers;
    },
    [giveRoleUsers.pending.type]: (state, action) => {
      state.isLoading = true;
      state.status = Status.LOADING;
      state.error = initialState.error;
    },
    [giveRoleUsers.rejected.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.ERROR;
      state.error = action.payload.message;
      alert(action.payload.message);
    },

    [removeRoleUsers.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.SUCCESS;
      state.error = initialState.error;
      const response = action.payload.data;
      const updUsers = state.users.map((user) => {
        const findUser = response.find((obj: IUser) => obj.id_account === user.id_account);
        if (findUser) {
          return findUser;
        } else return user;
      });
      state.users = updUsers;
    },
    [removeRoleUsers.pending.type]: (state, action) => {
      state.isLoading = true;
      state.status = Status.LOADING;
      state.error = initialState.error;
    },
    [removeRoleUsers.rejected.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.ERROR;
      state.error = action.payload.message;
      alert(action.payload.message);
    },

  },
});
export const SelectUsers = (state: RootState) => state.usersReducer.users;
export const SelectInfoUsers = (state: RootState) => state.usersReducer;

export default userSlice.reducer;
