import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Heading,
  Radio,
  Checkbox,
  VStack,
  Text,
  HStack,
  Progress,
  Tooltip,
  Icon,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalFooter,
  Fade,
  useToast,
  Input,
  Card,
  Flex,
} from "@chakra-ui/react";
import { CheckCircleIcon, CheckIcon, InfoIcon } from "@chakra-ui/icons";
import Confetti from "react-confetti";
import store from "../../../store/store";
import { getStatusType } from "../../../config/constant/statusCode";
import { useNavigate } from "react-router-dom";
import { web } from "../../../config/constant/routes";

const sectionOptions: any = {
  portfolio: [
    { label: "MetaData", page: "metaData", key: "metaData1" },
    { label: "Hero", page: "hero", key: "hero1", layouts: ["hero1", "hero2"] },
    {
      label: "About",
      page: "about",
      key: "about1",
      layouts: ["about1", "about2"],
    },
    {
      label: "Principal",
      page: "principal",
      key: "principal1",
      layouts: ["principal1", "principal2"],
    },
    { label: "Faq", page: "faq", key: "faq1", layouts: ["faq1", "faq2"] },
    {
      label: "Curriculum",
      page: "curriculum",
      key: "curriculum1",
      layouts: ["curriculum1", "curriculum2"],
    },
    {
      label: "Testimonial",
      page: "testimonial",
      key: "testimonial1",
      layouts: ["testimonial1", "testimonial2"],
    },
    {
      label: "Contact",
      page: "contact",
      key: "contact1",
      layouts: ["contact1", "contact2"],
    },
  ],
  coaching: [
    { label: "MetaData", page: "metaData", key: "metaData1" },
    { label: "Hero", page: "hero", key: "hero1", layouts: ["hero1", "hero2"] },
    {
      label: "About",
      page: "about",
      key: "about1",
      layouts: ["about1", "about2"],
    },
    {
      label: "Principal",
      page: "principal",
      key: "principal1",
      layouts: ["principal1", "principal2"],
    },
    { label: "Faq", page: "faq", key: "faq1", layouts: ["faq1", "faq2"] },
    {
      label: "Curriculum",
      page: "curriculum",
      key: "curriculum1",
      layouts: ["curriculum1", "curriculum2"],
    },
    {
      label: "Testimonial",
      page: "testimonial",
      key: "testimonial1",
      layouts: ["testimonial1", "testimonial2"],
    },
    {
      label: "Contact",
      page: "contact",
      key: "contact1",
      layouts: ["contact1", "contact2"],
    },
  ],
  school: [
    { label: "MetaData", page: "metaData", key: "metaData1" },
    { label: "Hero", page: "hero", key: "hero1", layouts: ["hero1", "hero2"] },
    {
      label: "About",
      page: "about",
      key: "about1",
      layouts: ["about1", "about2"],
    },
    {
      label: "Principal",
      page: "principal",
      key: "principal1",
      layouts: ["principal1", "principal2"],
    },
    {
      label: "Teachers",
      page: "teachers",
      key: "teachers",
      layouts: ["teachers1", "teachers2"],
    },
    {
      label: "Toppers",
      page: "toppers",
      key: "toppers",
      layouts: ["toppers1", "toppers2"],
    },
    {
      label: "Curriculum",
      page: "curriculum",
      key: "curriculum1",
      layouts: ["curriculum1", "curriculum2"],
    },
    {
      label: "Testimonial",
      page: "testimonial",
      key: "testimonial1",
      layouts: ["testimonial1", "testimonial2"],
    },
    { label: "Faq", page: "faq", key: "faq1", layouts: ["faq1", "faq2"] },
    {
      label: "Contact",
      page: "contact",
      key: "contact1",
      layouts: ["contact1", "contact2"],
    },
    {
      label: "Map",
      page: "map",
      key: "map1",
      layouts: ["map1", "map2"],
    },
  ],
};

