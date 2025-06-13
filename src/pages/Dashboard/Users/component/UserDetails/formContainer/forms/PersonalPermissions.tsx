import { useState } from "react";
import {
  Box,
  Divider,
  Grid,
  Heading,
  Checkbox,
  FormLabel,
  useColorModeValue,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import SubmitFormBtn from "../../../../../../../config/component/Button/SubmitFormBtn";
import { transformPermissionsForDB } from "../../utils/function";
import { defaultPermissions } from "../../utils/constant";
import { formatCamelCaseLabel } from "../../../../../../../config/constant/function";

const PersonalPermissions = ({ handleSubmitProfile, initialValues }: any) => {
  const [, setShowError] = useState(false);

  const boxBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("#002058", "teal.300");
  const sectionHeadingColor = useColorModeValue("teal.500", "teal.200");
  const itemBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting, resetForm, setErrors }) => {
        handleSubmitProfile({
          values: {
            permissions: transformPermissionsForDB(values.permissions),
          },
          setSubmitting,
          resetForm,
          setErrors,
          setShowError,
        });
      }}
    >
      {({ values, handleChange, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Box
            maxHeight="77vh"
            display="flex"
            flexDirection="column"
            overflowY="auto"
          >
            <Box
              flex="1"
              p={6}
              borderRadius="md"
              boxShadow="sm"
              bg={boxBg}
              overflowY="auto"
            >
              <Heading
                color={headingColor}
                fontSize="2xl"
                mb={4}
                textAlign="center"
              >
                Permissions Management
              </Heading>
              <Divider mb={4} />
              {Object.keys(values.permissions).map((moduleKey) => (
                <Box key={moduleKey} mb={4}>
                  <Heading fontSize="lg" mb={4} color={sectionHeadingColor}>
                    {formatCamelCaseLabel(moduleKey)}
                  </Heading>
                  <Grid
                    gridTemplateColumns={{
                      sm: "1fr 1fr",
                      md: "1fr 1fr 1fr 1fr",
                    }}
                    gap={4}
                  >
                    {Object.keys(defaultPermissions[moduleKey]).map(
                      (permission) => (
                        <Box
                          key={permission}
                          borderWidth="1px"
                          borderRadius="md"
                          p={2}
                          boxShadow="sm"
                          bg={itemBg}
                        >
                          <FormLabel htmlFor={`${moduleKey}.${permission}`}>
                            {formatCamelCaseLabel(permission)}
                          </FormLabel>
                          <Checkbox
                            id={`${moduleKey}.${permission}`}
                            name={`permissions.${moduleKey}.${permission}`}
                            isChecked={
                              values.permissions[moduleKey][permission]
                            }
                            onChange={handleChange}
                            colorScheme="teal"
                          />
                        </Box>
                      )
                    )}
                  </Grid>
                </Box>
              ))}
            </Box>
            <SubmitFormBtn
              loading={isSubmitting}
              onClick={() => {
                setShowError(true);
              }}
            />
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default PersonalPermissions;
