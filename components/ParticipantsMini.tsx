import { Box, Image } from '@chakra-ui/react';
import { IParticipantUser } from '../types/Participant';
import { changeProfileSize } from '../util/content';
import styles from '../styles/ParticipantsMini.module.css';
import { User, Event } from "@giftxtrade/api-types"

function MiniProfile({ img }: { img: string | undefined }) {
  return img ? (
    <Image src={changeProfileSize(img, 30)} className={styles.mini} />
  ) : (
    <Image src="default.jpg" width={30} className={styles.mini} />
  )
}

export default function ParticipantsMini({
  participants,
}: {
  participants: Event["participants"]
}) {
  const maxProfiles = 4

  const render = () => {
    const elems = new Array<JSX.Element>()
    if (!participants) return elems

    if (participants.length <= maxProfiles) {
      participants.forEach((p, i) =>
        elems.push(
          <MiniProfile img={p.user?.imageUrl} key={`participantMini#${i}`} />,
        ),
      )
    } else {
      for (let i = 0; i < maxProfiles; i++) {
        elems.push(
          <MiniProfile
            img={participants[i].user?.imageUrl}
            key={`participantMini#${i}`}
          />,
        )
      }
      elems.push(
        <span className={styles.mini}>
          +{participants.length - maxProfiles}
        </span>,
      )
    }
    return elems
  }

  return <Box ml="10px">{render().map((e) => e)}</Box>
}