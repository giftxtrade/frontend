import React, { useState, useEffect } from 'react';
import { Flex, Container, Icon, Spinner } from "@chakra-ui/react";
import Head from "next/head";
import Navbar from "../../../../components/Navbar";
import { useRouter } from "next/router";
import { IEventFull } from "../../../../types/Event";
import { AuthState } from "../../../../store/jwt-payload";
import { authStore } from "../../../../store/auth-store";
import { IParticipantUser } from "../../../../types/Participant";
import ErrorBlock from "../../../../components/ErrorBlock";
import { BsExclamationCircle } from "react-icons/bs";
import Wishlist from "../../../../components/Wishlist/Wishlist";
import { fetchEvent } from "../[eventName]";

export default function WishlistPage() {
  const [loading, setLoading] = useState(true); // Loading state for the event page
  const [error, setError] = useState(false);

  const [authState, setAuthState] = useState<AuthState>(authStore.getState());
  const [event, setEvent] = useState<IEventFull>();
  const [meParticipant, setMeParticipant] = useState<IParticipantUser>();
  const [myDraw, setMyDraw] = useState<IParticipantUser>();

  const router = useRouter();
  const { eventId } = router.query;

  useEffect(() => {
    fetchEvent(
      eventId,
      authState,
      setAuthState,
      setEvent,
      setMeParticipant,
      setError,
      setLoading,
      () => setLoading(false)
    );
  }, [authState]);

  const renderWishlistBlock = () => {
    if (loading) {
      return (
        <Flex
          direction="column"
          maxW="full"
          alignItems="center"
          justifyContent="center"
          p="10"
        >
          <Spinner size="xl" />
        </Flex>
      );
    } else if (event && meParticipant) {
      return (
        <Wishlist
          event={event}
          meParticipant={meParticipant}
          authStore={authState}
        />
      );
    } else if (error) {
      return (
        <ErrorBlock
          message="Event could not be found"
          icon={<Icon as={BsExclamationCircle} boxSize="20" mb="7" />}
        />
      );
    }
  };

  return (
    <>
      <Head>
        <title>
          {event ? `My Wishlist for ${event.name} - GiftTrade` : "GiftTrade"}
        </title>
      </Head>

      <Navbar
        loggedIn={authState.loggedIn}
        accessToken={authState.accessToken}
        user={authState.user}
        gToken={authState.gToken}
      />

      <Container maxW="4xl" mb="20">
        {renderWishlistBlock()}
      </Container>
    </>
  );
}