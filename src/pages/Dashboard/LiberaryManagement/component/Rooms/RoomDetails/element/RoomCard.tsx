import React from "react";
import {
  Box,
  Image,
  Text,
  Stack,
  Heading,
  Flex,
  useColorModeValue,
  Tooltip,
  IconButton,
  Button,
} from "@chakra-ui/react";
import StarRatingIcon from "../../../../../../../config/component/StarRatingIcon/StarRatingIcon";
import { AddIcon, EditIcon, CalendarIcon } from "@chakra-ui/icons";

interface CoverImage {
  name: string;
  url: string;
  type: string;
}

interface Data {
  _id: string;
  title: string;
  ratings: number[];
  description: string;
  coverImage: CoverImage;
}

interface DataCardProps {
  data: Data;
  handleForm: (data: Data, action: string) => void;
  handleAddSeat: (data: any, action: string) => void;
  handleReserveSeat: (data: any, action: string) => void; // Added prop for reserve seat
}

const RoomCard: React.FC<DataCardProps> = ({ data, handleForm, handleAddSeat, handleReserveSeat }) => {
  const bg = useColorModeValue("white", "gray.800");
  const shadow = useColorModeValue("md", "dark-lg");
  const hoverShadow = useColorModeValue("lg", "dark-lg");
  const placeholderImage = "https://via.placeholder.com/300x400?text=No+thumbnail+found";

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg={bg}
      shadow={shadow}
      maxW={{ base: "100%", md: "700px" }}
      transition="all 0.3s"
      _hover={{ shadow: hoverShadow }}
    >
      <Flex>
        <Image
          src={data?.coverImage?.url || placeholderImage}
          alt={data?.coverImage?.name || "No Image"}
          borderRadius="md"
          objectFit="cover"
          w={{ base: "100px", md: "200px" }}
          h={{ base: "100px", md: "200px" }}
          mr={4}
        />
        <Stack flex="1" spacing={3}>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading
              as="h4"
              size="md"
              isTruncated
              onClick={() => handleForm(data, "view")}
              cursor="pointer"
            >
              {data.title}
            </Heading>
            <Tooltip label="Edit Room" aria-label="Edit Room">
              <IconButton
                icon={<EditIcon />}
                onClick={() => handleForm(data, "edit")}
                variant="ghost"
                colorScheme="teal"
                aria-label="Edit Room"
                size="sm"
              />
            </Tooltip>
          </Flex>
          <Text fontSize="sm" noOfLines={[2, 3]} flexGrow={1}>
            {data.description}
          </Text>
          <Flex justifyContent="space-between" alignItems="center">
            <StarRatingIcon rating={data.ratings || 0} />
            <Stack direction="row" spacing={3}>
              <Button
                leftIcon={<AddIcon />}
                size="sm"
                colorScheme="teal"
                onClick={() => handleAddSeat(data, 'add')}
              >
                Add Seat
              </Button>
              <Button
                leftIcon={<CalendarIcon />}
                size="sm"
                colorScheme="blue"
                onClick={() => handleReserveSeat(data, 'add')}
              >
                Reserve Seat
              </Button>
            </Stack>
          </Flex>
        </Stack>
      </Flex>
    </Box>
  );
};

export default RoomCard;
