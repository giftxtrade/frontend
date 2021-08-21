import { DocumentContext } from "next/document";
import eventFetch, { fetchMyDraw } from "../../util/ss-event-fetch";
import { IEventProps } from "./[eventId]/[eventName]";

export default function Event(props: IEventProps) {
  return <></>
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