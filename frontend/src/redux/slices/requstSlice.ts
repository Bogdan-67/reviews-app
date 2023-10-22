import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

import { AxiosResponse } from 'axios';
import { Status } from '../../models/Status.enum';
import RequestService from '../../services/RequestService';
import { IRequest } from '../../models/IRequest';

export type Error = {
  message: string;
  errors: [];
};
export type RequestParams = {
  id_interns: number[];
  author: number;
  type_request: number;
};
type FetchRequestsParams = {
  author: number;
};
type FetchOneRequestParams = {
  id_request: number;
};

// Функция регистрации
export const createRequest = createAsyncThunk<
  AxiosResponse<string>,
  RequestParams,
  { rejectValue: string }
>('request/requestStatus', async (params, { rejectWithValue }) => {
  try {
    const { author, id_interns, type_request } = params;
    const id_internsJSON = JSON.stringify(id_interns);
    const response = await RequestService.createRequest(
      id_internsJSON,
      author,
      type_request,
    );
    return response;
  } catch (error) {
    if (!error.response.data.message) {
      return rejectWithValue(error.message);
    } else return rejectWithValue(error.response.data.message);
  }
});

// Функция запроса данных о запросе
export const fetchRequest = createAsyncThunk<
  AxiosResponse<IRequest>,
  FetchOneRequestParams,
  { rejectValue: string }
>('request/fetchRequestStatus', async (params, { rejectWithValue }) => {
  try {
    const { id_request } = params;
    const response = await RequestService.fetchOneRequest(id_request);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    alert(error.response?.data?.message);
    return rejectWithValue(error.response?.data?.message);
  }
});

export const fetchRequests = createAsyncThunk<
  AxiosResponse<IRequest[]>,
  FetchRequestsParams,
  { rejectValue: string }
>('request/fetchRequestStatus', async (params, { rejectWithValue }) => {
  try {
    const { author } = params;
    const response = await RequestService.fetchRequests(author);
    return response;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    alert(error.response?.data?.message);
    return rejectWithValue(error.response?.data?.message);
  }
});

export interface Requsts {
  requests: IRequest[];
  status: Status;
  error: string;
}

const initialState: Requsts = {
  requests: [],
  status: Status.SUCCESS,
  error: '',
};
const requestsSlice = createSlice({
  name: 'Requests',
  initialState,
  reducers: {
    setRequests(state, action: PayloadAction<IRequest[]>) {
      state.requests = action.payload;
    },
    setError(state) {
      state.status = Status.ERROR;
    },
  },
  extraReducers: (builder) => {
    // Кейсы для логина
    // Кейсы для регистрации
    builder.addCase(createRequest.pending, (state) => {
      state.status = Status.LOADING;
      state.error = null;
    });
    builder.addCase(createRequest.fulfilled, (state) => {
      state.status = Status.SUCCESS;
      state.error = null;
    });
    builder.addCase(createRequest.rejected, (state, action) => {
      console.log('REJECTED', action.payload);
      state.error = action.payload ? action.payload : 'Произошла ошибка';
      state.status = Status.ERROR;
    });

    builder.addCase(fetchRequests.pending, (state) => {
      state.status = Status.LOADING;
      state.error = null;
    });
    builder.addCase(fetchRequests.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      state.requests = action.payload.data;
      state.error = null;
    });
    builder.addCase(fetchRequests.rejected, (state, action) => {
      state.error = action.payload ? action.payload : 'Произошла ошибка';
      state.status = Status.ERROR;
    });

    // // Кейсы для запроса данных о пользователе
    // builder.addCase(fetchRequest.pending, (state) => {
    //   state.status = Status.LOADING;
    //   state.error = null;
    // });
    // builder.addCase(fetchRequest.fulfilled, (state, action) => {
    //   state.status = Status.SUCCESS;
    //   state.requests = action.payload.data;
    // });
    // builder.addCase(fetchRequest.rejected, (state, action) => {
    //   state.status = Status.ERROR;
    //   state.error = action.payload
    //     ? action.payload
    //     : "Произошла ошибка при запросе данных";
    // });
  },
});

export const SelectRequests = (state: RootState) =>
  state.requestReducer.requests;

export default requestsSlice.reducer;
