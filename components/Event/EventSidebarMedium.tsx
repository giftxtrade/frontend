import { AuthState } from "../../store/jwt-payload";
import { IEventFull } from "../../types/Event";
import { IParticipantUser } from "../../types/Participant";
import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalBody,
} from "@chakra-ui/react";
import React from "react";
import MyWishlist from "../MyWishlist";
import WishlistNav from "../WishlistNav";

export interface IEventSidebarMediumProps {
  event: IEventFull;
  meParticipant: IParticipantUser;
  authState: AuthState;
}

export default function EventSidebarMedium({
  event,
  meParticipant,
  authState,
}: IEventSidebarMediumProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        size="md"
      >
        <ModalOverlay />

        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <MyWishlist
              event={event}
              accessToken={authState.accessToken}
              meParticipant={meParticipant}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <WishlistNav onOpen={onOpen} />
    </>
  );
}
