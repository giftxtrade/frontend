import { Box } from '@chakra-ui/react';
import styles from '../styles/EventBoxSmLoading.module.css'

export default function EventBoxSmLoading() {
  return (
    <Box
      maxW="full"
      overflow="hidden"
      p='5'
      className='border-bottom-child'
    >
      <div className={`skeletonLoading ${styles.title}`}></div>
      <div className={`skeletonLoading ${styles.drawDate}`}></div>

      <div className={styles.badgeHolder}>
        <div className={`skeletonLoading ${styles.badge}`}></div>
        <div className={`skeletonLoading ${styles.badge}`}></div>
      </div>
    </Box>
  )
}