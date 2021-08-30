import { Box } from '@chakra-ui/react';
import styles from '../styles/EventBoxSmLoading.module.css'

export default function EventBoxSmLoading() {
  return (
    <Box
      maxW="full"
      borderWidth="1px" borderRadius="lg"
      overflow="hidden"
      p='5'
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