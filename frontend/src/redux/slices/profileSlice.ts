import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import AuthService from '../../services/AuthService';
import { AuthResponse } from '../../models/response/AuthResponse';
import axios, { AxiosResponse } from 'axios';
import { IUser } from '../../models/IUser';
import { API_URL } from '../../http';
import UserService from '../../services/UserService';
import { Status } from '../../models/Status.enum';
import { message } from 'antd';

export type LoginParams = {
  login: string;
  password: string;
};

export type Error = {
  message: string;
  errors: [];
};

export type RegistrParams = {
  firstname: string;
  lastname: string;
  middlename: string;
  email: string;
  phone: string;
  password: string;
  recaptcha: string; // Добавлено поле для капчи
};

export type FetchUserParams = {
  id_account: number;
};

const localAuth = (local: string) => {
  if (local === 'false') return false;
  else if (local === 'true') return true;
  else return null;
};

// Функция логина
export const loginAccount = createAsyncThunk<
  AxiosResponse<AuthResponse>,
  LoginParams,
  { rejectValue: string }
>('user/loginStatus', async (params, { rejectWithValue }) => {
  try {
    const { login, password } = params;
    const response = await AuthService.login(login, password);
    return response;
  } catch (error) {
    if (!error.response.data.message) {
      return rejectWithValue(error.message);
    } else return rejectWithValue(error.response.data.message);
  }
});

// Функция регистрации
export const registrAccount = createAsyncThunk<
  AxiosResponse<AuthResponse>,
  RegistrParams,
  { rejectValue: string }
>('user/registrStatus', async (params, { rejectWithValue }) => {
  try {
    const { firstname, lastname, middlename, phone, email, password, recaptcha } = params;
    const response = await AuthService.registration(
      password,
      firstname,
      lastname,
      middlename,
      email,
      phone,
      recaptcha,
    );
    return response;
  } catch (error) {
    if (!error.response.data.message) {
      return rejectWithValue(error.message);
    } else return rejectWithValue(error.response.data.message);
  }
});

// Функция логаута
export const logoutAccount = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logoutStatus',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
    } catch (error) {
      if (!error.response.data.message) {
        return rejectWithValue(error.message);
      } else return rejectWithValue(error.response.data.message);
    }
  },
);

// Функция проверки авторизации
export const checkAuth = createAsyncThunk<
  AxiosResponse<AuthResponse>,
  void,
  { rejectValue: string }
>('user/checkAuthStatus', async (params, { rejectWithValue }) => {
  try {
    const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    if (!error.response.data.message) {
      return rejectWithValue(error.message);
    } else return rejectWithValue(error.response.data.message);
  }
});

// Функция запроса данных о пользователе
export const fetchUser = createAsyncThunk<AxiosResponse<IUser>, FetchUserParams>(
  'user/fetchUserStatus',
  async (params, { rejectWithValue }) => {
    try {
      const { id_account } = params;
      const response = await UserService.fetchUser(id_account);
      return response;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      alert(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export interface Profile {
  user: IUser;
  status: Status;
  error: string;
  isAuth: boolean;
  updateUserStatus: Status;
}

const initialState: Profile = {
  user: {
    id_user: null,
    firstname: '',
    lastname: '',
    middlename: '',
    email: '',
    phone: '',
    rating: 10,
    role: '',
  },
  status: Status.SUCCESS,
  error: '',
  isAuth: localStorage.isAuth ? localAuth(localStorage.isAuth) : false,
  updateUserStatus: Status.SUCCESS, // Изначально статус обновления данных пользователя установлен в SUCCESS
};
const profileSlice = createSlice({
  name: 'Profile',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
    setError(state) {
      state.status = Status.ERROR;
    },
  },
  extraReducers: (builder) => {
    // Кейсы для логина
    builder.addCase(loginAccount.pending, (state) => {
      console.log('LOADING');
      state.status = Status.LOADING;
      state.user = initialState.user;
      state.error = null;
    });
    builder.addCase(loginAccount.fulfilled, (state, action) => {
      state.user = action.payload.data.user;
      message.success(`Добро пожаловать, ${action.payload.data.user.firstname}!`);
      state.status = Status.SUCCESS;
      localStorage.setItem('token', action.payload.data.accessToken);
      localStorage.setItem('role', action.payload.data.user.role);
      state.isAuth = true;
      localStorage.isAuth = true;
    });
    builder.addCase(loginAccount.rejected, (state, action) => {
      state.error = action.payload ? action.payload : 'Произошла ошибка';
      state.status = Status.ERROR;
      state.user = initialState.user;
    });

    // Кейсы для регистрации
    builder.addCase(registrAccount.pending, (state) => {
      state.status = Status.LOADING;
      state.user = initialState.user;
      state.error = null;
    });
    builder.addCase(registrAccount.fulfilled, (state, action) => {
      state.user = action.payload.data.user;
      message.success(`Добро пожаловать, ${action.payload.data.user.firstname}!`);
      state.status = Status.SUCCESS;
      localStorage.setItem('token', action.payload.data.accessToken);
      localStorage.setItem('role', action.payload.data.user.role);
      state.isAuth = true;
      localStorage.isAuth = true;
    });
    builder.addCase(registrAccount.rejected, (state, action) => {
      console.log('REJECTED', action.payload);
      state.error = action.payload ? action.payload : 'Произошла ошибка';
      state.status = Status.ERROR;
      state.user = initialState.user;
    });

    // Кейсы для логаута
    builder.addCase(logoutAccount.pending, (state) => {
      state.status = Status.LOADING;
      state.error = null;
    });
    builder.addCase(logoutAccount.fulfilled, (state) => {
      state.status = Status.SUCCESS;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      state.isAuth = false;
      localStorage.isAuth = false;
      state.user = initialState.user;
    });
    builder.addCase(logoutAccount.rejected, (state, action) => {
      state.status = Status.ERROR;
      state.error = action.payload ? action.payload : 'Произошла ошибка';
    });

    // Кейсы для проверки авторизации
    builder.addCase(checkAuth.pending, (state) => {
      state.status = Status.LOADING;
      state.error = null;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      localStorage.setItem('token', action.payload.data.accessToken);
      localStorage.setItem('role', action.payload.data.user.role);
      state.isAuth = true;
      localStorage.isAuth = true;
      state.user = action.payload.data.user;
    });
    builder.addCase(checkAuth.rejected, (state, action) => {
      state.isAuth = false;
      state.error = action.payload ? action.payload : 'Произошла ошибка';
      localStorage.isAuth = false;
      state.status = Status.ERROR;
    });

    // Кейсы для запроса данных о пользователе
    builder.addCase(fetchUser.pending, (state) => {
      state.status = Status.LOADING;
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      state.user = action.payload.data;
      localStorage.setItem('role', action.payload.data.role);
    });
    builder.addCase(fetchUser.rejected, (state) => {
      console.log('ERROR');
      state.status = Status.ERROR;
    });
  },
});

export const { setUser, setError } = profileSlice.actions;
export const SelectProfile = (state: RootState) => state.profile;
export const SelectUser = (state: RootState) => state.profile.user;
export const SelectUserRole = (state: RootState) => state.profile.user.role;
export const SelectUserID = (state: RootState) => state.profile.user.id_user;

export default profileSlice.reducer;
