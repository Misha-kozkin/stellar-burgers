import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { setTextRange } from 'typescript';

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (date: TLoginData) => {
    const res = await loginUserApi(date);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    if (localStorage.getItem('refreshToken')) {
      getUserApi()
        .then((res) => dispatch(setUser(res.user)))
        .catch(() => {
          localStorage.removeItem('refreshToken');
        })
        .finally(() => dispatch(authCheck()));
    } else {
      dispatch(authCheck());
    }
  }
);

interface TUserState {
  isAuthChecked: boolean;
  data: TUser | null;
  error: string | null;
}

const initialState: TUserState = {
  isAuthChecked: false,
  data: null,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    },
    setUser: (state, action) => {
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
      })
      // login
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
      })
      // update User
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      // logoute
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
      });
  }
});

export const { authCheck, setUser } = userSlice.actions;
export default userSlice.reducer;
