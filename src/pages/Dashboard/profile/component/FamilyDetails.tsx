import {
  Box,
  Text,
  Stack,
  Heading,
  Flex,
  useColorModeValue,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FaUser, FaPhone, FaAddressCard, FaBriefcase } from "react-icons/fa";
import CustomButton from "../../../../config/component/Button/CustomButton";

// Mapping icons to keys
const iconMap: any = {
  name: FaUser,
  relation: FaUser,
  dob: FaAddressCard,
  contactNo: FaPhone,
  aadharNo: FaAddressCard,
  occupation: FaBriefcase,
  pf_nomination: FaBriefcase,
  gratuity_nomination: FaBriefcase,
  esic_nomination: FaBriefcase,
  coveredMediclaim: FaBriefcase,
  coveredEsic: FaBriefcase,
  address: FaAddressCard,
};

const Relations = observer(({ relations, setSelectedTab, isEditable }: any) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const iconColor = useColorModeValue("teal.500", "teal.300");

  return (
    <Box
      w={"100%"}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      borderColor={cardBorder}
      boxShadow="lg"
      p={2}
    >
      <Flex
        p={{ base: 1, md: 3 }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading
          as="h2"
          size="lg"
          color={textColor}
          fontSize={{ base: "sm", md: "2xl" }}
        >
          Family Relations
        </Heading>
        {isEditable && (
          <CustomButton
            onClick={() =>
              setSelectedTab({ open: true, type: "family-details" })
            }
            btnText="Edit"
          />
        )}
      </Flex>
      <Divider />
      {relations?.length === 0 &&
      <Box mb={5} mt={9}>
      <Text textAlign="center" fontSize={"md"} fontWeight={500} cursor="pointer">
          No Family details Exists
        </Text>
      </Box>}
      <Stack spacing={2} width="100%" mb={2}>
        <Flex width="100%" justifyContent="space-between" wrap="wrap">
          {relations &&
            relations.map((relation: any, index: number) => (
              <Box
                key={index}
                w={"100%"}
                maxW="lg"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                bg={cardBg}
                borderColor={cardBorder}
                boxShadow="lg"
                p={6}
                m={2}
              >
                <Stack spacing={4}>
                  <Heading
                    as="h4"
                    size="md"
                    textAlign="center"
                    color={textColor}
                    mb={2}
                  >
                    {relation.name}
                  </Heading>
                  <Divider />
                  {Object.keys(relation).map((key) => {
                    // Skip rendering 'name' as it is already rendered as a heading
                    if (key === "name") return null;

                    const IconComponent = iconMap[key] || FaUser; // Default to FaUser if no specific icon is mapped
                    return (
                      <Flex align="center" key={key} mb={2}>
                        <Icon
                          as={IconComponent}
                          boxSize={5}
                          color={iconColor}
                          mr={3}
                        />
                        <Text fontSize="md" color={textColor}>
                          <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                          {relation[key]}
                        </Text>
                      </Flex>
                    );
                  })}
                </Stack>
              </Box>
            ))}
        </Flex>
      </Stack>
    </Box>
  );
});

export default Relations;
