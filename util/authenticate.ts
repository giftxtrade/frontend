import axios from 'axios';
import { api } from '../util/api';
import { authStore, login, logout } from '../store/auth-store';

export default async function authenticate() {
  const accessToken = localStorage.getItem('access_token')
  if (!accessToken || accessToken.trim() === "") {
    authStore.dispatch(logout());
    return false;
  }

  let loggedIn = false

  await axios.get(api.profile, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  })
    .then(({ data }) => {
      authStore.dispatch(login({
        accessToken: accessToken,
        user: data.user,
        gToken: data.gToken
      }))

      loggedIn = true
    })
    .catch(_ => {
      authStore.dispatch(logout())
    })

  return loggedIn
}