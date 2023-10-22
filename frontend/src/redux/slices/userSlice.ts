import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { IUser } from '../../models/IUser';
import { AxiosResponse } from 'axios';
import { RootState } from '../store';
import UserService from '../../services/UserService';
import RoleService from '../../services/RoleService';
import { FetchError } from '../../types/FetchError';
import { Status } from '../../models/Status.enum';

type ChangeRoleUsersParams = {
  id_role: number;
  users: number[];
};

export const fetchUsers = createAsyncThunk<AxiosResponse<IUser[]>>(
  'request/fetchRequestStatus',
  async () => {
    try {
      const response = await UserService.getUsers();
      return response;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      alert(error.response?.data?.message);
      return error.response?.data?.message;
    }
  }
);

//Функция добавления роли у user
export const giveRoleUsers = createAsyncThunk<
  AxiosResponse<IUser[]>,
  ChangeRoleUsersParams,
  { rejectValue: FetchError }
>('users/giveRoleUsers', async (params, { rejectWithValue }) => {
  try {
    const { id_role, users } = params;
    const response = await RoleService.giveRoles(id_role, users);
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
  ChangeRoleUsersParams,
  { rejectValue: FetchError }
>('users/removeRoleUsers', async (params, { rejectWithValue }) => {
  try {
    const { id_role, users } = params;
    const response = await RoleService.removeRoles(id_role, users);
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
    [fetchUsers.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.SUCCESS;
      state.error = initialState.error;
      state.users = action.payload.data;
      console.log('PaloadDataUser', action.payload.data);
    },
    [fetchUsers.pending.type]: (state) => {
      state.isLoading = true;
      state.status = Status.LOADING;
    },
    [fetchUsers.rejected.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.ERROR;
      state.error = action.payload.message;
      alert(action.payload.message);
    },

    [giveRoleUsers.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.SUCCESS;
      state.error = initialState.error;
      const response = action.payload.data;
      console.log('Тут выдают роль', response);

      const updUsers = state.users.map((user) => {
        console.log('Выдалась роль user', response);

        const findUser = response.find((obj) => obj.id_user === user.id_user);
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

    [giveRoleUsers.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.status = Status.SUCCESS;
      state.error = initialState.error;
      const response = action.payload.data;
      console.log('Тут выдают роль', response);

      const updUsers = state.users.map((user) => {
        console.log('Выдалась роль user', response);

        const findUser = response.find((obj) => obj.id_user === user.id_user);
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
        const findUser = response.find(
          (obj: IUser) => obj.id_user === user.id_user
        );
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
