import { createSlice, configureStore } from '@reduxjs/toolkit'
import JwtPayload, { AuthState } from "./jwt-payload";

export const authSlice = createSlice({
  name: "auth",
  initialState: {} as AuthState,
  reducers: {
    login: (state, { payload }: { payload: JwtPayload }) => {
      if (!payload.accessToken || payload.accessToken.trim() === "") return;

      state.loggedIn = true;
      state.accessToken = payload.accessToken;
      state.user = {
        ...payload.user
      };
    },
    logout: (state) => {
      localStorage.removeItem("access_token");

      state.loggedIn = false;
      state.user = { id: 0, name: "", email: "", imageUrl: "", active: false };
      state.accessToken = "";
    },
  },
});

export const { login, logout } = authSlice.actions

export const authStore = configureStore({
  reducer: authSlice.reducer
})