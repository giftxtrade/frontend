import { DocumentContext } from 'next/document';
import { serverSideAuth } from './server-side-auth';
import { IEvent, IEventDetails, IEventFull } from '../types/Event';
import { IParticipantUser, IParticipant } from '../types/Participant';
import { ILink } from '../types/Link';
import axios from 'axios';
import { api } from './api';
import { IDraw } from '../types/Draw';
import { User } from '../store/jwt-payload';
import { eventNameSlug } from './links';

export interface IServiceSideEventProps {
  accessToken: string | undefined
  user: User | undefined
  gToken: string | undefined
  loggedIn: boolean | undefined
  eventDetails: IEventDetails
}

export interface IServerSideEventFetch {
  props: IServiceSideEventProps | undefined
  notFound: boolean
  redirect: { destination: string } | undefined
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

  let eventDetails: IEventDetails | undefined
  if (props.loggedIn) {
    await axios.get(`${api.events}/${idRaw}?verify=true`, {
      headers: { "Authorization": "Bearer " + props.accessToken }
    })
      .then(({ data }: { data: IEventDetails }) => {
        eventDetails = data
      })
      .catch(_ => { })
  }

  if (!eventDetails) {
    return getProps(undefined, true, undefined)
  }

  const eventSlug = eventNameSlug(eventDetails.name);

  if (eventName) {
    if (eventName !== eventSlug)
      return getProps(undefined, false, `/events/${eventDetails.id}/${eventNameSlug(eventDetails.name)}`)
  } else if (eventSlug !== '') {
    return getProps(undefined, false, `/events/${eventDetails.id}/${eventNameSlug(eventDetails.name)}`)
  }

  return getProps({
    accessToken: props.accessToken,
    user: props.user,
    gToken: props.gToken,
    loggedIn: props.loggedIn,
    eventDetails: eventDetails
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