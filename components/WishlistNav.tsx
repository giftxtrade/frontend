import { Button, Icon } from '@chakra-ui/react';
import { BsBagFill } from 'react-icons/bs';
import styles from '../styles/WishlistNav.module.css';
import { Dispatch, SetStateAction } from 'react';

export interface IWishlistNavProps {
  setWishlist: Dispatch<SetStateAction<boolean>>
  onOpen: () => void
}

export default function WishlistNav({ setWishlist, onOpen }: IWishlistNavProps) {
  return (
    <div className={styles.wishlistNav}>
      <Button
        boxShadow='dark-lg'
        colorScheme='red'
        size='lg'
        rounded='full'
        p='1'
        onClick={() => {
          setWishlist(true)
          onOpen()
        }}
        position='relative'
      >
        <Icon as={BsBagFill} />
      </Button>
    </div>
  )
}