import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import CustomInput from "../../../../../../config/component/CustomInput/CustomInput";
import { workLocationValidaion } from "../../utils/validation";

interface workLocationFormValues {
  locationName: string;
  ipAddress: string;
}

const WorkLocationForm = observer(
  ({ initialValues, showError, setShowError, close, handleSubmit }: any) => {
    return (
      <Box p={4}>
        <Formik<workLocationFormValues>
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            handleSubmit({ values, setSubmitting, resetForm });
          }}
          validationSchema={workLocationValidaion}
        >
          {({ handleChange, values , errors, isSubmitting }) => {
            return (
              <Form>
                <Flex gap={4} flexDirection={'column'}>
                  <CustomInput
                    name="locationName"
                    placeholder="Enter the Location"
                    label="Location"
                    required={true}
                    onChange={handleChange}
                    value={values.locationName}
                    error={errors.locationName}
                    showError={showError}
                  />
                  <CustomInput
                    name="ipAddress"
                    placeholder="Enter the Ip Address"
                    label="Ip Address"
                    required={true}
                    onChange={handleChange}
                    value={values.ipAddress}
                    error={errors.ipAddress}
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

export default WorkLocationForm;