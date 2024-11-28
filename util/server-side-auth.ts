import { DocumentContext } from "next/document";
import axios from 'axios';
import cookie, { serialize } from 'cookie';
import { api } from './api';
import { Auth } from "@giftxtrade/api-types";
import { AuthState } from "../store/jwt-payload";
import { ACCESS_TOKEN_KEY } from "../store/auth-store";

export async function serverSideAuth(ctx: DocumentContext): Promise<{ props: AuthState }> {
  const myCookie = ctx.req?.headers?.cookie ?? '';
  const accessToken = cookie.parse(myCookie)[ACCESS_TOKEN_KEY]

  if (!accessToken || accessToken === '') {
    const currentUrl = ctx.req?.url;

    ctx.res?.writeHead(302, { Location: `/login?redirect=${currentUrl ?? '/'}` });
    ctx.res?.end();
    return { props: {} as AuthState }
  }

  const { data, status } = await axios.get<Auth>(api.profile, {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  })
  if (!data || status !== 200) {
    if (!ctx.res) return {} as any;

    ctx.res.statusCode = 302
    ctx.res.setHeader('Set-Cookie', [
      serialize('access_token', '', {
        maxAge: -1,
        path: '/',
      }),
    ])
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();
  }

  return {
    props: { token: data.token, user: data.user, loggedIn: true }
  }
}

export async function redirectHomeIfLoggedIn(ctx: DocumentContext) {
  const myCookie = ctx?.req?.headers?.cookie ? ctx.req.headers.cookie : '';
  const accessToken = cookie.parse(myCookie).access_token

  if (accessToken && accessToken !== '') {
    if (ctx.res) {
      ctx.res.writeHead(302, { Location: '/home' });
      ctx.res.end();
    }
  }
  return { props: {} }
}