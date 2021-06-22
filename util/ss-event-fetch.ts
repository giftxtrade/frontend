import { DocumentContext } from 'next/document';
import { serverSideAuth } from './server-side-auth';
import { IEvent } from '../types/Event';
import { IParticipantUser, IParticipant } from '../types/Participant';
import { ILink } from '../types/Link';
import axios from 'axios';
import { api } from './api';

export default async function eventFetch(ctx: DocumentContext) {
  const idRaw = ctx.query.id;

  const { props } = await serverSideAuth(ctx)

  let event: IEvent | undefined;
  let participants: IParticipantUser[] = [];
  let link: ILink | undefined;
  if (props.loggedIn) {
    await axios.get(`${api.events}/${idRaw}`, {
      headers: { "Authorization": "Bearer " + props.accessToken }
    })
      .then(({ data }: { data: { event: IEvent, participants: IParticipantUser[], link: ILink } }) => {
        event = data.event
        participants = data.participants
        link = data.link
      })
      .catch(_ => { })
  }

  if (!event) {
    return {
      notFound: true
    }
  }

  let meParticipant: IParticipant | undefined;
  for (const p of event.participants) {
    if (p.email === props.user?.email) {
      meParticipant = p
      break;
    }
  }

  return {
    props: {
      accessToken: props.accessToken,
      user: props.user,
      gToken: props.gToken,
      loggedIn: props.loggedIn,
      event: event,
      participants: participants,
      link: link,
      meParticipant: meParticipant
    }
  }
}