import NextLink from 'next/link';
import { BsChevronLeft } from 'react-icons/bs';
import {
  Button,
  Box,
  Link,
  Icon
} from '@chakra-ui/react';
import { useState } from 'react';

export interface IBackButtonProps {
  href: string
  value: string
}

export default function BackButton({ href, value }: IBackButtonProps) {
  const [loading, setLoading] = useState(false)

  return (
    <Box mb='5'>
      <NextLink href={href} passHref>
        <Link>
          <Button
            leftIcon={<Icon as={BsChevronLeft} />}
            size='sm'
            isLoading={loading}
            onClick={() => setLoading(true)}
          >
            {value}
          </Button>
        </Link>
      </NextLink>
    </Box>
  )
}