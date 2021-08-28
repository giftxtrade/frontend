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

export interface IServiceSideEventProps {
  accessToken: string | undefined,
  user: User | undefined,
  gToken: string | undefined,
  loggedIn: boolean | undefined,
  event: IEvent,
  participants: IParticipantUser[],
  link: ILink | undefined,
  meParticipant: IParticipant | undefined
}

export interface IServerSideEventFetch {
  props: IServiceSideEventProps | undefined,
  notFound: boolean,
  redirect: { destination: string } | undefined,
}

export default async function eventFetch(ctx: DocumentContext): Promise<IServerSideEventFetch> {
  const idRaw = ctx.query.eventId;

  let q = ctx.query.eventName;
  let eventName: string | undefined;
  if (typeof (q) === 'object')
    eventName = q[0]
  else
    eventName = q

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
    return getProps(undefined, true, undefined)
  }

  const eventSlug = eventNameSlug(event.name);

  if (eventName) {
    if (eventName !== eventSlug)
      return getProps(undefined, false, `/events/${event.id}/${eventNameSlug(event.name)}`)
  } else if (eventSlug !== '') {
    return getProps(undefined, false, `/events/${event.id}/${eventNameSlug(event.name)}`)
  }

  return getProps({
    accessToken: props.accessToken,
    user: props.user,
    gToken: props.gToken,
    loggedIn: props.loggedIn,
    event: event,
    participants: participants,
    link: link,
    meParticipant: getMeParticipant(event, props.user)
  }, false, undefined)
}

function getProps(props: IServiceSideEventProps | undefined, notFound: boolean, destination: string | undefined): IServerSideEventFetch {
  return {
    props,
    notFound,
    redirect: destination ? {
      destination
    } : undefined
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