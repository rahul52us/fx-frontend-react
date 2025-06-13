// Import necessary dependencies
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import store from "../../../../../../store/store";
import ShowData from "../component/ShowData";
// import userData from "./dummyUsereData.json";
// import CompanyDetails from "./component/CompanyDetails";
import DrawerLoader from "../../../../../../config/component/Loader/DrawerLoader";
import BankDetailsCard from "../component/common/BankDetailCard";
import WorkHistory from "./component/WorkHistory/WorkHistory";

const UserProfile: React.FC<any> = ({ UsereId }) => {
  const [user, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const {
    User: { getUsersDetailsById },
    auth: { openNotification },
  }: any = store;

  useEffect(() => {
    if (UsereId) {
      setLoading(true);
      getUsersDetailsById(UsereId)
        .then((details: any) => {
          setUserData(details);
        })
        .catch((error: any) => {
          console.error("Failed to fetch Usere details", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [UsereId, getUsersDetailsById, openNotification]);

  const Usere = {
    skills: ["React", "JavaScript", "TypeScript", "Node.js"],
    education: "Bachelor's in Computer Science",
    linkedin: "https://www.linkedin.com/in/johndoe",
    experience: "5 Years",
    profession: "Full Stack Developer",
  };

  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBgColor = useColorModeValue("gray.50", "gray.800");

  return (
    <DrawerLoader loading={loading}>
      <Box>
        <Box
          p={4}
          mb={3}
          bg={borderColor}
          borderTopLeftRadius={"xl"}
          position={"sticky"}
          top={"0"}
          zIndex={"10"}
        >
          <HStack spacing={6}>
            <Avatar
              name={user?.name}
              src={user?.pic?.url || undefined}
              boxSize={"85px"}
              size={"lg"}
            />
            <Box>
              <Heading fontSize={"2xl"} textTransform={"capitalize"}>
                {user?.title} {user?.name}
                <Tag colorScheme="green" variant={"outline"} ml={3} mt={1}>
                  Active
                </Tag>
              </Heading>
              {/* <Text fontWeight="semibold" color={"gray"}>
                {user?.designation?.join(", ")}
              </Text> */}
              {/* <Text fontSize={'sm'}>{user?.bio}</Text> */}
            </Box>
          </HStack>
        </Box>

        <Box px={4}>
          <Tabs
            index={tabIndex}
            onChange={(index) => setTabIndex(index)}
            variant={"soft-rounded"}
            size={"sm"}
          >
            <TabList gap={2}>
              <Tab> Details</Tab>
              <Tab> Personal</Tab>
              <Tab> Docs & Bank</Tab>
              <Tab>Company Details</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={2}>
                <Box
                  p={5}
                  borderWidth={1}
                  borderRadius={"md"}
                  borderColor={borderColor}
                >
                  <Text fontWeight={"bold"}>Basic Information</Text>
                  <Divider my={2} borderColor={borderColor} />
                  <Grid templateColumns={"1fr 1.5fr"} gap={4}>
                    <ShowData label="Name" value={user?.name} />
                    <ShowData label="Email" value={user?.username} />
                    <ShowData
                      label="Phone"
                      value={user?.profileDetails[0]?.mobileNo}
                    />
                    <ShowData label="Usere Code" value={user?.code} />
                    <ShowData
                      label="Languages"
                      type="multi"
                      value={user?.profileDetails[0]?.language}
                    />
                    {/* <ShowData
                      label="Designation"
                      value={user?.designation}
                      type="multi"
                    /> */}
                    <ShowData label="Employment Type" value={user?.role} />
                    <ShowData
                      label="Referred By"
                      value={user?.profileDetails[0]?.refferedBy}
                    />
                  </Grid>
                </Box>
                <Box
                  mt={2}
                  p={4}
                  borderWidth={1}
                  borderRadius={"md"}
                  borderColor={borderColor}
                >
                  <Text fontWeight={"bold"}>Professional Details</Text>
                  <Divider my={2} borderColor={borderColor} />
                  <Grid templateColumns={"2fr 3fr"} gap={4}>
                    <ShowData label="Profile" value={Usere?.profession} />
                    <ShowData label="Experience" value={Usere?.experience} />
                    <ShowData label="Education" value={Usere?.education} />
                    <Box>
                      <Text p={1} fontSize={"sm"} color={"gray"}>
                        Skills
                      </Text>
                      <Flex flexWrap={"wrap"} gap={2}>
                        {Usere.skills.map((skill) => (
                          <Tag
                            rounded={"full"}
                            key={skill}
                            colorScheme="telegram"
                          >
                            {" "}
                            {skill}
                          </Tag>
                        ))}
                      </Flex>
                    </Box>
                    <ShowData label="LinkedIn" value={Usere?.linkedin} />
                  </Grid>
                </Box>
              </TabPanel>
              <TabPanel p={2}>
                <Box
                  p={5}
                  borderWidth={1}
                  borderRadius={"md"}
                  borderColor={borderColor}
                >
                  <Text fontWeight={"bold"}>Personal Information</Text>
                  <Divider my={2} borderColor={borderColor} />
                  <Grid templateColumns={"2fr 3fr"} gap={4}>
                    {" "}
                    {user?.profileDetails?.map((detail: any) => (
                      <React.Fragment key={detail?._id}>
                        <ShowData label="Nickname" value={detail?.nickName} />
                        <ShowData
                          label="Personal Email"
                          value={detail?.personalEmail}
                        />
                        <ShowData
                          label="Date of Birth"
                          value={new Date(detail?.dob).toLocaleDateString()}
                        />
                        {/* <ShowData
                        label="Mobile Number"
                        value={detail?.mobileNo}
                      /> */}
                        <ShowData
                          label="Emergency Number"
                          value={detail?.emergencyNo}
                        />
                        <ShowData
                          label="Blood Group"
                          value={detail?.bloodGroup}
                        />
                        <ShowData label="PAN" value={detail?.panNo} />
                        <ShowData
                          label="Aadhaar Number"
                          value={detail?.aadharNo}
                        />
                        <ShowData
                          label="PF UAN Number"
                          value={detail?.pfUanNo}
                        />
                        <ShowData
                          label="Marital Status"
                          value={detail?.maritalStatus}
                        />
                        <ShowData
                          label="Insurance Card Number"
                          value={detail?.insuranceCardNo}
                        />
                        <ShowData
                          label="Health Card Number"
                          value={detail?.healthCardNo}
                        />
                        <ShowData
                          label="Wedding Date"
                          value={new Date(
                            detail?.weddingDate
                          ).toLocaleDateString()}
                        />
                        <ShowData
                          label="Medical Certification Details"
                          value={detail?.medicalCertificationDetails}
                        />
                      </React.Fragment>
                    ))}
                  </Grid>
                  <Box rounded={14} mt={6} shadow={"sm"}>
                    <Heading size="sm" mb={2}>
                      Address Info
                    </Heading>
                    <Divider my={2} borderColor={borderColor} />

                    <Grid templateColumns={"2fr 3fr"} gap={4}>
                      {user?.profileDetails[0]?.addressInfo?.map(
                        (address: any) => (
                          <React.Fragment key={address?._id}>
                            <ShowData
                              label="Address"
                              value={address?.address}
                            />
                            <ShowData
                              label="Country"
                              value={address?.country}
                            />
                            <ShowData label="State" value={address?.state} />
                            <ShowData label="City" value={address?.city} />
                            <ShowData
                              label="Pin Code"
                              value={address?.pinCode}
                            />
                          </React.Fragment>
                        )
                      )}
                    </Grid>
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box>
                  <SimpleGrid columns={[1, null, 1]} spacing={5}>
                    <Box
                      rounded={16}
                      shadow={"md"}
                      borderWidth={1}
                      borderColor={borderColor}
                      bg={cardBgColor}
                      p={5}
                    >
                      <BankDetailsCard
                        bankDetails={user?.bankDetails}
                        cardBgColor={cardBgColor}
                        borderColor={borderColor}
                      />
                    </Box>

                    {/* Documents */}
                    <Box>
                      <Heading color={"blue.600"} size="md">
                        Documents
                      </Heading>

                      {user?.documents && user?.documents?.length > 0 ? (
                        <Box>
                          {user?.documents.map((doc: any, index: number) =>
                            doc?.documents ? (
                              Object.keys(doc.documents).map((key) => (
                                <HStack
                                  key={`${doc?._id || index}-${key}`}
                                  spacing={4}
                                  alignItems="center"
                                  borderBottom="1px"
                                  borderColor={borderColor}
                                  py={2}
                                >
                                  <Icon
                                    as={FaFileAlt}
                                    boxSize={6}
                                    color="blue.500"
                                  />
                                  <VStack align="start" spacing={0}>
                                    <Text fontWeight="bold">{key}</Text>
                                    <Text>
                                      {doc?.documents[key]?.name ||
                                        "No name available"}
                                    </Text>
                                    {doc?.documents[key]?.url ? (
                                      <Text
                                        as="a"
                                        href={doc?.documents[key]?.url}
                                        color="blue.500"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        View Document
                                      </Text>
                                    ) : (
                                      <Text color="red.500">
                                        URL not available
                                      </Text>
                                    )}
                                  </VStack>
                                </HStack>
                              ))
                            ) : (
                              <Text key={index} color="red.500">
                               No documents found
                              </Text>
                            )
                          )}
                        </Box>
                      ) : (
                        <Text>No documents found</Text>
                      )}
                    </Box>
                  </SimpleGrid>
                </Box>
              </TabPanel>
              <TabPanel>
                {user && (
                  <WorkHistory user={user._id} workHistory={user?.companyDetail[0]?.details} />
                )}
                {/* <CompanyDetails data={user?.companyDetail[0]} /> */}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </DrawerLoader>
  );
};

export default UserProfile;
