import { observer } from "mobx-react-lite";
import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  useColorModeValue,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { CalendarIcon, StarIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  MdPerson,
  MdLocalActivity,
  MdAttachMoney,
  MdInfo,
} from "react-icons/md";
import { BiBriefcaseAlt } from "react-icons/bi";
import CustomButton from "../../../../config/component/Button/CustomButton";

// Define the type for experience details
interface ExperienceDetail {
  pastUserr?: string;
  startDate?: string;
  endDate?: string;
  relevantExperience?: string;
  designation?: string;
  jobProfile?: string;
  Lastctc?: string;
  leavingReason?: string;
  certificate?: {
    name: string;
    url: string;
    type: string;
  };
  _id: string;
}

// Define props type
interface WorkExperienceProps {
  experienceDetails: ExperienceDetail[];
  setSelectedTab: any;
  isEditable?: boolean;
}

// Key-to-Label mapping
const keyLabels: { [key: string]: string } = {
  pastUserr: "Past User",
  startDate: "Start Date",
  endDate: "End Date",
  relevantExperience: "Relevant Experience",
  designation: "Designation",
  jobProfile: "Job Profile",
  Lastctc: "Last CTC",
  leavingReason: "Leaving Reason",
  certificate: "Certificate",
};

// Key-to-Icon mapping
const keyIcons: { [key: string]: JSX.Element } = {
  pastUserr: <MdPerson />,
  startDate: <CalendarIcon />,
  endDate: <CalendarIcon />,
  relevantExperience: <StarIcon />,
  designation: <BiBriefcaseAlt />,
  jobProfile: <MdLocalActivity />,
  Lastctc: <MdAttachMoney />,
  leavingReason: <MdInfo />,
  certificate: <ExternalLinkIcon />,
};

const WorkExperience = observer(
  ({ experienceDetails, setSelectedTab, isEditable }: WorkExperienceProps) => {
    // Chakra UI color modes
    const textColor = useColorModeValue("gray.800", "gray.200");
    const cardBg = useColorModeValue("white", "gray.800");
    const cardBorder = useColorModeValue("gray.200", "gray.700");

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
          justifyContent="space-between"
          alignItems="center"
          p={{ base: 2, md: 4 }}
        >
          <Heading
            textAlign={"center"}
            fontSize={{ base: "sm", md: "2xl" }}
            fontWeight="bold"
          >
            Work Experience
          </Heading>
          {isEditable && (
            <CustomButton
              onClick={() =>
                setSelectedTab({ open: true, type: "work-experience" })
              }
              btnText="Edit"
            />
          )}
        </Flex>
        <Divider />

        {experienceDetails?.length === 0 && (
          <Box mb={5} mt={9}>
            <Text
              textAlign="center"
              fontSize={"md"}
              fontWeight={500}
              cursor="pointer"
            >
              No Document Exists
            </Text>
          </Box>
        )}
        {experienceDetails.map((experience) => (
          <Box
            key={experience._id}
            color={textColor}
            borderRadius="md"
            boxShadow="md"
            p={6}
            mb={6}
            borderWidth="1px"
            borderColor={cardBorder}
          >
            <VStack align="start" spacing={4}>
              {Object.keys(experience).map((key) => {
                if (key === "_id") return null; // Skip rendering the _id field

                const value: any = experience[key as keyof ExperienceDetail];
                const label = keyLabels[key] || key;
                const icon = keyIcons[key] || <MdInfo />;

                return (
                  <Flex
                    key={key}
                    align="center"
                    mb={2}
                    direction="row"
                    wrap="wrap"
                  >
                    {key === "certificate" && value ? (
                      <VStack align="start" spacing={2} w="full">
                        <Text fontWeight="bold" fontSize="lg">
                          {label}:
                        </Text>
                        <Image
                          src={value.url}
                          alt={value.name}
                          maxW="250px"
                          borderRadius="md"
                          boxShadow="md"
                        />
                      </VStack>
                    ) : (
                      value !== undefined &&
                      value !== null && (
                        <Flex align="center" mb={2} w="full">
                          {icon}
                          <Text
                            fontSize="md"
                            fontWeight="medium"
                            ml={3}
                            lineHeight="short"
                          >
                            <strong>{label}:</strong>{" "}
                            {key === "startDate" || key === "endDate"
                              ? new Date(value).toLocaleDateString()
                              : value}
                          </Text>
                        </Flex>
                      )
                    )}
                  </Flex>
                );
              })}
              <Divider borderColor={cardBorder} />
            </VStack>
          </Box>
        ))}
      </Box>
    );
  }
);

export default WorkExperience;
