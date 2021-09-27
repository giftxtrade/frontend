import { Button, Icon, Box, Badge } from '@chakra-ui/react';
import { BsBagFill } from 'react-icons/bs';
import styles from "../styles/WishlistNav.module.css";

export interface IWishlistNavProps {
  onOpen: () => void;
  numWishes?: number;
}

export default function WishlistNav({ onOpen, numWishes }: IWishlistNavProps) {
  return (
    <div className={styles.wishlistNav}>
      <Button
        boxShadow="dark-lg"
        colorScheme="red"
        size="lg"
        rounded="full"
        p="1"
        onClick={onOpen}
        position="relative"
      >
        <Icon as={BsBagFill} />

        {numWishes ? (
          <Box position="absolute" top="-1" right="-1">
            <Badge fontSize="0.8em" colorScheme="red" borderRadius="full">
              {numWishes}
            </Badge>
          </Box>
        ) : (
          <></>
        )}
      </Button>
    </div>
  );
}