import { Box } from '@chakra-ui/layout';
import styles from '../styles/ProductSmLoading.module.css';

export default function ProductSmLoading() {
  return (
    <Box className={`${styles.productSmLoading} loadingInner`} mb='10' pl='2' pr='2'>
      <Box
        rounded='md'
        mb='3'
        overflow='hidden'
        className={`${styles.loadingImg} skeletonLoading`}
      />

      <Box className={`${styles.title} skeletonLoading`} />
      <Box className={`${styles.title} skeletonLoading`} width='90%' />
      <Box className={`${styles.title} skeletonLoading`} width='40%' />

      <Box className={`${styles.starHolder} skeletonLoading`}></Box>
    </Box>
  )
}