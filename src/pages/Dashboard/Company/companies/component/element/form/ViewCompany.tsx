import { observer } from "mobx-react-lite";
import DrawerLoader from "../../../../../../../config/component/Loader/DrawerLoader";
import {
  Box,
  Image,
  Text,
  Stack,
  Link,
  Heading,
  HStack,
  Icon,
  Divider,
  useColorModeValue,
  Flex,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  IconButton,
  Center,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaTelegram,
  FaLinkedin,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";
import store from "../../../../../../../store/store";
import { useEffect, useState } from "react";
import { getStatusType } from "../../../../../../../config/constant/statusCode";
import { EditIcon } from "@chakra-ui/icons";
import CustomDrawer from "../../../../../../../config/component/Drawer/CustomDrawer";
import PolicyCompany from "./CompanyPolicies";

const ViewCompany = observer(({ data, onClose }: any) => {
  const [policyData, setPolicyData] = useState<any>({});
  const [editDrawer, setEditDrawer] = useState({ open: false, data: data });
  const [loading, setLoading] = useState(true);

  const {
    company: { getIndividualPolicy },
    auth: { openNotification },
  } = store;

  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("teal.500", "teal.300");

  const createdAt = new Date(data.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    setLoading(true);
    getIndividualPolicy({ company: data._id, policy: data?.policy })
      .then((dt: any) => {
        setPolicyData(dt);
      })
      .catch((err: any) => {
        openNotification({
          type: getStatusType(err.status),
          title: "Failed to load data",
          message: err?.data?.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getIndividualPolicy, data._id, data?.policy, openNotification]);

  return (
    <>
      <DrawerLoader loading={false}>
        <Box
          p={{ base: 2, md: 6 }}
          shadow="lg"
          borderWidth="2px"
          borderRadius="lg"
          height="100%"
          bg={useColorModeValue("white", "gray.800")}
          position="relative" // Make sure the close button is positioned correctly
        >
          <Flex direction="column" align="center" mb={6}>
            <Image
              borderRadius="full"
              boxSize="120px"
              src={data?.logo?.url}
              alt={data?.logo?.name}
              mb={4}
            />
          </Flex>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading as="h2" size="lg" color={headingColor} textAlign="left">
              {data.company_name}
            </Heading>
            {/* Close button now at the end */}
          </Flex>
          <Stack spacing={4}>
            <Text fontSize="md" color={textColor} textAlign="left">
              {data.bio}
            </Text>
            <Divider />
            <Stack spacing={2} textAlign="left">
              <Text fontSize="md" color={textColor}>
                <Text as="span" fontWeight="bold">
                  Mobile:
                </Text>{" "}
                {data.mobileNo}
              </Text>
              <Text fontSize="md" color={textColor}>
                <Text as="span" fontWeight="bold">
                  Work:
                </Text>{" "}
                {data.workNo}
              </Text>
              {data.addressInfo?.length > 0 && (
                <Text fontSize="md" color={textColor}>
                  <Text as="span" fontWeight="bold">
                    Address:
                  </Text>{" "}
                  {data.addressInfo[0].address}, {data.addressInfo[0].city},{" "}
                  {data.addressInfo[0].state}, {data.addressInfo[0].country} -{" "}
                  {data.addressInfo[0].pinCode}
                </Text>
              )}
              <Text fontSize="md" color={textColor}>
                <Text as="span" fontWeight="bold">
                  Created At:
                </Text>{" "}
                {createdAt}
              </Text>
            </Stack>
            <Divider />
            <Flex justifyContent="space-between">
              <Box width="100%">
                <Tabs
                  variant="soft-rounded"
                  colorScheme="teal"
                  defaultIndex={0}
                >
                  <TabList mb="1em">
                    <Tab _selected={{ color: "white", bg: "teal.500" }}>
                      Holidays
                    </Tab>
                    <Tab _selected={{ color: "white", bg: "teal.500" }}>
                      Work Timings
                    </Tab>
                    <Tab _selected={{ color: "white", bg: "teal.500" }}>
                      Work Locations
                    </Tab>
                    <Tab _selected={{ color: "white", bg: "teal.500" }}>
                      Other
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      {loading ? (
                        <Flex align="center" justify="center" height="100%">
                          <Spinner size="xl" color="teal.500" />
                        </Flex>
                      ) : policyData?.holidays?.length ? (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          {policyData?.holidays?.map(
                            (holiday: any, index: number) => (
                              <Box
                                key={index}
                                p={4}
                                shadow="md"
                                borderWidth="1px"
                                borderRadius="md"
                                bg={useColorModeValue("gray.50", "gray.700")}
                              >
                                <Heading as="h4" size="sm" color={headingColor}>
                                  <Icon
                                    as={FaCalendarAlt}
                                    mr={2}
                                    color={headingColor}
                                  />
                                  {holiday.title}
                                </Heading>
                                <Text fontSize="sm" color={textColor}>
                                  {new Date(holiday.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                  {holiday.description}
                                </Text>
                              </Box>
                            )
                          )}
                        </SimpleGrid>
                      ) : (
                        <Center
                          width="100%"
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="md"
                          p={4}
                          bg="gray.50"
                        >
                          <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            No Holiday Records Available
                          </Text>
                        </Center>
                      )}
                    </TabPanel>
                    <TabPanel>
                      {loading ? (
                        <Flex align="center" justify="center" height="100%">
                          <Spinner size="xl" color="teal.500" />
                        </Flex>
                      ) : (
                        <List spacing={2}>
                          {policyData?.workTiming?.length ? (
                            policyData?.workTiming?.map((timing: any) => (
                              <ListItem
                                key={timing._id}
                                p={2}
                                bg={useColorModeValue("gray.50", "gray.700")}
                                borderRadius="md"
                              >
                                <ListIcon as={FaClock} color="green.500" />
                                {timing.startTime} - {timing.endTime} (
                                {timing.daysOfWeek.join(", ")})
                              </ListItem>
                            ))
                          ) : (
                            <Center
                              width="100%"
                              border="1px solid"
                              borderColor="gray.200"
                              borderRadius="md"
                              p={4}
                              bg="gray.50"
                            >
                              <Text
                                fontSize="lg"
                                fontWeight="semibold"
                                color="gray.600"
                              >
                                No Working Available
                              </Text>
                            </Center>
                          )}
                        </List>
                      )}
                    </TabPanel>
                    <TabPanel>
                      {loading ? (
                        <Flex align="center" justify="center" height="100%">
                          <Spinner size="xl" color="teal.500" />
                        </Flex>
                      ) : (
                        <List spacing={2}>
                          {policyData?.workLocations?.length ? (
                            policyData?.workLocations?.map((location: any) => (
                              <ListItem
                                key={location._id}
                                p={2}
                                bg={useColorModeValue("gray.50", "gray.700")}
                                borderRadius="md"
                              >
                                <ListIcon
                                  as={FaMapMarkerAlt}
                                  color="green.500"
                                />
                                {location.locationName} ({location.ipAddress})
                              </ListItem>
                            ))
                          ) : (
                            <Center
                              width="100%"
                              border="1px solid"
                              borderColor="gray.200"
                              borderRadius="md"
                              p={4}
                              bg="gray.50"
                            >
                              <Text
                                fontSize="lg"
                                fontWeight="semibold"
                                color="gray.600"
                              >
                                No WorkLocation Available
                              </Text>
                            </Center>
                          )}
                        </List>
                      )}
                    </TabPanel>
                    <TabPanel>
                      <Flex direction="column">
                        <Flex columnGap={4}>
                          <Text fontWeight={500} minW={200}>
                            Grace Period Early Minutes
                          </Text>{" "}
                          :{" "}
                          <Text fontWeight={400}>
                            {policyData?.gracePeriodMinutesEarly}
                          </Text>
                        </Flex>
                        <Flex columnGap={4}>
                          <Text fontWeight={500} minW={200}>
                            Grace Period Late Minutes
                          </Text>{" "}
                          :{" "}
                          <Text fontWeight={400}>
                            {policyData?.gracePeriodMinutesLate}
                          </Text>
                        </Flex>
                      </Flex>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
              <IconButton
                aria-label=""
                onClick={() => setEditDrawer({ open: true, data: data })}
              >
                <EditIcon />
              </IconButton>
            </Flex>
            <Divider />
            <HStack spacing={4} mt={4} justify="center">
              <Link href={data.facebookLink} isExternal>
                <Icon as={FaFacebook} boxSize={6} color="facebook.500" />
              </Link>
              <Link href={data.instagramLink} isExternal>
                <Icon as={FaInstagram} boxSize={6} color="pink.500" />
              </Link>
              <Link href={data.twitterLink} isExternal>
                <Icon as={FaTwitter} boxSize={6} color="twitter.500" />
              </Link>
              <Link href={data.githubLink} isExternal>
                <Icon as={FaGithub} boxSize={6} color="gray.700" />
              </Link>
              <Link href={data.telegramLink} isExternal>
                <Icon as={FaTelegram} boxSize={6} color="blue.500" />
              </Link>
              <Link href={data.linkedinLink} isExternal>
                <Icon as={FaLinkedin} boxSize={6} color="linkedin.500" />
              </Link>
            </HStack>
          </Stack>
          <IconButton
            aria-label="Close"
            icon={<FaTimes />}
            position="absolute"
            top={4}
            right={4}
            onClick={onClose}
            variant="ghost"
            size="lg"
          />
        </Box>
      </DrawerLoader>
      <CustomDrawer
        title="Policies"
        open={editDrawer.open}
        close={() => setEditDrawer({ open: false, data: null })}
        width="30%"
      >
        <PolicyCompany data={data} />
      </CustomDrawer>
    </>
  );
});

export default ViewCompany;
