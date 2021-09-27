import { Flex, Container, useMediaQuery } from "@chakra-ui/react";

export interface IEventContainerProps {
  primary: JSX.Element;
  sidebar?: JSX.Element;
  sidebarMed?: JSX.Element;
}

export default function EventContainer({
  primary,
  sidebar,
  sidebarMed,
}: IEventContainerProps) {
  const [isMediumScreen] = useMediaQuery("(max-width: 900px)");

  return (
    <Flex direction="row">
      <Container flex="2" pl="1">
        {primary}
      </Container>

      {isMediumScreen ? (
        <>{sidebarMed ? sidebarMed : <></>}</>
      ) : (
        <Container flex="1" pl="2" pr="0">
          {sidebar ? sidebar : <></>}
        </Container>
      )}
    </Flex>
  );
}
