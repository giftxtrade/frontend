import { DocumentContext } from 'next/document';
import { serverSideAuth } from './server-side-auth';
import { IEventDetails } from '../types/Event';
import axios from 'axios';
import { api } from './api';
import { eventNameSlug } from './links';
import { AuthState } from '../store/jwt-payload';

export interface IServiceSideEventProps extends AuthState {
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
      headers: { "Authorization": `Bearer ${props.token}` }
    })
      .then(({ data }: { data: IEventDetails }) => {
        eventDetails = data
      })
      .catch(_ => { })
  }

  if (!eventDetails) {
    return getProps(undefined, true)
  }

  const eventSlug = eventNameSlug(eventDetails.name);

  if (eventName) {
    if (eventName !== eventSlug)
      return getProps(undefined, false, `/events/${eventDetails.id}/${eventNameSlug(eventDetails.name)}`)
  } else if (eventSlug !== '') {
    return getProps(undefined, false, `/events/${eventDetails.id}/${eventNameSlug(eventDetails.name)}`)
  }

  return getProps({
    ...props,
    eventDetails,
  }, false, undefined)
}

function getProps(props: IServiceSideEventProps | undefined, notFound: boolean, destination?: string): IServerSideEventFetch {
  return {
    props,
    notFound,
    redirect: destination ? {
      destination
    } : undefined
  }
}