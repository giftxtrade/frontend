import { authStore, logout } from '../store/auth-store';
import router from "next/router";
import { useCookies } from "react-cookie";
import { Flex, Spinner } from '@chakra-ui/react'
import Head from 'next/head';
import { useEffect } from 'react';
import { serialize } from 'cookie';
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