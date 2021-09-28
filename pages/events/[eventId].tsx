import { DocumentContext } from "next/document";
import eventFetch from "../../util/ss-event-fetch";

export default function EventIdPage(props: any) {
  return <></>;
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

  if (notFound || !props?.eventDetails || !props?.accessToken) {
    return { notFound: true }
  }
};