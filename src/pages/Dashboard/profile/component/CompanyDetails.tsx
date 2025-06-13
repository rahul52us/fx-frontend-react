import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { FaUserTie, FaBuilding, FaClipboardList } from "react-icons/fa";
import store from "../../../../store/store";
import CustomButton from "../../../../config/component/Button/CustomButton";

const CompanyDetails = observer(({ setSelectedTab, isEditable, userDetails }: any) => {
  const {
    User: { getUsersCompanyDetailsById },
  } = store;

  const [loading, setLoading] = useState(false);
  const [companyDetails, setCompanyDetails] = useState<any[]>([]);
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    if (userDetails?._id) {
      setLoading(true);
      getUsersCompanyDetailsById(userDetails._id)
        .then((data: any) => {
          setCompanyDetails(data || []);
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userDetails?._id,getUsersCompanyDetailsById]);

  const renderDetails = () => {
    if (companyDetails.length === 0) {
      return (
        <Box textAlign="center" my={5}>
          <Text fontSize="lg" fontWeight="medium">
            No Company Details Available
          </Text>
        </Box>
      );
    }

    return companyDetails.map((detail, index) => (
      <Box
        key={index}
        mb={6}
        p={5}
        borderWidth="1px"
        borderRadius="lg"
        bg={cardBg}
        borderColor={cardBorder}
        shadow="md"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">🏢 Details :- {index + 1}</Heading>
        </Flex>

        <Stack mt={4} spacing={4}>
          <Text>
            <b>Date of Joining:</b> {new Date(detail.details.doj).toLocaleDateString()}
          </Text>
          <Text>
            <b>Confirmation Date:</b>{" "}
            {new Date(detail.details.confirmationDate).toLocaleDateString()}
          </Text>
          <Text>
            <b>Type:</b> {detail.details.eType}
          </Text>
          <Text>
            <b>Description:</b> {detail.details.description}
          </Text>

          <Divider />

          <HStack spacing={4} alignItems="flex-start">
            <Icon as={FaUserTie} boxSize={5} color="teal.500" />
            <VStack align="start">
              <Heading size="sm">Managers</Heading>
              {detail.details.managersDetails.length > 0 ? (
                detail.details.managersDetails.map((manager: any, idx: number) => (
                  <Box key={idx}>
                    <Text>
                      <b>Name:</b> {manager.name} ({manager.title})
                    </Text>
                    <Text>
                      <b>Role:</b> {manager.role}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text>No managers available.</Text>
              )}
            </VStack>
          </HStack>

          <Divider />

          <HStack spacing={4} alignItems="flex-start">
            <Icon as={FaClipboardList} boxSize={5} color="blue.500" />
            <VStack align="start">
              <Heading size="sm">Designations</Heading>
              {detail.details.designationDetails.length > 0 ? (
                detail.details.designationDetails.map((designation: any, idx: number) => (
                  <Box key={idx}>
                    <Text>
                      <b>Title:</b> {designation.title}
                    </Text>
                    <Text>
                      <b>Code:</b> {designation.code}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text>No designation details available.</Text>
              )}
            </VStack>
          </HStack>

          <Divider />

          <HStack spacing={4} alignItems="flex-start">
            <Icon as={FaBuilding} boxSize={5} color="purple.500" />
            <VStack align="start">
              <Heading size="sm">Departments</Heading>
              {detail.details.departmentDetails.length > 0 ? (
                detail.details.departmentDetails.map((department: any, idx: number) => (
                  <Box key={idx}>
                    <Text>
                      <b>Title:</b> {department.title}
                    </Text>
                    <Text>
                      <b>Code:</b> {department.code}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text>No department details available.</Text>
              )}
            </VStack>
          </HStack>
        </Stack>
      </Box>
    ));
  };

  return (
    <Box
      w="100%"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      borderColor={cardBorder}
      boxShadow="lg"
      p={5}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Heading fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold">
          Company Details
        </Heading>
        {isEditable && (
            <CustomButton
            onClick={() => setSelectedTab({ open: true, type: "company-details" })}
              btnText="Edit"
            />
          )}
      </Flex>
      <Divider mb={4} />
      {loading ? (
        <Flex justifyContent="center" alignItems="center" minH="200px">
          <Spinner size="xl" label="Loading company details..." />
        </Flex>
      ) : (
        renderDetails()
      )}
    </Box>
  );
});

export default CompanyDetails;
