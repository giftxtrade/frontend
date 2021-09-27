import { createSlice, configureStore } from '@reduxjs/toolkit'
import JwtPayload, { AuthState, User } from "./jwt-payload";

export const authSlice = createSlice({
  name: "auth",
  initialState: {} as AuthState,
  reducers: {
    login: (state, { payload }: { payload: JwtPayload }) => {
      if (!payload.accessToken || payload.accessToken.trim() === "") return;

      state.loggedIn = true;
      state.accessToken = payload.accessToken;
      state.gToken = payload.gToken;
      state.user = {
        id: payload.user.id,
        name: payload.user.name,
        email: payload.user.email,
        imageUrl: payload.user.imageUrl,
      };
    },
    logout: (state) => {
      localStorage.removeItem("access_token");

      state.loggedIn = false;
      state.user = { id: 0, name: "", email: "", imageUrl: "" };
      state.gToken = "";
      state.accessToken = "";
    },
  },
});

export const { login, logout } = authSlice.actions

export const authStore = configureStore({
  reducer: authSlice.reducer
})