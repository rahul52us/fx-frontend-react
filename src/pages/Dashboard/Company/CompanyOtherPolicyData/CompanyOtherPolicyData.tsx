import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import CustomInput from "../../../../config/component/CustomInput/CustomInput";
import store from "../../../../store/store";
import { getStatusType } from "../../../../config/constant/statusCode";
import { useState } from "react";

interface CompanyPolicyI {
  gracePeriodMinutesEarly: number;
  gracePeriodMinutesLate: number;
}

const CompanyOtherPolicyData = observer(
  ({ initialValues, selectedPolicy, selectCompany }: any) => {
    const {
      company: { updatePolicy },
      auth: { openNotification, getPolicy },
    } = store;

    const policy = useState(selectedPolicy || getPolicy())[0];
    const selectedCompany = useState(
      selectCompany || store.auth.getCurrentCompany()
    )[0];

    return (
      <Box p={4}>
        <Formik<CompanyPolicyI>
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            values.gracePeriodMinutesEarly = Number(
              values.gracePeriodMinutesEarly
            );
            values.gracePeriodMinutesLate = Number(
              values.gracePeriodMinutesLate
            );
            updatePolicy({ ...values, policy, company: selectedCompany })
              .then((data: any) => {
                openNotification({
                  title: "Updated Successfully",
                  message: data?.message,
                  type: "success",
                });
              })
              .catch((err: any) => {
                openNotification({
                  title: "Update Failed",
                  message: err?.data?.message,
                  type: getStatusType(err.status),
                });
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
        >
          {({ handleChange, values, errors, isSubmitting }) => {
            return (
              <Form>
                <Flex gap={2} flexDirection={"column"}>
                  <CustomInput
                    name="gracePeriodMinutesEarly"
                    placeholder="Enter the Grace Period Minutes Late"
                    label="Grace Period Early Minutes"
                    required={true}
                    type="number"
                    onChange={handleChange}
                    value={values.gracePeriodMinutesEarly}
                    error={errors.gracePeriodMinutesEarly}
                  />
                  <CustomInput
                    name="gracePeriodMinutesLate"
                    placeholder="Enter the Grace Period Minutes Late"
                    label="Grace Period Late Minutes"
                    required={true}
                    onChange={handleChange}
                    type="number"
                    value={values.gracePeriodMinutesLate}
                    error={errors.gracePeriodMinutesLate}
                  />
                </Flex>
                <Divider />
                <Flex
                  justifyContent="flex-end"
                  p={4}
                  columnGap={3}
                  alignItems="center"
                >
                  <Button
                    isLoading={isSubmitting}
                    colorScheme="blue"
                    type="submit"
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

export default CompanyOtherPolicyData;