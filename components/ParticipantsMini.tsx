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
  const render = () => {
    const elems = new Array<JSX.Element>();

    if (participants.length <= 3) {
      participants.forEach(p => elems.push(<MiniProfile user={p.user} />))
    } else {
      for (let i = 0; i < 3; i++) {
        elems.push(<MiniProfile user={participants[i].user} />)
      }
      elems.push(<span className={styles.mini}>+{participants.length - 3}</span>)
    }
    return elems;
  }

  return (
    <Box ml='10px'>
      {render().map(e => e)}
    </Box>
  )
}