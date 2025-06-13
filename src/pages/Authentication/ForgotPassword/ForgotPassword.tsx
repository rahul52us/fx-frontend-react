import {
  Stack,
  Link,
  Button,
  useColorModeValue,
  Flex,
  Heading,
  Text,
  Box,
} from "@chakra-ui/react";
import CustomInput from "../../../config/component/CustomInput/CustomInput";
import { Form, Formik } from "formik";
import { ForgotEmailValidation } from "../utils/validation";
import { authentication } from "../../../config/constant/routes";
import { useNavigate } from "react-router-dom";
import store from "../../../store/store";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import DashPageHeader from "../../../config/component/common/DashPageHeader/DashPageHeader";

const ForgotPassword = observer(() => {
  const [showError, setShowError] = useState(false);
  const {
    auth: { openNotification, forgotPasswordStore },
  } = store;
  const navigate = useNavigate();

  return (
    <>
      <DashPageHeader title="Forgot Password" showMainTitle={false}/>
      <Flex
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        minH="70vh"
        bg={useColorModeValue("gray.50", "gray.800")}
        px={4}
      >
        <Box
          rounded="lg"
          flexDir="column"
          justifyContent="center"
          bg={useColorModeValue("white", "gray.700")}
          boxShadow="xl"
          p={8}
          maxW="md"
          w="full"
        >
          <Stack align="center" mb={8}>
            <Heading
              textAlign="center"
              fontSize="2xl"
              fontWeight="bold"
              color={useColorModeValue("blue.600", "blue.300")}
              mb={2}
            >
              Forgot Your Password?
            </Heading>
            <Text
              fontSize="md"
              textAlign="center"
              color={useColorModeValue("gray.500", "gray.400")}
            >
              No worries! Enter your email below, and we'll send you
              instructions to reset your password.
            </Text>
          </Stack>
          <Formik
            initialValues={{ username: "" }}
            validationSchema={ForgotEmailValidation}
            onSubmit={(values, { setSubmitting }) => {
              forgotPasswordStore(values)
                .then((data) => {
                  openNotification({
                    title: "Mail Sent Successfully",
                    message: data,
                    type: "success",
                  });
                  navigate("/");
                })
                .catch((err) => {
                  openNotification({
                    title: "Request Failed",
                    message: err.message,
                    type: "error",
                  });
                })
                .finally(() => {
                  setSubmitting(false);
                });
            }}
          >
            {({ values, handleSubmit, handleChange, isSubmitting, errors }) => (
              <Form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <CustomInput
                    type="text"
                    name="username"
                    label="Email Address"
                    placeholder="Enter your email address"
                    required={true}
                    value={values.username}
                    onChange={handleChange}
                    error={errors.username}
                    showError={showError}
                  />
                  <Stack spacing={6} align="center">
                    <Link
                      color="blue.400"
                      fontSize="sm"
                      onClick={() => navigate(authentication.login)}
                    >
                      Remembered your password? Sign in
                    </Link>
                    <Button
                      type="submit"
                      bg="blue.500"
                      color="white"
                      _hover={{
                        bg: "blue.600",
                      }}
                      isLoading={isSubmitting}
                      onClick={() => setShowError(true)}
                      w="full"
                      py={6}
                      fontSize="lg"
                    >
                      Send Reset Link
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </>
  );
});

export default ForgotPassword;