const WebsiteBuildingIndex = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [domainName, setDomainName] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    WebTemplateStore: { createWebTemplate },
    auth: { openNotification },
  } = store;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
  };

  const handleSectionChange = (section: {
    label: string;
    page: string;
    key: string;
    layouts?: string[];
  }) => {
    setSelectedSections((prev: any) => {
      const sectionExists = prev.some((s: any) => s.page === section.page);

      if (sectionExists) {
        return prev.filter((s: any) => s.page !== section.page);
      } else {
        return [...prev, section];
      }
    });
  };

  const handleDomainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDomainName(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedModel || selectedSections.length === 0 || !domainName) {
      toast({
        title: "Selection Incomplete",
        description:
          "Please select a model, at least one section, and enter a domain name before submitting.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    try {
      setIsLoading(true);
      const data = await createWebTemplate({
        sectionsLayout: selectedSections,
        webInfo: { metaData: { name: domainName } },
        webType: selectedModel,
        colorSetting: {},
      });
      setIsSubmitted(true);
      openNotification({
        title: "Successfully Created",
        message: `${data.message}`,
        type: "success",
      });
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        navigate(`${web.websiteCustomisation.index}/${domainName}`);
      }, 4000);
    } catch (err: any) {
      openNotification({
        title: "Error",
        message: err?.data?.message || "An error occurred",
        type: getStatusType(err.status),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderModelSelection = () => (
    <Fade in>
      <VStack
        spacing={8}
        align="stretch"
        bg="white"
        p={6}
        borderRadius="lg"
        boxShadow="xl"
      >
        <Heading as="h2" size="lg" color="teal.600" textAlign="center">
          Select Your Business Model
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {Object.keys(sectionOptions).map((model) => (
            <Card
              key={model}
              borderWidth={selectedModel === model ? "2px" : "1px"}
              borderColor={selectedModel === model ? "teal.500" : "gray.300"}
              p={4}
              borderRadius="md"
              cursor="pointer"
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "md",
                transition: "transform 0.2s",
              }}
              onClick={() => handleModelSelect(model)}
            >
              <VStack align="center" spacing={2}>
                <Text fontSize="lg" fontWeight="bold" color="teal.700">
                  {model.charAt(0).toUpperCase() + model.slice(1)}
                </Text>
                <Radio
                  value={model}
                  isChecked={selectedModel === model}
                  colorScheme="teal"
                  size="lg"
                  onChange={() => handleModelSelect(model)}
                />
              </VStack>
            </Card>
          ))}
        </SimpleGrid>
        <Button
          colorScheme="teal"
          onClick={() => setStep(2)}
          isDisabled={!selectedModel}
          width="full"
          boxShadow="md"
          _hover={{
            boxShadow: "lg",
            transform: "scale(1.05)",
            transition: "transform 0.2s",
          }}
        >
          Next
        </Button>
      </VStack>
    </Fade>
  );

  const renderSectionSelection = () => (
    <Fade in>
      <VStack
        spacing={3}
        align="stretch"
        bg="white"
        p={4}
        borderRadius="lg"
        boxShadow="xl"
      >
        <Heading as="h2" size="lg" color="teal.600" textAlign="center">
          Select Sections for{" "}
          {selectedModel
            ? selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)
            : ""}
        </Heading>
        <Text fontSize="sm" color="gray.600" textAlign="center">
          You have selected {selectedSections.length} out of{" "}
          {sectionOptions[selectedModel!]?.length} sections.
        </Text>
        <SimpleGrid
          maxH={"40vh"}
          overflowY="auto"
          columns={{ base: 1, md: 2 }}
          spacing={4}
        >
          {sectionOptions[selectedModel!]?.map((section: any) => (
            <Box
              key={section?.page}
              borderWidth={1}
              borderColor={
                selectedSections.some((s: any) => s.page === section.page)
                  ? "teal.400"
                  : "gray.300"
              }
              borderRadius="md"
              p={4}
              bg={
                selectedSections.some((s: any) => s.page === section.page)
                  ? "teal.50"
                  : "white"
              }
              _hover={{
                bg: "teal.100",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onClick={() => handleSectionChange(section)}
              position="relative"
              boxShadow="md"
            >
              <HStack>
                <Checkbox
                  isChecked={selectedSections.some(
                    (s: any) => s.page === section.page
                  )}
                  isReadOnly
                />
                <Text fontWeight="medium" fontSize="lg">
                  {section?.label?.charAt(0)?.toUpperCase() +
                    section.label?.slice(1)}
                </Text>
                <Tooltip
                  label={`Add a section for ${section?.label}`}
                  aria-label={`Add a section for ${section?.label}`}
                >
                  <InfoIcon boxSize={4} color="gray.500" />
                </Tooltip>
              </HStack>
              {selectedSections.some((s: any) => s.page === section.page) && (
                <Icon
                  as={CheckCircleIcon}
                  color="teal.500"
                  position="absolute"
                  top={2}
                  right={2}
                />
              )}
            </Box>
          ))}
        </SimpleGrid>
        <Input
          placeholder="Enter your domain name"
          value={domainName}
          onChange={handleDomainChange}
          isRequired
          variant="filled"
          mb={4}
          _focus={{ bg: "teal.50" }}
        />

        <HStack spacing={4}>
          <Button
            variant="outline"
            colorScheme="teal"
            onClick={() => {
              setSelectedSections([]);
              setStep(1);
            }}
            width="full"
            boxShadow="md"
            isDisabled={step === 1}
            _hover={{ boxShadow: "lg" }}
          >
            Back
          </Button>
          <Button
            colorScheme="teal"
            onClick={() => onOpen()}
            isDisabled={
              selectedSections.length === 0 || isLoading || !domainName
            }
            width="full"
            boxShadow="md"
            _hover={{
              boxShadow: "lg",
              transform: "scale(1.05)",
              transition: "transform 0.2s",
            }}
          >
            Save
          </Button>
        </HStack>
      </VStack>
    </Fade>
  );

  return (
    <Box overflow="hidden" p={3} minHeight="87vh">
      <Progress
        value={(step / 2) * 100}
        mb={6}
        colorScheme="teal"
        borderRadius="lg"
        height="8px"
      />

      <HStack spacing={4} justify="center" mb={2}>
        <Box w="25%" textAlign="center">
          <Text fontWeight="bold" color={step === 1 ? "teal.600" : "gray.400"}>
            Step 1
          </Text>
          <Text color={step === 1 ? "teal.600" : "gray.400"}>
            Model Selection
          </Text>
        </Box>
        <Box w="25%" textAlign="center">
          <Text fontWeight="bold" color={step === 2 ? "teal.600" : "gray.400"}>
            Step 2
          </Text>
          <Text color={step === 2 ? "teal.600" : "gray.400"}>
            Section Selection
          </Text>
        </Box>
      </HStack>
      {isSubmitted && (
        <Confetti
          style={{ zIndex: 9999999999999, width: "98%", height: "100%" }}
        />
      )}
      {step === 1 ? renderModelSelection() : renderSectionSelection()}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent
          ref={modalRef}
          bg="white"
          borderRadius="lg"
          boxShadow="lg"
          border="1px"
          borderColor="teal.300"
        >
          <ModalHeader
            fontSize={{ base: "xl", md: "2xl" }} // Responsive font size
            fontWeight="bold"
            textAlign="center"
            color="teal.600"
            bg="teal.50"
            p={4}
            borderTopRadius="lg"
          >
            <Icon as={CheckIcon} color="teal.500" w={8} h={8} />
            Confirm Your Submission
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center" py={6}>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.800" mb={4}>
              Please confirm your details before saving.
            </Text>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="semibold"
              color="teal.700"
              mt={2}
            >
              Domain name: <strong>{domainName}</strong>
            </Text>
            <Text fontSize={{ base: "md", md: "lg" }} color="teal.600" mt={4}>
              Selected Options:
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
              {" "}
              {/* Grid Layout */}
              {selectedSections.map((option: any, index) => (
                <Box
                  key={index}
                  fontSize={{ base: "md", md: "lg" }} // Ensure labels are prominent
                  color="gray.700"
                  p={4}
                  borderRadius="md"
                  border="1px"
                  borderColor="teal.200"
                  bg="teal.50"
                  boxShadow="sm"
                  transition="background 0.3s"
                  _hover={{
                    bg: "teal.100",
                    cursor: "pointer", // Change cursor to pointer on hover
                  }}
                >
                  <Text fontWeight="bold">{option.label}</Text>{" "}
                  {/* Display only the label */}
                </Box>
              ))}
            </SimpleGrid>
          </ModalBody>
          <ModalFooter
            justifyContent="end"
            px={8}
            py={6}
            borderTopWidth="1px"
            borderColor="teal.200"
          >
            <Flex justifyContent="end" gap={4}>
              <Button
                colorScheme="teal"
                onClick={handleSubmit}
                isLoading={isLoading}
                size="lg"
                boxShadow="md"
                px={6} // Added padding for a better click area
                _hover={{ bg: "teal.400" }} // Darker shade on hover
                _active={{ bg: "teal.500" }} // Slightly darker when active
              >
                Confirm and Save
              </Button>
              <Button
                colorScheme="gray"
                onClick={onClose}
                size="lg"
                boxShadow="md"
                px={6}
                _hover={{ bg: "gray.300" }}
                _active={{ bg: "gray.400" }}
              >
                Cancel
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default WebsiteBuildingIndex;