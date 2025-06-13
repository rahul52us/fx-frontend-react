// src/components/BookCard.tsx
import React from "react";
import {
  Box,
  Image,
  Badge,
  Text,
  Stack,
  Heading,
  Tag,
  Flex,
  Spacer,
  useColorModeValue,
  Tooltip,
  IconButton,
  Wrap,
  WrapItem,
  Button,
} from "@chakra-ui/react";
import StarRatingIcon from "../../../../../../../config/component/StarRatingIcon/StarRatingIcon";
import { EditIcon } from "@chakra-ui/icons";
import store from "../../../../../../../store/store";
import { observer } from "mobx-react-lite";

interface Book {
  _id: string;
  title: string;
  author: string;
  user: string;
  company: string;
  isbn: string;
  categories: string[];
  language: any;
  availableCopies: number;
  totalCopies: number;
  description: string;
  tags: string[];
  isReferenceOnly: boolean;
  createdAt: string;
  ratings: any[];
  coverImage: {
    name: string;
    url: string;
    type: string;
  };
}

interface BookCardProps {
  book: Book;
  handleBookForm: any;
  setOpenUserModel:any;
  handleAddUserUser:any;
  setSelectedBook:any;
}

const BookCard: React.FC<BookCardProps> = observer(({ book, handleBookForm, setOpenUserModel, handleAddUserUser, setSelectedBook }) => {
  const {auth : {checkPermission, user}} = store
  const bg = useColorModeValue("white", "gray.800");
  const shadow = useColorModeValue("md", "dark-lg");
  const hoverShadow = useColorModeValue("lg", "dark-lg");
  const placeholderImage =
    "https://via.placeholder.com/300x400?text=No+thumbnail+found";


  const addBooksToUser = (books : any) => {
    setSelectedBook(books)
    if(user.role === "admin" || user.role === "superadmin"){
      setOpenUserModel({open : true})
    }
    else {
      handleAddUserUser(user,books)
    }
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="6"
      bg={bg}
      shadow={shadow}
      maxW={{ base: "100%", md: "100%" }}
      transition="all 0.3s"
      _hover={{ shadow: hoverShadow }}
    >
      <Image
        src={book?.coverImage?.url || placeholderImage}
        alt={book?.coverImage?.name || "No Image"}
        borderRadius="md"
        objectFit="cover"
        w="100%"
        h={{ base: "200px", md: "300px" }}
      />
      <Stack mt="6" spacing="3">
        <Flex justifyContent="space-between">
          <Heading
            as="h4"
            size="md"
            isTruncated
            onClick={() => handleBookForm(book, "view")}
            cursor="pointer"
          >
            {book.title}
          </Heading>
          {checkPermission('books','edit') &&  <Tooltip label="Edit Book" aria-label="Edit Book">
            <IconButton
              icon={<EditIcon />}
              onClick={() => handleBookForm(book, "edit")}
              variant="ghost"
              colorScheme="teal"
              aria-label="Edit Book"
            />
          </Tooltip>}
        </Flex>
        <Text fontSize="sm" isTruncated>
          Author: {book.author}
        </Text>
        <Text fontSize="sm" isTruncated>
          ISBN: {book.isbn}
        </Text>
        {Array.isArray(book.language) && (
          <Wrap>
            {book.language?.map((lang: string) => (
              <WrapItem key={lang}>
                <Tag colorScheme="blue" size="sm" variant="solid">
                  {lang}
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        )}
        <Flex align="center">
          <Badge colorScheme="green" mr="2">
            {book.availableCopies} Available / {book.totalCopies} Total
          </Badge>
          {book.isReferenceOnly && (
            <Badge colorScheme="red">Reference Only</Badge>
          )}
          <Spacer />
          <StarRatingIcon rating={book.ratings || 0} />
        </Flex>
        <Text fontSize="sm" noOfLines={[1, 2, 3]} minHeight={12}>
          {book.description}
        </Text>
        {Array.isArray(book.tags) && (
          <Flex wrap="wrap" minH={10}>
            {book.tags.map((tag: string, index : number) => (
              <Tag key={index} colorScheme="teal" mr="2" mb="2">
                {tag}
              </Tag>
            ))}
          </Flex>
        )}
        <Button
            size="sm"
            colorScheme="teal"
            variant="solid"
            onClick={() => addBooksToUser(book)}
          >
            Add to Card
          </Button>
      </Stack>
    </Box>
  );
});

export default BookCard;