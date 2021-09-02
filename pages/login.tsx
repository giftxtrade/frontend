import { api } from '../util/api';
import Head from 'next/head';
import PageLoader from '../components/PageLoader';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { DocumentContext } from 'next/document';

export default function Login(props: { redirect: string | undefined }) {
  const router = useRouter();

  useEffect(() => {
    if (props.redirect) {
      localStorage.setItem('redirect', props.redirect);
    }
    router.push(api.google)
  }, [])

  return (
    <>
      <Head>
        <title>Login - GiftTrade</title>
      </Head>

      <PageLoader />
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  const redirect = ctx.query?.redirect;
  return { props: { redirect: typeof (redirect) === 'object' ? redirect[0] : redirect } }
};