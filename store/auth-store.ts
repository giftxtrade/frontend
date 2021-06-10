import { createSlice, configureStore } from '@reduxjs/toolkit'
import JwtPayload from './jwt-payload';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: '',
    user: { id: 0, name: '', email: '', imageUrl: '' },
    gToken: '',
    loggedIn: false
  },
  reducers: {
    login: (state, { payload }: { payload: JwtPayload }) => {
      const aT = localStorage.getItem('access_token')
      if (!aT || aT.trim() === '')
        return;

      state.loggedIn = true
      state.accessToken = payload.accessToken
      state.gToken = payload.gToken
      state.user = {
        id: payload.user.id,
        name: payload.user.name,
        email: payload.user.email,
        imageUrl: payload.user.imageUrl,
      }
    },
    logout: state => {
      localStorage.removeItem('access_token')

      state.loggedIn = false
      state.user = { id: 0, name: '', email: '', imageUrl: '' }
      state.gToken = ''
      state.accessToken = ''
    }
  }
})

export const { login, logout } = authSlice.actions

export const authStore = configureStore({
  reducer: authSlice.reducer
})