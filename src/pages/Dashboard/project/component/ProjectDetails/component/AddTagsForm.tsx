import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import CustomInput from "../../../../../../config/component/CustomInput/CustomInput";

const AddTagsForm = observer(
  ({ initialValues, showError, setShowError, close, handleSubmit }: any) => {
    return (
      <Box p={4}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            handleSubmit({ values, setSubmitting, resetForm });
            setShowError(false);
          }}
        >
          {({ values,  isSubmitting, setFieldValue } : any) => {
            return(
            <Form>
              <Flex gap={2} flexDirection={"column"}>
                <CustomInput
                  type="tags"
                  name="tags"
                  placeholder="Add Tags"
                  label="Add Tags"
                  required={true}
                  onChange={(e) => setFieldValue("tags", e)}
                  value={values.tags}
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
                >
                  Submit
                </Button>
              </Flex>
            </Form>
          )}}
        </Formik>
      </Box>
    );
  }
);

export default AddTagsForm;
