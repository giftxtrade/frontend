import { DocumentContext } from "next/document";
import axios from 'axios';
import cookie, { serialize } from 'cookie';
import { api } from './api';

export async function serverSideAuth(ctx: DocumentContext) {
  const myCookie = ctx?.req?.headers?.cookie ? ctx.req.headers.cookie : '';
  const accessToken = cookie.parse(myCookie).access_token

  if (ctx.res && (!accessToken || accessToken === '')) {
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();
    return { props: {} }
  }

  let user: any = {}
  let gToken: string = ''
  await axios.get(api.profile, {
    headers: {
      "Authorization": "Bearer " + accessToken
    }
  })
    .then(({ data }) => {
      user = data.user
      gToken = data.gToken
    })
    .catch(_ => {
      if (ctx.res) {
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
      return { props: {} }
    })

  return {
    props: { accessToken, user, gToken, loggedIn: true }
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