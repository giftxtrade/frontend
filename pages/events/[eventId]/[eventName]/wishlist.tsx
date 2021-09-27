import React, { useState, useEffect } from 'react';
import { Flex, Container, Icon, Spinner } from "@chakra-ui/react";
import Head from "next/head";
import Navbar from "../../../../components/Navbar";
import axios from "axios";
import { api } from "../../../../util/api";
import { useRouter } from "next/router";
import { IEventFull } from "../../../../types/Event";
import { AuthState } from "../../../../store/jwt-payload";
import { authStore } from "../../../../store/auth-store";
import { IParticipantUser } from "../../../../types/Participant";
import { IDrawParticipant } from "../../../../types/Draw";
import ErrorBlock from "../../../../components/ErrorBlock";
import { BsExclamationCircle } from "react-icons/bs";
import Wishlist from "../../../../components/Wishlist/Wishlist";

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
    setError(false);
    authStore.subscribe(() => setAuthState(authStore.getState()));

    if (!authState.loggedIn || !eventId) return;

    axios
      .get(`${api.events}/${eventId}`, {
        headers: { Authorization: "Bearer " + authState.accessToken },
      })
      .then(({ data }: { data: IEventFull }) => {
        setEvent(data);
        setMeParticipant(
          data.participants.find((p) => p.email === authState.user.email)
        );

        axios
          .get(`${api.draws}/me/${data.id}`, {
            headers: { Authorization: "Bearer " + authState.accessToken },
          })
          .then(({ data }: { data: IDrawParticipant }) => {
            setLoading(false);
            setMyDraw(data.drawee);
          })
          .catch((_) => {
            setLoading(false);
          });
      })
      .catch((_) => {
        setLoading(false);
        setError(true);
      });
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
        {/* <Flex direction="row"></Flex> */}
      </Container>
    </>
  );
}