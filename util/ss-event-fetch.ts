import { DocumentContext } from 'next/document';
import { serverSideAuth } from './server-side-auth';
import { IEvent } from '../types/Event';
import { IParticipantUser, IParticipant } from '../types/Participant';
import { ILink } from '../types/Link';
import axios from 'axios';
import { api } from './api';
import { IDraw } from '../types/Draw';
import { User } from '../store/jwt-payload';
import { eventNameSlug } from './links';

export interface IServerSideEventFetch {
  props: {
    accessToken: string | undefined,
    user: User | undefined,
    gToken: string | undefined,
    loggedIn: boolean | undefined,
    event: IEvent,
    participants: IParticipantUser[],
    link: ILink | undefined,
    meParticipant: IParticipant | undefined
  } | undefined,
  notFound: boolean,
  redirect: { destination: string } | undefined,
}

export default async function eventFetch(ctx: DocumentContext): Promise<IServerSideEventFetch> {
  const idRaw = ctx.query.eventId;
  const eventName = ctx.query.eventName;

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
      props: undefined,
      notFound: true,
      redirect: undefined
    }
  }

  if (eventName) {
    // Verify is slug is correct
    if (eventName !== eventNameSlug(event.name)) {
      return {
        props: undefined,
        notFound: false,
        redirect: {
          destination: `/events/${event.id}/${eventNameSlug(event.name)}`
        }
      }
    }
  } else {
    // Redirect to event with slug
    return {
      props: undefined,
      notFound: false,
      redirect: {
        destination: `/events/${event.id}/${eventNameSlug(event.name)}`
      },
    }
  }

  let meParticipant = getMeParticipant(event, props.user)

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
    },
    notFound: false,
    redirect: undefined,
  }
}

export async function fetchMyDraw(eventId: number, accessToken: string): Promise<IParticipant | null> {
  let myDraw: IParticipant | null = null
  await axios.get(`${api.draws}/me/${eventId}`, {
    headers: { "Authorization": "Bearer " + accessToken }
  })
    .then(({ data }: { data: IDraw }) => {
      myDraw = data.drawee
    })
    .catch(err => {
      myDraw = null
    })
  return myDraw
}

/**
 * Gets the current user's participant status
 * 
 * @param event Current Event
 * @param user JWT User object
 * @returns IParticipant
 */
function getMeParticipant(event: IEvent, user: User | undefined): IParticipant | undefined {
  for (const p of event.participants) {
    if (p.email === user?.email) {
      return p
    }
  }
  return undefined
}