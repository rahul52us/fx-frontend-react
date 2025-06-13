import React, { useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Tag,
  Text,
  useColorModeValue,
  Tooltip,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { FaTags } from "react-icons/fa";
import { BsFillPersonFill, BsFillTrashFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { dashboard } from "../../../config/constant/routes";
import FormModel from "../../../config/component/common/FormModel/FormModel";
import store from "../../../store/store";

interface BlogData {
  _id: string;
  title: string;
  subTitle: string;
  isPrivate: boolean;
  tags: string[];
  comments: any[];
  coverImage?: {
    url: string;
    alt: string;
  };
  createdBy: {
    pic: {
      name: string;
      url: string;
      type: string;
    };
    _id: string;
    name: string;
    username: string;
    createdAt: string;
  };
  createdAt: string;
  reactions: any[];
}

const BlogWidget: React.FC<{ blog: BlogData, fetchBlogsDetails : any }> = ({ blog , fetchBlogsDetails}) => {
  const {BlogStore : {deleteBlog}, auth : {openNotification}} = store
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  const cardBg = useColorModeValue("white", "gray.800");
  const tagBg = useColorModeValue("blue.100", "blue.700");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const subtitleColor = useColorModeValue("gray.600", "gray.400");
  const coverFallback = useColorModeValue("gray.200", "gray.700");

  const handleDelete = (status : boolean) => {
    setDeleteLoading(true)
    deleteBlog({id : blog._id, deleted : status}).then((data : any) => {
      openNotification({
        title: "Deleted SUCCESSFULLY",
        message: data.message,
      });
      fetchBlogsDetails()
      onClose();
    }).catch((err:any) => {
      openNotification({
        title: "Delete FAILED",
        message: err.message,
        type: "error",
      });
    }).finally(() => {
      setDeleteLoading(false)
    })

  };

  return (
    <Box
      bg={cardBg}
      borderRadius="lg"
      boxShadow="xl"
      overflow="hidden"
      transition="transform 0.3s ease-in-out, box-shadow 0.3s ease"
      _hover={{
        transform: "scale(1.03)",
        boxShadow: "lg",
      }}
      cursor="pointer"
      maxW="lg"
      m="auto"
      mb={6}
    >
      <Box bg={coverFallback} h="200px" position="relative">
        {blog?.coverImage?.url ? (
          <Image
            src={blog.coverImage.url}
            alt={blog.coverImage.alt || "Blog Cover"}
            objectFit="cover"
            width="100%"
            height="100%"
            transition="opacity 0.3s ease"
            _hover={{ opacity: 0.7 }}
          />
        ) : (
          <Flex
            h="100%"
            justifyContent="center"
            alignItems="center"
            color="gray.500"
            fontWeight="bold"
          >
            No Cover Image
          </Flex>
        )}
      </Box>

      <Box p={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading
            as="h2"
            size="sm"
            textTransform="capitalize"
            fontWeight="semibold"
            _hover={{ color: "blue.500" }}
            cursor="pointer"
            onClick={() =>
              navigate(
                `${dashboard.blog.index}/edit/${blog.title
                  ?.split(" ")
                  .join("-")}`
              )
            }
          >
            {blog?.title}
          </Heading>
          <Text
            fontSize="sm"
            fontWeight="bold"
            color={blog.isPrivate ? "red.500" : "green.500"}
          >
            {blog?.isPrivate ? "Private" : "Public"}
          </Text>
        </Flex>

        <Text
          mb={4}
          color={subtitleColor}
          fontSize="sm"
          lineHeight="1.6"
          noOfLines={2}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <Box as="span" dangerouslySetInnerHTML={{ __html: blog.subTitle }} />
        </Text>

        <HStack spacing={3} wrap="wrap" mb={4}>
          <Icon as={FaTags} color="blue.500" />
          {blog?.tags?.map((tag) => (
            <Tooltip key={tag} label={tag} aria-label="Tag Tooltip">
              <Tag
                size="md"
                bg={tagBg}
                color="blue.800"
                textTransform="capitalize"
                fontWeight="medium"
                transition="background-color 0.2s ease"
                _hover={{ bg: "blue.500", color: "white" }}
              >
                {tag}
              </Tag>
            </Tooltip>
          ))}
        </HStack>

        <Flex alignItems="center" p={4} borderRadius="md" mb={4}>
          <Avatar
            name={blog?.createdBy?.name}
            src={blog?.createdBy?.pic?.url}
            size="lg"
            mr={4}
            borderWidth={2}
            borderColor="blue.500"
          />
          <Box>
            <Text fontWeight="bold" fontSize="lg" color={textColor}>
              {blog?.createdBy?.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              @{blog?.createdBy?.username}
            </Text>
          </Box>
        </Flex>

        <Flex justify="space-between" align="center">
          <HStack spacing={2}>
            <Icon as={BsFillPersonFill} color="green.500" />
            <Text fontSize="sm" color={textColor}>
              Created At:{" "}
              {new Date(blog?.createdAt).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Text>
          </HStack>
          <Icon
            as={BsFillTrashFill}
            color="red.500"
            cursor="pointer"
            onClick={onOpen}
            _hover={{ color: "red.600" }}
          />
        </Flex>
      </Box>

      <FormModel
        isCentered
        open={isOpen}
        close={onClose}
        title="Confirm Delete"
        size="lg"
      >
        <Box p={6} borderRadius="md" textAlign="center">
          <Text mb={4} fontSize="lg" fontWeight="medium" color="gray.700">
            Are you sure you want to{" "}
            <strong>
              {isPermanentDelete
                ? "permanently delete"
                : "make this blog inactive"}
            </strong>
            ? <br />
            <Text as="span" color="gray.500">
              This action cannot be undone.
            </Text>
          </Text>
        </Box>

        <Flex justify="space-between" align="center" p={4}>
          <HStack spacing={4}>
            <Button
              colorScheme="red"
              onClick={() => {
                setIsPermanentDelete(true);
                handleDelete(true);
              }}
              borderRadius="md"
              fontWeight="semibold"
              _hover={{ bg: "red.600" }}
              isLoading={deleteLoading}
            >
              Permanently Delete
            </Button>

            <Button
              colorScheme="yellow"
              onClick={() => {
                setIsPermanentDelete(false);
                handleDelete(false);
              }}
              borderRadius="md"
              fontWeight="semibold"
              _hover={{ bg: "yellow.600" }}
              isLoading={deleteLoading}
            >
              Make Inactive
            </Button>
          </HStack>
          <Button
            variant="outline"
            onClick={onClose}
            colorScheme="red"
            borderRadius="md"
            fontWeight="semibold"
            _hover={{ bg: "gray.100" }}
          >
            Cancel
          </Button>
        </Flex>
      </FormModel>
    </Box>
  );
};

export default BlogWidget;
