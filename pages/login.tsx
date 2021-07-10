import { DocumentContext } from 'next/document';
import { api } from '../util/api';

export default function Login() {
  return <></>
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  return {
    redirect: {
      destination: `${api.google}`
    }
  }
};