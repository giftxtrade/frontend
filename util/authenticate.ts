import axios, { AxiosResponse } from 'axios';
import { api } from '../util/api';
import { authStore, login, logout, ACCESS_TOKEN_KEY } from '../store/auth-store';
import { Auth } from '@giftxtrade/api-types';

export default async function authenticate() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  if (!accessToken || accessToken.trim() === "") {
    authStore.dispatch(logout());
    return false;
  }

  let loggedIn = false

  await axios.get(api.profile, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  })
    .then(({ data }: AxiosResponse<Auth>) => {
      authStore.dispatch(login({
        token: data.token,
        user: data.user,
      }))

      loggedIn = true
    })
    .catch(_ => {
      authStore.dispatch(logout())
    })

  return loggedIn
}
