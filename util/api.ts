const make_base = () => {
  return process.env.NEXT_PUBLIC_API_BASE;
}

export const base = make_base()

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
  get_link: base + 'events/get-link', // Auth required, [POST], param required eventId
  verify_invite_code: base + 'events/verify-invite-code', // [GET], param required invite code
  invite_code: base + 'events/invite-code', // Auth required, [GET], param required invite code
  eventDetails: base + 'events/get-details', // [GET] :inviteCode
  wishes: base + 'wishes', // Auth required, [POST] with {eventId, participantId, productId}, [GET] :eventId, [DELETE] with {eventId, participantId, productId}
  draws: base + 'draws', // Auth-required [POST] with {eventId}, [GET] :eventId, [GET] /me/eventId
  draw_confirm: base + 'draws/confirm', // Auth-required, [GET] :eventId
  participants: base + 'participants', // [DELETE] :participantId, [PATCH] :participantId with {address}
  manage_participants: base + 'participants/manage', // Auth-required [DELETE] query param {eventId, participantId}, [PATCH] query param {eventId, participantId} with {organizer: boolean}
};