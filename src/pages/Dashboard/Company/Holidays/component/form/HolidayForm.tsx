import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import CustomInput from "../../../../../../config/component/CustomInput/CustomInput";
import { holidaysValidation } from "../../utils/validation";

interface HolidaysFormValues {
  title: string;
  description: string;
  date?: any;
}

const HolidayForm = observer(
  ({ initialValues, showError, setShowError, close, handleSubmit }: any) => {
    return (
      <Box p={4}>
        <Formik<HolidaysFormValues>
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            handleSubmit({ values, setSubmitting, resetForm });
          }}
          validationSchema={holidaysValidation}
        >
          {({ handleChange, values, setFieldValue, errors, isSubmitting }) => {
            return (
              <Form>
                <Flex gap={4} flexDirection={{ base: "column", sm: "row" }}>
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
                    label="Date"
                    value={values.date}
                    placeholder="please select the date"
                    required
                    name="date"
                    type="date"
                    onChange={(e) => setFieldValue("date", e)}
                  />
                </Flex>
                <CustomInput
                  name="description"
                  placeholder="Description"
                  label="Description"
                  type="textarea"
                  error={errors.description}
                  onChange={handleChange}
                  value={values.description}
                  rows={3}
                  showError={showError}
                />
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

export default HolidayForm;
