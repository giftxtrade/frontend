import { DocumentContext } from "next/document";
import { IEventProps } from "../../components/Event";

export default function EventBase(props: IEventProps) {
  return <></>
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  return {
    redirect: {
      destination: '/home',
      permanent: true
    }
  }
};