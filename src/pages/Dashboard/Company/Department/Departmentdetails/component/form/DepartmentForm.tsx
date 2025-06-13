import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { departmentValidation } from "../../utils/functions";
import CustomInput from "../../../../../../../config/component/CustomInput/CustomInput";

interface DepartmentI {
  title: string;
  code: string;
}

const CategoryForm = observer(
  ({ initialValues, showError, setShowError, close, handleSubmit }: any) => {
    return (
      <Box p={4}>
        <Formik<DepartmentI>
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            handleSubmit({ values, setSubmitting, resetForm });
          }}
          validationSchema={departmentValidation}
        >
          {({ handleChange, values, errors, isSubmitting }) => {
            return (
              <Form>
                <Flex gap={2} flexDirection={"column"}>
                  <CustomInput
                    name="title"
                    placeholder="Enter the Title"
                    label="Title"
                    required={true}
                    onChange={handleChange}
                    value={values.title}
                    error={errors.title}
                    showError={showError}
                  />
                  <CustomInput
                    name="code"
                    placeholder="Enter the Code"
                    label="Code"
                    required={true}
                    onChange={handleChange}
                    value={values.code}
                    error={errors.code}
                    showError={showError}
                  />
                </Flex>
                <Divider />
                <Flex
                  justifyContent="flex-end"
                  p={4}
                  columnGap={3}
                  alignItems="center"
                >
                  <Button variant="outline" onClick={close} colorScheme="gray">
                    Cancel
                  </Button>
                  <Button
                    isLoading={isSubmitting}
                    colorScheme="blue"
                    type="submit"
                    onClick={() => setShowError(true)}
                  >
                    Submit
                  </Button>
                </Flex>
              </Form>
            );
          }}
        </Formik>
      </Box>
    );
  }
);

export default CategoryForm;