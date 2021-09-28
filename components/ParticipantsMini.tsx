import { Box, Image } from '@chakra-ui/react';
import { IParticipantUser } from '../types/Participant';
import { changeProfileSize } from '../util/content';
import styles from '../styles/ParticipantsMini.module.css';
import { User } from '../store/jwt-payload';

function MiniProfile({ user }: { user: User | null }) {
  return <img
    src={changeProfileSize(user?.imageUrl ? user?.imageUrl : '', 30)}
    className={styles.mini}
  />
}

export default function ParticipantsMini({ participants }: { participants: IParticipantUser[] }) {
  const maxProfiles = 4;

  const render = () => {
    const elems = new Array<JSX.Element>();

    if (participants.length <= maxProfiles) {
      participants.forEach((p, i) => elems.push(<MiniProfile user={p.user} key={`participantMini#${i}`} />))
    } else {
      for (let i = 0; i < maxProfiles; i++) {
        elems.push(
          <MiniProfile
            user={participants[i].user}
            key={`participantMini#${i}`}
          />
        );
      }
      elems.push(<span className={styles.mini}>+{participants.length - maxProfiles}</span>)
    }
    return elems;
  }

  return (
    <Box ml='10px'>
      {render().map(e => e)}
    </Box>
  )
}