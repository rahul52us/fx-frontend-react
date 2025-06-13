import {
  Box,
  Stack,
  Heading,
  Flex,
  useColorModeValue,
  Divider,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import CustomButton from "../../../../config/component/Button/CustomButton";

const SkillAndAddionalInfo = observer(({ setSelectedTab, isEditable }: any) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");

  return (
    <Flex width="100%">
      <Box
        w={"100%"}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={cardBg}
        borderColor={cardBorder}
        boxShadow="lg"
        p={6}
      >
        <Stack spacing={6}>
          <Flex justify="space-between" alignItems="center">
            <Heading
              as="h2"
              size="xl"
              textAlign="center"
              color={textColor}
              fontSize={{ base: "sm", md: "2xl" }}
            >
              Skill And Additional Info.
            </Heading>
            {isEditable && (
              <CustomButton
                onClick={() =>
                  setSelectedTab({ open: true, type: "skillAndAddionalInfo" })
                }
                btnText="Edit"
              />
            )}
          </Flex>
          <Divider />
          {true && (
              <Box mb={5} mt={5}>
                <Text
                  textAlign="center"
                  fontSize={"md"}
                  fontWeight={500}
                  cursor="pointer"
                >
                  No Skill And Additional Info are exists.
                </Text>
              </Box>
            )}
        </Stack>
      </Box>
    </Flex>
  );
});

export default SkillAndAddionalInfo;
