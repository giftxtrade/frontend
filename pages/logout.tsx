import { authStore, logout } from '../store/auth-store';
import router from "next/router";
import { Flex, Spinner } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    authStore.dispatch(logout());
    localStorage.removeItem("invite_code");
    localStorage.removeItem("redirect");
    localStorage.removeItem("access_token");
    router.push("/");
  }, []);

  return (
    <>
      <Head>
        <title>Logging out...</title>
      </Head>

      <Flex alignItems="center" justifyContent="center" p="20">
        <Spinner size="xl" />
      </Flex>
    </>
  );
}