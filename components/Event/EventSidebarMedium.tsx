import { AuthState } from "../../store/jwt-payload"
import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalBody,
} from "@chakra-ui/react"
import React from "react"
import MyWishlist from "../MyWishlist"
import WishlistNav from "../WishlistNav"
import { Participant, Event } from "@giftxtrade/api-types"

export interface IEventSidebarMediumProps {
  event: Event
  meParticipant: Participant
  authState: AuthState
}

export default function EventSidebarMedium({
  event,
  meParticipant,
  authState,
}: IEventSidebarMediumProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose()
        }}
        size="md"
      >
        <ModalOverlay />

        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <MyWishlist
              event={event}
              accessToken={authState.token}
              meParticipant={meParticipant}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <WishlistNav onOpen={onOpen} />
    </>
  )
}
