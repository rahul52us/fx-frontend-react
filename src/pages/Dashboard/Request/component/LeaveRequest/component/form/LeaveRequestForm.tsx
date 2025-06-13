import { Box, Divider, Flex, Grid, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import CustomInput from "../../../../../../../config/component/CustomInput/CustomInput";
import store from "../../../../../../../store/store";
import { useEffect, useState } from "react";
import SubmitFormBtn from "../../../../../../../config/component/Button/SubmitFormBtn";
import { LeaveRequestValidation } from "../../utils/validation";
import { LeaveRequestI } from "../../utils/interface";
import { leavesTypes } from "../../utils/constant";

const LeaveRequestForm = observer(
  ({
    initialValues,
    showError,
    setShowError,
    close,
    handleSubmit,
    setRequestType,
    requestType,
  }: any) => {
    const [numberOfDays, setNumberOfDays] = useState<number | null>(null);
    const [managers, setManagers] = useState<any>({ loading: false, data: [] });
    const {
      auth: { user, openNotification },
      User: { getManagersOfUsers },
    } = store;

    useEffect(() => {
      getManagersOfUsers({
        page: 1,
        limit: 15,
        user: user._id,
      })
        .then((data: any) => {
          setManagers({ data: data[0]?.managers });
        })
        .catch((err: any) => {
          openNotification({
            type: "error",
            title: "Failed to get users",
            message: err?.message,
          });
        });
    }, [getManagersOfUsers, openNotification, user]);

    const UsersOptions = managers.data.map((item: any) => ({
      value: item?._id,
      label: item?.username,
    }));

    const WorkLocations =
      user?.companyDetail?.company?.policy?.workLocations?.map(
        (option: any) => ({
          label: option.locationName,
          value: option._id,
        })
      );

    const calculateNumberOfDays = (startDate: string, endDate: string) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const differenceInTime =
        end.getTime() - start.getTime() + 24 * 60 * 60 * 1000;
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      setNumberOfDays(Math.floor(differenceInDays));
    };

    return (
      <Box p={4}>
        <Formik<LeaveRequestI>
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            let val = { ...values, status: requestType };
            handleSubmit({ values: val, setSubmitting, resetForm });
          }}
          validationSchema={LeaveRequestValidation}
        >
          {({ handleChange, values, errors, isSubmitting, setFieldValue }) => {
            return (
              <Form>
                <Grid
                  gap={2}
                  gridTemplateColumns={{ sm: "1fr", md: "1fr 1fr" }}
                  flexDirection={"column"}
                >
                  <CustomInput
                    name="workingLocation"
                    type="select"
                    placeholder="Select The Work Location"
                    label="Work Location"
                    value={values.workingLocation}
                    error={errors.workingLocation}
                    onChange={(e) => {
                      setFieldValue("workingLocation", e);
                    }}
                    options={WorkLocations}
                    showError={showError}
                    required={true}
                  />
                  <CustomInput
                    name="sendTo"
                    type="select"
                    placeholder="Select The managers"
                    label="Managers"
                    value={values.sendTo}
                    error={errors.sendTo}
                    isMulti={true}
                    onChange={(e) => {
                      setFieldValue("sendTo", e);
                    }}
                    options={UsersOptions}
                    showError={showError}
                    required={true}
                  />
                  <CustomInput
                    name="leaveType"
                    type="select"
                    placeholder="Select The Leave Type"
                    label="Leave Type"
                    value={values.leaveType}
                    error={errors.leaveType}
                    onChange={(e) => {
                      setFieldValue("leaveType", e);
                    }}
                    options={leavesTypes}
                    showError={showError}
                    required={true}
                  />
                  <Box></Box>
                  <CustomInput
                    type="date"
                    name="startDate"
                    placeholder="Select the Start Date"
                    label="Start Date"
                    required={true}
                    onChange={(e) => {
                      console.log("the e is", e);
                      setFieldValue("startDate", e);
                      if (values.endDate) {
                        calculateNumberOfDays(e, values.endDate);
                      }
                    }}
                    value={values.startDate}
                    error={errors.startDate}
                    showError={showError}
                  />
                  <CustomInput
                    type="date"
                    name="endDate"
                    placeholder="Select the End Date"
                    label="End Date"
                    // minDate={values.startDate}
                    required={true}
                    onChange={(e) => {
                      setFieldValue("endDate", e);
                      if (values.startDate) {
                        calculateNumberOfDays(values.startDate, e);
                      }
                    }}
                    value={values.endDate}
                    error={errors.endDate}
                    showError={showError}
                  />
                </Grid>
                <Box mt={3} mb={2}>
                  <Text fontSize="sm" fontWeight="500">
                    No Of Days: {numberOfDays || 0}
                  </Text>
                </Box>
                <CustomInput
                  type="textarea"
                  name="reason"
                  placeholder="Reason"
                  label="Reason"
                  required={true}
                  onChange={handleChange}
                  value={values.reason}
                  error={errors.reason}
                  showError={showError}
                />
                <Divider />
                <Flex justifyContent="end" p={4} columnGap={3}>
                  <Flex columnGap={4}>
                    <SubmitFormBtn
                      cancelFunctionality={{
                        show: true,
                        onClick: () => close(),
                      }}
                      loading={isSubmitting}
                      type="submit"
                      onClick={() => {
                        setRequestType("submitted");
                        setShowError(true);
                      }}
                    />
                    <SubmitFormBtn
                      cancelFunctionality={{
                        show: false,
                        onClick: () => close(),
                      }}
                      loading={isSubmitting}
                      type="submit"
                      onClick={() => {
                        setRequestType("pending");
                        setShowError(true);
                      }}
                      buttonText="save"
                    />
                  </Flex>
                </Flex>
              </Form>
            );
          }}
        </Formik>
      </Box>
    );
  }
);

export default LeaveRequestForm;
