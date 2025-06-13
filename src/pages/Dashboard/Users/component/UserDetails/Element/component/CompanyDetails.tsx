import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Step,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FaBuilding, FaCalendarAlt, FaClock, FaUserTie } from "react-icons/fa";

const CompanyDetails = ({ data }: any) => {
  const currentDetails = data;
  const current = currentDetails?.details[0];

  const cardBg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  //   const sectionBg = useColorModeValue("gray.200", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const infoItems = [
    {
      icon: FaUserTie,
      label: "Department",
      value: current?.department,
    },
    {
      icon: FaBuilding,
      label: "Location",
      value: current?.workingLocation.join(", "),
    },
    {
      icon: FaClock,
      label: "Work Timing",
      value: current?.workTiming.join(", "),
    },
    {
      icon: FaCalendarAlt,
      label: "Date of Joining",
      value: new Date(current?.doj).toLocaleDateString(),
    },
    {
      icon: FaCalendarAlt,
      label: "Confirmation Date",
      value: new Date(current?.confirmationDate).toLocaleDateString(),
    },
  ];

  return (
    <Box>
      {/* Current Details Section */}
      <Card
        rounded={16}
        boxShadow="0 0 10px rgba(0,0,0,0.07)"
        borderWidth={1}
        borderColor={borderColor}
        bg={cardBg}
        mb={8}
      >
        <CardHeader pb={0}>
          <Heading color="blue.600" size="md">
            Company Details
          </Heading>
        </CardHeader>
        <CardBody pt={2}>
          <Grid templateColumns={"1fr 1fr"} gap={4}>
            {infoItems.map((item, index) => (
              <HStack
                key={index}
                spacing={4}
                alignItems="center"
                borderBottom="1px"
                borderColor={borderColor}
                py={2}
              >
                <Icon as={item.icon} boxSize={6} color="blue.500" />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" color={textColor}>
                    {item.label}
                  </Text>
                  <Text color={textColor}>{item.value}</Text>
                </VStack>
              </HStack>
            ))}
          </Grid>
          <Box py={2}>
            <Text fontWeight="bold" color={textColor}>
              Description
            </Text>
            <Text color={textColor}>{current?.description || "N/A"}</Text>
          </Box>
        </CardBody>
      </Card>

      {/* Work History Section */}
      <Box p="6" rounded="md" shadow="md">
        <Heading size="md" mb={4} color="blue.600">
          Work History
        </Heading>

        
        <Stepper index={0} orientation="vertical" gap={0} size="lg">
          {currentDetails?.workHistory.map((history: any, index: any) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepNumber />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <StepSeparator />
              <Flex
                direction="column"
                justifyContent="center"
                alignItems="center"
                mt={4}
                mb={8}
                position="relative"
                textAlign="left"
              >
                <Box
                  p={4}
                  bg={cardBg}
                  borderRadius="md"
                  shadow="md"
                  borderColor={borderColor}
                  borderWidth={1}
                  maxW="500px"
                >
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    mb={1}
                    color={textColor}
                  >
                    {history?.companyName}
                  </Text>
                  <Text color={textColor}>
                    <strong>Duration:</strong> {history?.duration}
                  </Text>
                  <Text color={textColor}>
                    <strong>Role:</strong> {history?.role}
                  </Text>
                </Box>
              </Flex>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  );
};

export default CompanyDetails;
