import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { IoIosChatbubbles, IoMdHappy } from "react-icons/io";
import {
  primaryButtonHoverStyle,
  primaryButtonStyle,
} from "../../../globalStyles";
import {
  inputBorderColor,
  inputBorderColorFocus,
  litePrimaryColor,
  primaryColor,
  textColor,
  whiteTextColor,
} from "../../../globalColors";
import { FiSend } from "react-icons/fi";

interface ChatMessage {
  text: string;
  timestamp: string;
  user: string;
}

interface ChatboxPopupProps {
  isOpen?: boolean;
}

const dummyMessages: ChatMessage[] = [
  { text: "Hello from user1", timestamp: "10:00 AM", user: "user1" },
  { text: "Hi from user2", timestamp: "10:01 AM", user: "user2" },
  { text: "How are you?", timestamp: "10:02 AM", user: "user1" },
  { text: "I'm good, thanks!", timestamp: "10:03 AM", user: "user2" },
];

const ChatboxPopup: React.FC<ChatboxPopupProps> = ({ isOpen = false }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(dummyMessages);
  const [inputValue, setInputValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setShowEmojiPicker(false);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: ChatMessage = {
        text: inputValue,
        timestamp: new Date()
          .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .toUpperCase(),
        user: "user1",
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setInputValue((prevInput) => prevInput + emoji.emoji);
  };

  const handleInputClick = () => {
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isModalOpen, lastMessageRef]);

  return (
    <>
      <Box
        position="fixed"
        bottom={{ base: 6, md: 10 }}
        right={{ base: 6, md: 16 }}
      >
        <IconButton
          isRound={true}
          aria-label="Chatbox"
          icon={<IoIosChatbubbles />}
          size={"lg"}
          fontSize={"25px"}
          {...primaryButtonStyle}
          _hover={{ ...primaryButtonHoverStyle, border: "1px solid" }}
          boxShadow="rgb(0 0 0 / 40%) 0px 0px 10px"
          onClick={toggleModal}
        />
      </Box>

      <Modal
        size={"sm"}
        isOpen={isModalOpen}
        onClose={toggleModal}
        closeOnOverlayClick={true}
        scrollBehavior="inside"
        blockScrollOnMount={false}
        motionPreset="slideInBottom"
      >
        {/* <ModalOverlay /> */}
        <ModalContent
          h={{ base: "100vh", md: "500px" }}
          borderRadius={10}
          pos={"fixed"}
          bottom={{ base: 1, md: 10 }}
          right={{ base: 0, md: 16 }}
        >
          <ModalHeader
            bg={primaryColor}
            borderRadius={10}
            borderBottom={"1px solid"}
            borderColor={"gray.200"}
          >
            <Flex align={"center"}>
              <Avatar src="https://bit.ly/broken-link" />
              <Box mx={3} color={"white"}>
                <Text fontSize={"16px"}>Chat with</Text>
                <Text>Helpdesk</Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton
            color={"white"}
            _hover={{ transform: "rotate(90deg)" }}
            transition={"transform 0.4s ease"}
          />
          <ModalBody
            bg={useColorModeValue("gray.100", "gray.900")}
            display="flex"
            flexDirection="column"
            mx={"1px"}
            padding={1}
            className="customScrollBar"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                alignSelf={message.user === "user1" ? "flex-end" : "flex-start"}
              >
                <Box fontSize="10px" color={textColor} textAlign={ message.user === "user1" ? "right" : "left"}>
                  {message?.timestamp}
                </Box>
                <Box
                  p={"4px 12px"}
                  borderWidth="1px"
                  borderRadius="10px"
                  my={1}
                  bg={
                    message.user === "user1" ? primaryColor : litePrimaryColor
                  }                  
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                >
                  <Box
                    color={
                      message.user === "user1" ? whiteTextColor : textColor
                    }
                  >
                    {message.text}
                  </Box>
                </Box>
              </Box>
            ))}
          </ModalBody>

          <ModalFooter
            bg="transparent"
            p={3}
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex w="100%" align="center">
              <InputGroup flex="1">
                <InputLeftElement h="100%" mx="2px">
                  <IconButton
                    isRound
                    aria-label="emoji-picker"
                    icon={<IoMdHappy />}
                    size="sm"
                    color="gray.600"
                    fontSize="22px"
                    variant="ghost"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  />
                </InputLeftElement>

                <Input
                  type="text"
                  size="md"
                  placeholder="Enter message"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  _focus={{ borderColor: "white" }}
                  border={`1px solid ${inputBorderColor}`}
                  onClick={handleInputClick}
                  _focusVisible={{
                    outline: "none",
                    borderColor: `${inputBorderColorFocus}`,
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  borderRadius="full"
                  pl="45px"
                />
              </InputGroup>

              <IconButton
                isRound
                aria-label="send-button"
                icon={<FiSend />}
                boxSize={{ base: "40px", md: "50px" }}
                {...primaryButtonStyle}
                _hover={{ ...primaryButtonHoverStyle, border: "1px solid" }}
                fontSize={{ base: "18px", md: "24px" }}
                ml={3}
                onClick={handleSendMessage}
              />
            </Flex>
          </ModalFooter>

          {showEmojiPicker && (
            <Box
              pos="absolute"
              bottom="70px"
              left={{ base: "10px", md: "20px" }}
              zIndex={10}
              boxShadow="lg"
              borderRadius="md"
              bg="white"
            >
              <EmojiPicker
                width={330}
                height={350}
                skinTonesDisabled
                previewConfig={{ showPreview: false }}
                onEmojiClick={handleEmojiClick}
              />
            </Box>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatboxPopup;
