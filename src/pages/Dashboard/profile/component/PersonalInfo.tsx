import { observer } from "mobx-react-lite";
import {
  Box,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Divider,
  HStack,
  Grid,
  GridItem,
  Tooltip,
  Flex,
  Avatar,
} from "@chakra-ui/react";
import { CalendarIcon, InfoIcon, PhoneIcon, EmailIcon } from "@chakra-ui/icons";
import { MdLocationOn, MdAccountCircle, MdLanguage } from "react-icons/md";
import { BiIdCard } from "react-icons/bi";
import CustomButton from "../../../../config/component/Button/CustomButton";
import UserProfilePDF from "../../../../config/component/common/printUserProfile/PrintUserProfile";

interface PersonalDetail {
  _id: string;
  pic?: any;
  user: string;
  language: string[];
  addressInfo: {
    address: string;
    country: string;
    state: string;
    city: string;
    pinCode: string;
    _id: string;
  }[];
  aadharNo: string;
  bloodGroup: string;
  dob: string;
  emergencyNo: string;
  healthCardNo: string;
  insuranceCardNo: string;
  maritalStatus: string;
  medicalCertificationDetails: string;
  mobileNo: string;
  nickName: string;
  panNo: string;
  personalEmail: string;
  pfUanNo: string;
  refferedBy: string;
  weddingDate: string;
}

const keyLabels: { [key: string]: string } = {
  language: "Language",
  addressInfo: "Address Info",
  aadharNo: "Aadhar No",
  bloodGroup: "Blood Group",
  dob: "Date of Birth",
  emergencyNo: "Emergency No",
  healthCardNo: "Health Card No",
  insuranceCardNo: "Insurance Card No",
  maritalStatus: "Marital Status",
  medicalCertificationDetails: "Medical Certification Details",
  mobileNo: "Mobile No",
  nickName: "Nick Name",
  panNo: "PAN No",
  personalEmail: "Personal Email",
  pfUanNo: "PF UAN No",
  refferedBy: "Referred By",
  weddingDate: "Wedding Date",
};

const formatAddressInfo = (addresses: PersonalDetail["addressInfo"]) =>
  addresses.map((address, index) => (
    <Text key={index} fontSize="md" noOfLines={1}>
      {`${address.address}, ${address.city}, ${address.state}, ${address.country} - ${address.pinCode}`}
    </Text>
  ));

const formatValue = (key: string, value: any) => {
  if (key === "dob" || key === "weddingDate") {
    return new Date(value).toLocaleDateString();
  }
  return value.toString();
};

const keyIcons: { [key: string]: JSX.Element } = {
  language: <MdLanguage size="20px" />,
  addressInfo: <MdLocationOn size="20px" />,
  aadharNo: <BiIdCard size="20px" />,
  bloodGroup: <InfoIcon boxSize="20px" />,
  dob: <CalendarIcon boxSize="20px" />,
  emergencyNo: <PhoneIcon boxSize="20px" />,
  healthCardNo: <BiIdCard size="20px" />,
  insuranceCardNo: <BiIdCard size="20px" />,
  maritalStatus: <InfoIcon boxSize="20px" />,
  medicalCertificationDetails: <InfoIcon boxSize="20px" />,
  mobileNo: <PhoneIcon boxSize="20px" />,
  nickName: <MdAccountCircle size="20px" />,
  panNo: <BiIdCard size="20px" />,
  personalEmail: <EmailIcon boxSize="20px" />,
  pfUanNo: <BiIdCard size="20px" />,
  refferedBy: <MdAccountCircle size="20px" />,
  weddingDate: <CalendarIcon boxSize="20px" />,
};

const PersonalInfo = observer(
  ({
    personalDetails,
    setSelectedTab,
    isEditable
  }: {
    personalDetails: PersonalDetail[];
    setSelectedTab: any;
    isEditable?:Boolean
  }) => {
    const textColor = useColorModeValue("gray.800", "gray.200");
    const cardBg = useColorModeValue("white", "gray.800");
    const cardBorder = useColorModeValue("gray.200", "gray.700");

    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={cardBg}
        borderColor={cardBorder}
        boxShadow="lg"
      >
        <HStack justify="space-between" p={{ base: 2, md: 4 }}>
          <Heading fontSize={{ base: "sm", md: "2xl" }} fontWeight="bold" textAlign="center">
            Personal Details
          </Heading>
          <UserProfilePDF user={{...personalDetails[0],username : 'rahul52us@gmail.com', name : 'rahul kushwah'}}/>
          {isEditable && <CustomButton
            onClick={() =>
              setSelectedTab({ open: true, type: "profile-details" })
            }
            btnText="Edit"
          />}
        </HStack>
        <Divider />
        <Box p={3}>
          {personalDetails.map((detail, index: number) => (
            <Box
              key={detail._id}
              color={textColor}
              borderRadius="md"
              boxShadow="md"
              p={6}
              mb={6}
              borderWidth="1px"
              borderColor={cardBorder}
            >
              {index === 0 && (
                <Flex justifyContent="center" mb={5}>
                  <Avatar src={personalDetails?.length ? personalDetails[0]?.pic?.url : undefined} width={{ base: "120px", md: "160px" }} height={{ base: "120px", md: "160px" }} />
                </Flex>
              )}
              <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
                {Object.keys(detail).map((key) => {
                  if (['familyDetails', '_id', 'createdAt', 'companyOrg','qualifications', 'permissions', 'bankDetails', 'profileDetails', 'workExperience', 'is_active', 'user', '__v', 'pic', 'designation', 'password', 'companyDetail', 'profile_details', 'documents'].includes(key))
                    return null;

                  const value: any = detail[key as keyof PersonalDetail];
                  const label = keyLabels[key] || key;
                  const icon = keyIcons[key] || <InfoIcon boxSize="20px" />;

                  return (
                    <GridItem key={key}>
                      <HStack spacing={3} align="end" mb={3} alignItems="center">
                        <Tooltip label={label} aria-label={`${label} tooltip`}>
                          <Box cursor="pointer">{icon}</Box>
                        </Tooltip>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="md" fontWeight="medium">
                            {label}
                          </Text>
                          {Array.isArray(value) ? (
                            key === "addressInfo" ? (
                              formatAddressInfo(
                                value as PersonalDetail["addressInfo"]
                              )
                            ) : (
                              value.map((item, index) => (
                                <Text key={index} fontSize="md">
                                  {Array.isArray(item)
                                    ? item.join(", ")
                                    : item.toString()}
                                </Text>
                              ))
                            )
                          ) : (
                            <Text fontSize="md">{formatValue(key, value)}</Text>
                          )}
                        </VStack>
                      </HStack>
                    </GridItem>
                  );
                })}
              </Grid>
              <Divider borderColor={cardBorder} mt={4} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
);

export default PersonalInfo;
