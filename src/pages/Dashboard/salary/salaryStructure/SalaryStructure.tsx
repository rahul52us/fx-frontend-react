import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Divider,
  useColorModeValue,
  Icon,
  VStack,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  DrawerOverlay,
  Flex,
  Center,
  Image,
} from "@chakra-ui/react";
import { FaHistory } from "react-icons/fa";
import DashPageHeader from "../../../../config/component/common/DashPageHeader/DashPageHeader";
import { requestBreadCrumb } from "../../utils/breadcrumb.constant";
import store from "../../../../store/store";
import { getStatusType } from "../../../../config/constant/statusCode";
import SpinnerLoader from "../../../../config/component/Loader/SpinnerLoader";

const SalaryStructureView: React.FC = () => {
  const [fetchLoading, setFetchLoading] = useState<any>(true);
  const {
    User: { getSalaryDetailsStructure },
    auth: { user, openNotification },
  } = store;
  const [initialValues, setInitialValues] = useState<any>({});

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getSalaryStructure = useCallback(() => {
    setFetchLoading(true);
    getSalaryDetailsStructure({ user: user?._id })
      .then((data: any) => {
        console.log(data.data);
        if (data?.data?.currentSalaryStructure) {
          setInitialValues({
            ...data?.data?.currentSalaryStructure,
            effectiveFrom: new Date(
              data?.data?.currentSalaryStructure?.effectiveFrom
            ),
            disbursementFrom: new Date(
              data?.data?.currentSalaryStructure?.disbursementFrom
            ),
          });
        }
      })
      .catch((err) => {
        openNotification({
          title: "Update Failed",
          message: err?.data?.message,
          type: getStatusType(err.status),
        });
      })
      .finally(() => {
        setFetchLoading(false);
      });
  }, [user._id, openNotification, getSalaryDetailsStructure]);

  useEffect(() => {
    getSalaryStructure();
  }, [getSalaryStructure]);

  // Color schemes
  const tableHeaderBg = useColorModeValue("orange.400", "orange.600");
  const tableHeaderText = useColorModeValue("white", "gray.100");
  const tableBgHover = useColorModeValue("orange.100", "orange.700");
  const benefitTableHeaderBg = useColorModeValue("teal.400", "teal.600");
  const benefitTableBgHover = useColorModeValue("teal.100", "teal.700");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("blue.600", "blue.300");
  const inHandColor = useColorModeValue("green.600", "green.400");

  // Sample salary history data
  const salaryHistoryData = [
    {
      effectiveFrom: "2024-09-10T18:30:00.000Z",
      components: [
        {
          head: "Basic Salary",
          monthlyValue: 38000,
          yearlyValue: 456000,
          frequency: "Monthly",
        },
        {
          head: "HRA",
          monthlyValue: 18000,
          yearlyValue: 216000,
          frequency: "Monthly",
        },
      ],
      grossSalary: { monthly: 58000, yearly: 696000 },
      ctc: { monthly: 62000, yearly: 744000 },
    },
    {
      effectiveFrom: "2024-08-10T18:30:00.000Z",
      components: [
        {
          head: "Basic Salary",
          monthlyValue: 36000,
          yearlyValue: 432000,
          frequency: "Monthly",
        },
        {
          head: "HRA",
          monthlyValue: 17000,
          yearlyValue: 204000,
          frequency: "Monthly",
        },
      ],
      grossSalary: { monthly: 53000, yearly: 636000 },
      ctc: { monthly: 57000, yearly: 684000 },
    },
  ];

  return (
    <>
      <DashPageHeader title="Request" breadcrumb={requestBreadCrumb.index} />
      {fetchLoading === true ? (
        <Center mt={"32vh"}>
          <SpinnerLoader />
        </Center>
      ) : null}
      {fetchLoading === false && Object.keys(initialValues).length === 0 ? (
        <Center mt={"5vh"}>
            <Flex
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
              maxW={{base : "300", md : '500'}}
            >
              <Image
                src="/img/emptyData.jpg"
                alt=""
                width={{base : "180px", md : "400px"}}
                height={{base : "180px", md : "400px"}}
              />
              <Text
                fontSize={{base : 'sm', md : 'md'}}
                fontWeight="bold"
                cursor="pointer"
                color="blue.500"
                textAlign="center"
              >
                Oops! It seems like there’s no salary information available at
                the moment. Please check back later.
              </Text>
            </Flex>
        </Center>
      ) : null}
      <Box
        p={4}
        pt={5}
        border="1px solid #e2e8f0"
        borderRadius="md"
        boxShadow="lg"
        mx="auto"
        display={Object.keys(initialValues).length > 0 ? undefined : "none"}
        bg={useColorModeValue("white", "gray.800")}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          mb={{ base: 2, md: 0 }}
        >
          <Box flex="1" textAlign={{ base: "center", md: "left" }}>
            <Text
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              mb={2}
              color={useColorModeValue("gray.700", "gray.100")}
            >
              Salary Structure
            </Text>
            <Text fontSize={{ base: "md", md: "lg" }} mb={4}>
              Effective From:{" "}
              <Text as="span" color={textColor} fontWeight="bold">
                {new Date(initialValues?.effectiveFrom).toLocaleDateString()}
              </Text>{" "}
              &nbsp; Disbursement From:{" "}
              <Text as="span" color={textColor} fontWeight="bold">
                {new Date(initialValues?.disbursementFrom).toLocaleDateString()}
              </Text>
            </Text>
          </Box>

          <Button
            colorScheme="blue"
            mt={{ base: 4, md: 0 }} // Adjust top margin for mobile
            onClick={() => setIsDrawerOpen(true)}
            leftIcon={<Icon as={FaHistory} />}
          >
            View History
          </Button>
        </Flex>

        <Divider mb={4} />

        {/* Salary Structure Table */}
        <Table
          variant="striped"
          colorScheme="orange"
          border="1px solid #e2e8f0"
          size={"sm"}
        >
          <Thead bg={tableHeaderBg}>
            <Tr>
              <Th color={tableHeaderText}>Heads</Th>
              <Th color={tableHeaderText}>Monthly Value</Th>
              <Th color={tableHeaderText}>Yearly Value</Th>
              <Th color={tableHeaderText}>Frequency</Th>
            </Tr>
          </Thead>
          <Tbody>
            {initialValues?.salaryComponents &&
              initialValues?.salaryComponents.map(
                (item: any, index: number) => (
                  <Tr key={index} _hover={{ bg: tableBgHover }}>
                    <Td fontWeight="medium">{item.head}</Td>
                    <Td>₹{item.monthlyValue}</Td>
                    <Td>₹{item.yearlyValue}</Td>
                    <Td>{item.frequency}</Td>
                  </Tr>
                )
              )}
            <Tr
              fontWeight="bold"
              bg={useColorModeValue("gray.100", "gray.600")}
            >
              <Td>GROSS</Td>
              <Td>₹{initialValues?.grossSalary?.monthly}</Td>
              <Td>₹{initialValues?.grossSalary?.yearly}</Td>
              <Td></Td>
            </Tr>
          </Tbody>
        </Table>

        {/* Benefits Table */}
        <Table
          variant="striped"
          colorScheme="teal"
          border="1px solid #e2e8f0"
          mt={8}
          size={"sm"}
        >
          <Thead bg={benefitTableHeaderBg}>
            <Tr>
              <Th color={tableHeaderText}>Heads</Th>
              <Th color={tableHeaderText}>Monthly Value</Th>
              <Th color={tableHeaderText}>Yearly Value</Th>
              <Th color={tableHeaderText}>Frequency</Th>
            </Tr>
          </Thead>
          <Tbody>
            {initialValues?.benefits &&
              initialValues.benefits.map((item: any, index: number) => (
                <Tr key={index} _hover={{ bg: benefitTableBgHover }}>
                  <Td fontWeight="medium">{item.head}</Td>
                  <Td>₹{item.monthlyValue}</Td>
                  <Td>₹{item.yearlyValue}</Td>
                  <Td>{item.frequency}</Td>
                </Tr>
              ))}
            <Tr
              fontWeight="bold"
              bg={useColorModeValue("gray.100", "gray.600")}
            >
              <Td>CTC</Td>
              <Td>₹{initialValues?.ctc?.monthly}</Td>
              <Td>₹{initialValues?.ctc?.yearly}</Td>
              <Td></Td>
            </Tr>
          </Tbody>
        </Table>

        {/* Remarks Section */}
        <Box mt={2} p={3} bg={cardBg} borderRadius="md" boxShadow="inner">
          <VStack align="start">
            <Text
              fontSize="md"
              color={useColorModeValue("gray.600", "gray.300")}
            >
              Note: Excluding TDS
            </Text>
            <Text fontWeight="bold" fontSize="xl" mt={2}>
              In Hand Salary :{" "}
              <Text as="span" color={inHandColor} ml={4}>
                ₹{initialValues?.inHandSalary}
              </Text>
            </Text>
            <Flex columnGap={4} alignItems="center">
              <Text fontSize={"lg"} fontWeight="bold">
                Remarks :
              </Text>
              <Text
                fontSize="sm"
                color={useColorModeValue("gray.600", "gray.300")}
              >
                {initialValues?.remarks}
              </Text>
            </Flex>
          </VStack>
        </Box>

        {/* Drawer Button */}
      </Box>

      {/* Drawer for Salary History */}
      <Drawer
        size="xl"
        isOpen={isDrawerOpen}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontWeight="bold" fontSize="2xl" textAlign="center">
            Salary History
          </DrawerHeader>
          <DrawerBody>
            {salaryHistoryData.length > 0 ? (
              <Table variant="striped" colorScheme="teal">
                <Thead>
                  <Tr>
                    <Th>Effective From</Th>
                    <Th>Monthly Gross Salary</Th>
                    <Th>Yearly CTC</Th>
                    <Th>Details</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {salaryHistoryData.map((history, index) => (
                    <Tr key={index}>
                      <Td>
                        {new Date(history.effectiveFrom).toLocaleDateString()}
                      </Td>
                      <Td>₹{history.grossSalary.monthly}</Td>
                      <Td>₹{history.ctc.monthly}</Td>
                      <Td>
                        <Button
                          colorScheme="blue"
                          size="sm"
                          onClick={() => console.log("View details")}
                        >
                          View Details
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>No salary history available.</Text>
            )}
          </DrawerBody>
          <DrawerFooter>
            {" "}
            <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SalaryStructureView;
