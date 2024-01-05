import GetLinkEvent from "./GetLinkEvent"
import Draws from "./Draws"
import Settings from "./Settings"
import LeaveGroup from "../LeaveGroup"
import { AuthState } from "../../store/jwt-payload"
import React, { Dispatch, SetStateAction } from "react"
import { Modal, ModalOverlay } from "@chakra-ui/react"
import { Event, Participant } from "@giftxtrade/api-types"

export interface IEventOptionsModalProps {
  event: Event
  setEvent: Dispatch<SetStateAction<Event | undefined>>

  meParticipant: Participant
  authState: AuthState

  myDraw: Participant | undefined
  setMyDraw: Dispatch<SetStateAction<Participant | undefined>>

  linkModal: boolean
  linkLoading: boolean
  linkError: boolean
  setLinkModal: Dispatch<SetStateAction<boolean>>

  isOpen: boolean
  onClose: () => void

  showDraw: boolean
  setShowDraw: Dispatch<SetStateAction<boolean>>

  settingsModal: boolean
  setSettingsModal: Dispatch<SetStateAction<boolean>>

  leaveGroupModal: boolean
  setLeaveGroupModal: Dispatch<SetStateAction<boolean>>
}

export default function EventOptionsModal({
  event,
  setEvent,
  meParticipant,
  authState,
  myDraw,
  setMyDraw,
  linkModal,
  linkLoading,
  linkError,
  setLinkModal,
  isOpen,
  onClose,
  showDraw,
  setShowDraw,
  settingsModal,
  setSettingsModal,
  leaveGroupModal,
  setLeaveGroupModal,
}: IEventOptionsModalProps) {
  const renderModal = () => {
    if (linkModal) {
      return (
        <GetLinkEvent
          link={event.links?.length === 1 ? event.links[0] : undefined}
          drawDate={event.drawAt}
          linkLoading={linkLoading}
          linkError={linkError}
          onClose={onClose}
          setLinkModal={setLinkModal}
        />
      )
    } else if (showDraw) {
      return (
        <Draws
          setShowDraw={setShowDraw}
          onClose={onClose}
          accessToken={authState.token}
          event={event}
          setMyDraw={setMyDraw}
          meParticipant={meParticipant}
        />
      )
    } else if (meParticipant?.organizer && settingsModal) {
      return (
        <Settings
          accessToken={authState.token}
          event={event}
          onClose={onClose}
          setSettingsModal={setSettingsModal}
          meParticipant={meParticipant}
          setEvent={setEvent}
          myDraw={myDraw}
          setMyDraw={setMyDraw}
        />
      )
    } else if (meParticipant && leaveGroupModal) {
      return (
        <LeaveGroup
          accessToken={authState.token}
          event={event}
          onClose={onClose}
          setLeaveGroupModal={setLeaveGroupModal}
          meParticipant={meParticipant}
        />
      )
    }
    return <></>
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setLinkModal(false)
        setShowDraw(false)
        onClose()
      }}
      size={showDraw ? "xl" : "md"}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />

      {renderModal()}
    </Modal>
  )
}
