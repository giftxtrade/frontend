import { DocumentContext } from "next/document";

export default function EventBase(props: any) {
  return <></>;
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  return {
    redirect: {
      destination: "/home",
      permanent: true,
    },
  };
};
