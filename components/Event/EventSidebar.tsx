import { AuthState } from "../../store/jwt-payload";
import { IEventFull } from "../../types/Event";
import { IParticipantUser } from "../../types/Participant";
import {
  useMediaQuery,
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

export interface IEventSidebarProps {
  event: IEventFull;
  meParticipant: IParticipantUser;
  authState: AuthState;
}

export default function EventSidebar({
  event,
  meParticipant,
  authState,
}: IEventSidebarProps) {
  const [isMediumScreen] = useMediaQuery("(max-width: 900px)");
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {isMediumScreen ? (
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
      ) : (
        <MyWishlist
          event={event}
          accessToken={authState.accessToken}
          meParticipant={meParticipant}
        />
      )}

      <WishlistNav onOpen={onOpen} />
    </>
  );
}
