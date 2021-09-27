import {
  Flex,
  Icon,
  Heading,
  ComponentWithAs,
  IconProps,
} from "@chakra-ui/react";

export interface IErrorBlockProps {
  message: string;
  icon: JSX.Element;
}

export default function ErrorBlock({ message, icon }: IErrorBlockProps) {
  return (
    <Flex
      direction="column"
      maxW="full"
      alignItems="center"
      justifyContent="center"
      p="10"
    >
      {icon}
      <Heading size="md" textAlign="center">
        {message}
      </Heading>
    </Flex>
  );
}
