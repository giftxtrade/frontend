import { DocumentContext } from "next/document";
import eventFetch, { fetchMyDraw } from "../../util/ss-event-fetch";
import Event, { IEventProps } from "../../components/Event";

export default function EventIdPage(props: IEventProps) {
  return <Event
    accessToken={props.accessToken}
    user={props.user}
    gToken={props.gToken}
    loggedIn={props.loggedIn}
    event={props.event}
    participants={props.participants}
    link={props.link}
    meParticipant={props.meParticipant}
    myDraw={props.myDraw}
  />
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  const { props, notFound, redirect } = await eventFetch(ctx)

  if (redirect) {
    return {
      redirect: {
        destination: redirect.destination,
        permanent: false
      }
    }
  }

  if (notFound || !props?.event || !props?.accessToken) {
    return { notFound: true }
  }

  const myDraw = await fetchMyDraw(props.event.id, props.accessToken)
  return { props: { ...props, myDraw } }
};