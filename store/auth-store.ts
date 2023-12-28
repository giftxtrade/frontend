import { createSlice, configureStore } from '@reduxjs/toolkit'
import { AuthState } from "./jwt-payload";
import { Auth } from '@giftxtrade/api-types';

export const authSlice = createSlice({
  name: "auth",
  initialState: {} as AuthState,
  reducers: {
    login: (state, { payload }: { payload: Auth }) => {
      if (!payload.token || payload.token.trim() === "") return;

      state.loggedIn = true;
      state.token = payload.token;
      state.user = {
        ...payload.user
      };
    },
    logout: (state) => {
      localStorage.removeItem("access_token");

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