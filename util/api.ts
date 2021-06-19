export const base = 'http://localhost:3001/'

export const api = {
  home: base,
  google: base + 'auth/google',
  google_redirect: base + 'auth/google/redirect',
  profile: base + 'auth/profile',
  products: base + 'products', // GET -> Params: limit, page, min_price, max_price, search
  events: base + 'events'
};