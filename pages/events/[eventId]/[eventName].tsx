import Head from "next/head";
import Navbar from "../../../components/Navbar";
import React, { useState, useEffect } from "react";
import { authStore } from "../../../store/auth-store";
import { IEventFull } from "../../../types/Event";
import { useRouter } from "next/router";
import { api } from "../../../util/api";
import axios from "axios";
import { Container, Icon } from "@chakra-ui/react";
import { AuthState } from "../../../store/jwt-payload";
import Event from "../../../components/Event/Event";
import { BsExclamationCircle } from "react-icons/bs";
import ErrorBlock from "../../../components/ErrorBlock";
import EventContainer from "../../../components/Event/EventContainer";
import EventLoading from "../../../components/Event/EventLoading";
import { IParticipantUser } from "../../../types/Participant";
import { IDrawParticipant } from "../../../types/Draw";

export default function EventPage() {
  const [loading, setLoading] = useState(true); // Loading state for the event page
  const [error, setError] = useState(false);

  const [authState, setAuthState] = useState<AuthState>(authStore.getState());
  const [event, setEvent] = useState<IEventFull>();
  const [meParticipant, setMeParticipant] = useState<IParticipantUser>();
  const [myDraw, setMyDraw] = useState<IParticipantUser>();

  const router = useRouter();
  const { eventId, eventName } = router.query;

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

  const renderEventBlock = () => {
    if (loading) {
      return <EventContainer primary={<EventLoading />} sidebar={<></>} />;
    } else if (event && meParticipant) {
      return (
        <EventContainer
          primary={
            <Event
              event={event}
              authState={authState}
              meParticipant={meParticipant}
              setEvent={setEvent}
              myDraw={myDraw}
            />
          }
          sidebar={<></>}
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
        <title>{event ? `${event.name} - ` : ""} GiftTrade</title>

        <meta
          name="description"
          content={loading ? "Loading description" : event?.description}
        />
      </Head>

      <Navbar
        loggedIn={authState.loggedIn}
        accessToken={authState.accessToken}
        user={authState.user}
        gToken={authState.gToken}
      />

      <Container maxW="4xl" mb="20">
        {renderEventBlock()}
      </Container>
    </>
  );
}
