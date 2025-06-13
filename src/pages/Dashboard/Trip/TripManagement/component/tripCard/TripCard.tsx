import {
  Box,
  Image,
  Card,
  Heading,
  Flex,
  Text,
  useColorModeValue,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import styled from "styled-components";
import { BiEdit } from "react-icons/bi";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { capitalizeString } from "../../../../../../config/constant/function";
import store from "../../../../../../store/store";

const ThumbnailWrapper = styled(Box)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
`;

const ThumbnailElementNoImage = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: lightgray;
`;

const ThumbnailCard = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: lightgray;
`;

const TripCard = observer(
  ({ setTripFormData, item, handleClick, setSelectedRecord }: any) => {
    const {auth : {checkPermission}} = store
    const [thumbnailLoadError, setThumbnailLoadError] = useState(false);
    const bookmarkColor = useColorModeValue("gray.600", "gray.500");
    const headingColor = useColorModeValue("black", "white");
    const { title, description, thumbnail } = item;

    return (
      <Card
        p={4}
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        _hover={{ boxShadow: "lg" }}
        transition="0.3s"
      >
        <ThumbnailWrapper>
          {thumbnailLoadError ? (
            <ThumbnailElementNoImage />
          ) : (
            <ThumbnailCard
              src={thumbnail?.url}
              alt={thumbnail?.name || "Image Not Found"}
              onError={() => setThumbnailLoadError(true)}
            />
          )}
        </ThumbnailWrapper>
        <Flex mt={4} justify="space-between" alignItems="center">
          <Heading color="gray.500" fontSize="sm">
            {capitalizeString(item.type)} Trip
          </Heading>
          {checkPermission('trip','edit') && (
            <Tooltip label="edit" aria-label="edit Tooltip">
              <IconButton
                icon={<BiEdit />}
                aria-label="edit"
                borderRadius="full"
                color={bookmarkColor}
                _hover={{ color: "blue.500" }}
                transition="0.3s"
                onClick={() => {
                  handleClick && handleClick(item);
                  setTripFormData({ open: true, data: item, type: "edit" });
                }}
              />
            </Tooltip>
          )}
        </Flex>
        <Flex mt={3} justifyContent="space-between" alignItems="center">
          <Heading
            fontSize="lg"
            cursor="pointer"
            color={headingColor}
            _hover={{ color: "blue.500" }}
            transition="0.3s"
            onClick={() => {
              setSelectedRecord &&
                setSelectedRecord({ open: true, data: item });
            }}
          >
            {title}
          </Heading>
        </Flex>
        <Text
          textAlign="start"
          mt={4}
          mb={1}
          color="gray.500"
          fontSize="sm"
          noOfLines={2}
          minH="40px"
          maxH="40px"
        >
          {description}
        </Text>
        <Text mt={2} fontSize="sm" color="gray.500">
          Total Travels: {item?.travelDetails?.length}
        </Text>
      </Card>
    );
  }
);

export default TripCard;
