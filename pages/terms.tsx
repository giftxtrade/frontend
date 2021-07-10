import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Terms() {
  const router = useRouter()

  useEffect(() => {
    router.push('/privacy')
  }, [])

  return <></>
}