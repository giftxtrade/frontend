import { AuthState } from "../../store/jwt-payload";
import { IEventFull } from "../../types/Event";
import { IParticipantUser } from "../../types/Participant";
import React, { useState, useEffect } from "react";
import {
  Heading,
  Text,
  Box,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  useMediaQuery,
} from "@chakra-ui/react";
import axios from "axios";
import { unstable_batchedUpdates } from "react-dom";
import styles from "../../styles/ParticipantWishlist.module.css";
import { IWish } from "../../types/Wish";
import { IProduct } from "../../types/Product";
import { api } from "../../util/api";
import PendingInvite from "../PendingInvite";
import Search from "../Search";
import WishlistTotal from "../WishlistTotal";
import { WishlistLoadingItem } from "../WishlistItem";
import WishlistItemSelect from "../WishlistItemSelect";
import WishlistNav from "../WishlistNav";
import EventContainer from "../Event/EventContainer";

export interface IWishlistProps {
  event: IEventFull;
  meParticipant: IParticipantUser;
  authStore: AuthState;
}

export default function Wishlist({
  event,
  meParticipant,
  authStore,
}: IWishlistProps) {
  const [loadingWishes, setLoadingWishes] = useState(true);
  const [wishes, setWishes] = useState(Array<IWish>());
  const [wishProductIds, setWishProductIds] = useState(new Set<number>());
  const [showWishlist, setShowWishlist] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(Array<IProduct>());

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios
      .get(`${api.wishes}/${event.id}`, {
        headers: { Authorization: "Bearer " + authStore.accessToken },
      })
      .then(({ data }: { data: IWish[] }) => {
        const productIdSet = new Set<number>();
        data.forEach(({ product }) => productIdSet.add(product.id));

        unstable_batchedUpdates(() => {
          setWishes(data);
          setLoadingWishes(false);
          setWishProductIds(productIdSet);
          setSelectedProducts(data.map<IProduct>((w) => w.product));
        });
      })
      .catch((err) => {
        setLoadingWishes(false);
      });
  }, []);

  const addWish = (product: IProduct) => {
    setWishProductIds(wishProductIds.add(product.id));
    axios
      .post(
        api.wishes,
        {
          eventId: event.id,
          productId: product.id,
          participantId: meParticipant.id,
        },
        {
          headers: { Authorization: "Bearer " + authStore.accessToken },
        }
      )
      .then(({ data }: { data: IWish }) => {
        setWishes([data, ...wishes]);
        setSelectedProducts([...selectedProducts, data.product]);
      })
      .catch((_) => console.log("Could not add wish"));
  };

  const removeWish = (product: IProduct) => {
    wishProductIds.delete(product.id);
    setWishProductIds(wishProductIds);
    setWishes(wishes.filter((w) => w.product.id !== product.id));
    axios
      .delete(api.wishes, {
        headers: { Authorization: "Bearer " + authStore.accessToken },
        data: {
          eventId: event.id,
          productId: product.id,
          participantId: meParticipant.id,
        },
      })
      .then(({ data }) => {
        setSelectedProducts(
          selectedProducts.filter((p) => p.id !== product.id)
        );
      })
      .catch((_) => {});
  };

  // Media queries
  const [isMediumScreen] = useMediaQuery("(max-width: 900px)");

  return (
    <>
      <EventContainer
        primary={
          <>
            {!meParticipant.accepted ? (
              <Box mb="5">
                <PendingInvite
                  event={event}
                  accessToken={authStore.accessToken}
                />
              </Box>
            ) : (
              <></>
            )}

            <Search
              accessToken={authStore.accessToken}
              minPrice={1}
              maxPrice={event.budget}
              pageLimit={50}
              event={event}
              addWish={addWish}
              removeWish={removeWish}
              productSet={wishProductIds}
            />
          </>
        }
        sidebar={
          isMediumScreen ? (
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              size={"md"}
              scrollBehavior="inside"
            >
              <ModalOverlay />

              <ModalContent>
                <ModalHeader>My Wishlist</ModalHeader>
                <ModalCloseButton />

                <Box pl="6" pr="6" mb="3">
                  <WishlistTotal
                    selectedProducts={selectedProducts}
                    showAddToCart={false}
                  />
                </Box>

                <ModalBody>
                  {loadingWishes ? (
                    [1, 2].map((p, i) => (
                      <Box mb="5" key={`loading#${i}`}>
                        <WishlistLoadingItem />
                      </Box>
                    ))
                  ) : wishes.length === 0 ? (
                    <Text textAlign="center" color="gray.400">
                      Your wishlist is empty
                    </Text>
                  ) : (
                    wishes.map(({ product }, i) => (
                      <Box mb="5" key={`wishItemMd#${i}`}>
                        <WishlistItemSelect
                          product={product}
                          selectedProducts={selectedProducts}
                          setSelectedProducts={setSelectedProducts}
                          removeWish={(pr: IProduct) => {
                            setSelectedProducts(
                              selectedProducts.filter((p) => p.id !== pr.id)
                            );
                            removeWish(pr);
                          }}
                        />
                      </Box>
                    ))
                  )}
                </ModalBody>
              </ModalContent>
            </Modal>
          ) : (
            <Box position="sticky" top="2">
              <Box
                pt="3"
                pb="3"
                pl="4"
                pr="4"
                bg="white"
                className={styles.cartReveal}
              >
                <Heading size="md" mb="3" color="gray.700">
                  My Wishlist
                </Heading>

                <WishlistTotal
                  selectedProducts={selectedProducts}
                  showAddToCart={false}
                />
              </Box>

              <Box h="90vh" pt="4" pb="7" overflowY="auto" overflowX="hidden">
                {loadingWishes ? (
                  [1, 2].map((p, i) => (
                    <Box mb="5" key={`loading#${i}`}>
                      <WishlistLoadingItem />
                    </Box>
                  ))
                ) : wishes.length === 0 ? (
                  <Text textAlign="center" color="gray.400">
                    Your wishlist is empty
                  </Text>
                ) : (
                  wishes.map(({ product }, i) => (
                    <Box mb="5" key={`wishItem#${i}`}>
                      <WishlistItemSelect
                        product={product}
                        selectedProducts={selectedProducts}
                        setSelectedProducts={setSelectedProducts}
                        removeWish={(pr: IProduct) => {
                          setSelectedProducts(
                            selectedProducts.filter((p) => p.id !== pr.id)
                          );
                          removeWish(pr);
                        }}
                      />
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          )
        }
      />

      <WishlistNav onOpen={onOpen} numWishes={wishes.length} />
    </>
  );
}
