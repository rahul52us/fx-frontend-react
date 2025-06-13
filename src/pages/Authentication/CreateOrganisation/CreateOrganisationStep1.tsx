import {
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Formik, Form } from "formik";
import CustomInput from "../../../config/component/CustomInput/CustomInput";
import { ForgotEmailValidation } from "../utils/validation";
import store from "../../../store/store";
import { authentication } from "../../../config/constant/routes";
import DashPageHeader from "../../../config/component/common/DashPageHeader/DashPageHeader";

const CreateOrganisationStep1 = observer(() => {
  const {
    auth: { openNotification },
    Organisation: { createOrganisationUser },
  } = store;
  const navigate = useNavigate();

  return (
    <>
      <DashPageHeader title="Create Organisation" showMainTitle={false} />
      <Flex
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        bg={useColorModeValue("gray.50", "gray.800")}
        minH="70vh"
        px={4}
      >
        <Box
          rounded="lg"
          flexDir="column"
          justifyContent="center"
          bg={useColorModeValue("white", "gray.700")}
          boxShadow="lg"
          p={6}
          maxW="md"
          w="full"
        >
          <Stack align="center" mb={8}>
            <Heading
              fontSize="2xl"
              textAlign="center"
              fontWeight="bold"
              color={useColorModeValue("blue.600", "blue.300")}
              mb={1}
            >
              Create Your Organisation
            </Heading>
            <Text
              fontSize="md"
              textAlign="center"
              color={useColorModeValue("gray.500", "gray.400")}
            >
              Access all our features by creating an organization here ✌️
            </Text>
          </Stack>
          <Formik
            initialValues={{ username: "", role: "superadmin" }}
            validationSchema={ForgotEmailValidation}
            onSubmit={(values, { setSubmitting }) => {
              values["role"] = "superadmin";
              createOrganisationUser(values)
                .then((data) => {
                  openNotification({
                    title: "Mail Sent Successfully",
                    message: data.message,
                    type: "success",
                  });
                  navigate("/");
                })
                .catch((err) => {
                  openNotification({
                    title: "Creation Failed",
                    message: err.message,
                    type: "error",
                  });
                })
                .finally(() => setSubmitting(false));
            }}
          >
            {({ handleSubmit, handleChange, values, isSubmitting, errors }) => (
              <Form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <CustomInput
                    type="text"
                    name="username"
                    label="Email"
                    placeholder="Enter your email"
                    required
                    value={values.username}
                    onChange={handleChange}
                    error={errors.username}
                  />

                  <Stack spacing={6} align="stretch">
                    <Stack
                      direction="row"
                      justify="space-between"
                      align="center"
                    >
                      <Checkbox colorScheme="blue">Remember me</Checkbox>
                    </Stack>
                    <Button
                      type="submit"
                      bg="blue.400"
                      color="white"
                      _hover={{ bg: "blue.500" }}
                      isLoading={isSubmitting}
                    >
                      Create Organisation
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
          <Stack pt={6} align="center">
            <Link
              fontSize="sm"
              color="blue.400"
              onClick={() => navigate(authentication.login)}
            >
              Already have an account? Sign in
            </Link>
          </Stack>
        </Box>
      </Flex>
    </>
  );
});

export default CreateOrganisationStep1;
