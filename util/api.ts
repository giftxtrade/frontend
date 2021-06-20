export const base = 'http://localhost:3001/'

export const api = {
  home: base,
  google: base + 'auth/google',
  google_redirect: base + 'auth/google/redirect',
  profile: base + 'auth/profile', // Auth required
  products: base + 'products', // GET -> Params: limit, page, min_price, max_price, search
  events: base + 'events', // Auth required [POST], [GET]
  invites: base + 'events/invites', // Auth required, [GET]
  accept_invite: base + 'events/invites/accept', // Auth required, [GET], param required eventID
  decline_invite: base + 'events/invites/decline', // Auth required, [GET], param required eventID
};