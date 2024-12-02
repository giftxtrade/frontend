import { createSlice, configureStore } from '@reduxjs/toolkit'
import { AuthState } from "./jwt-payload";
import { Auth, User } from '@giftxtrade/api-types';

export const ACCESS_TOKEN_KEY = "access_token"

export const authSlice = createSlice({
  name: "auth",
  initialState: { loggedIn: false, token: "", user: {} as User } as AuthState,
  reducers: {
    login: (state, { payload }: { payload: Auth }) => {
      if (!payload.token || payload.token.trim() === "") return;

      state.loggedIn = true;
      state.token = payload.token;
      state.user = {
        ...payload.user
      };

      localStorage.setItem(ACCESS_TOKEN_KEY, state.token)
    },
    logout: (state) => {
      localStorage.removeItem(ACCESS_TOKEN_KEY);

      state.loggedIn = false;
      state.user = { id: 0, name: "", email: "", imageUrl: "", active: false };
      state.token = "";
    },
  },
});

export const { login, logout } = authSlice.actions

export const authStore = configureStore({
  reducer: authSlice.reducer
})