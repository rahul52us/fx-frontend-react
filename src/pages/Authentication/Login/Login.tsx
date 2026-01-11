import {
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Formik, Form, Field } from "formik";
import CustomInput from "../../../config/component/CustomInput/CustomInput";
import { LoginValidation } from "../utils/validation";
import store from "../../../store/store";
import { authentication } from "../../../config/constant/routes";
import {  useState } from "react";
import DashPageHeader from "../../../config/component/common/DashPageHeader/DashPageHeader";
import { primaryColor } from "../../../globalColors";
import {
  primaryButtonHoverStyle,
  primaryButtonStyle,
} from "../../../globalStyles";

const Login = observer(() => {
  const [showError, setShowError] = useState(false);
  const {
    auth: { openNotification, login },
  } = store;
  const navigate = useNavigate();




  return (
    <>
      <DashPageHeader title="Login" showMainTitle={false} />
      <Flex
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        minH="70vh"
        px={4}
      >
        <Box
          rounded="lg"
          flexDir="column"
          justifyContent="center"
          p={6}
          maxW="md"
          w="full"
        >
          <Stack align="center" mb={8}>
            <Heading fontSize="3xl" fontWeight="bold" mb={1}>
              Welcome Back
            </Heading>
            <Text fontSize="md" textAlign="center">
              Sign in to access all your personalized features and continue
              where you left off ✌️
            </Text>
          </Stack>
          <Formik
            initialValues={{
              username: "",
              password: "",
              remember_me: false,
            }}
            validationSchema={LoginValidation}
            onSubmit={(values, { setSubmitting }) => {
              login({ ...values, loginType: "username" })
                .then((data: any) => {
                      sessionStorage.setItem("justLoggedIn", "true"); // 👈 ADD THIS
                  openNotification({
                    title: "Login Success",
                    message: data.message,
                    type: "success",
                  });
                })
                .catch((error) => {
                  openNotification({
                    title: "Login Failed",
                    message: error.message,
                    type: "error",
                  });
                })
                .finally(() => {
                  setSubmitting(false);
                });
            }}
          >
            {({ handleSubmit, handleChange, errors, values, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <CustomInput
                    type="text"
                    name="username"
                    label="Email"
                    placeholder="Enter your email"
                    required
                    error={errors.username}
                    onChange={handleChange}
                    value={values.username}
                    showError={showError}
                  />
                  <CustomInput
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    required
                    error={errors.password}
                    onChange={handleChange}
                    value={values.password}
                    showError={showError}
                  />
                  <Stack spacing={6} align="stretch">
                    <Stack
                      direction="row"
                      justify="space-between"
                      align="center"
                    >
                      <Field
                        as={Checkbox}
                        name="remember_me"
                        colorScheme="blue"
                      >
                        Remember me
                      </Field>
                      <Link
                        color={primaryColor}
                        onClick={() => navigate(authentication.forgotPassword)}
                      >
                        Forgot password?
                      </Link>
                    </Stack>
                    <Button
                      type="submit"
                      {...primaryButtonStyle}
                      _hover={{...primaryButtonHoverStyle,border:"1px solid"}}
                      isLoading={isSubmitting}
                      onClick={() => setShowError(true)}
                    >
                      Sign In
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
          <Stack pt={6} align="center">
            <Text
              fontSize="sm"
              color={"black"}
            >
              Don’t have an account?{" "}
              <Link
                color={primaryColor}
                onClick={() => navigate(authentication.createOrganisationStep1)}
              >
                Register here
              </Link>
            </Text>
          </Stack>
        </Box>
      </Flex>
    </>
  );
});

export default Login;
