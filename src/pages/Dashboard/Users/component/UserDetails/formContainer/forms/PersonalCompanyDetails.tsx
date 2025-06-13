import { useCallback, useEffect, useState } from "react";
import { Box, Divider, Grid, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import CustomInput from "../../../../../../../config/component/CustomInput/CustomInput";
import { observer } from "mobx-react-lite";
import store from "../../../../../../../store/store";
import { eTypeOption } from "../../utils/constant";
import SubmitFormBtn from "../../../../../../../config/component/Button/SubmitFormBtn";

const PersonalCompanyDetails = observer(
  ({ handleSubmitProfile, initialValues, validations }: any) => {
    const [formInitialValues, setFormInitialValues] = useState(initialValues);

    const {
      auth: { user, openNotification },
      DepartmentStore: {
        getAllDepartmentCategories,
        departmentCategories,
        getAllDepartment,
        departments,
      },
      User: { getAllUsersRoles, UsersRoles },
    } = store;
    const [showError, setShowError] = useState(false);

    useEffect(() => {
      getAllDepartmentCategories({})
        .then(() => {})
        .catch((err: any) => {
          openNotification({
            type: "error",
            title: "Failed to get Department Categories",
            message: err?.message,
          });
        });
    }, [getAllDepartmentCategories, openNotification]);

    const fetchDesignations = useCallback(
      (id: any) => {
        getAllDepartment(id, {})
          .then(() => {})
          .catch((err) => {
            openNotification({
              type: "error",
              title: "Failed to get Designations",
              message: err?.message,
            });
          });
      },
      [getAllDepartment, openNotification]
    );

    useEffect(() => {
      if (initialValues.department) {
        fetchDesignations(initialValues.department);
      }
    }, [fetchDesignations, initialValues.department]);


    useEffect(() => {
      getAllUsersRoles({ page: 1, limit: 15 })
        .then(() => {})
        .catch((err: any) => {
          openNotification({
            type: "error",
            title: "Failed to get users",
            message: err?.message,
          });
        });
    }, [getAllUsersRoles, openNotification]);

    useEffect(() => {
      const eTypes = eTypeOption.filter(
        (item: any) => item.value === initialValues.eType
      );
      const updatedInitialValues: any = { ...initialValues };

      updatedInitialValues.eType = eTypes.length ? eTypes[0] : eTypeOption[0];

      if (initialValues.managers?.length) {
        const tempManagers: any = [];
        UsersRoles.data.forEach((item: any) => {
          if (updatedInitialValues.managers.includes(item._id)) {
            tempManagers.push({
              label: item.username,
              value: item._id,
            });
          }
        });
        updatedInitialValues.managers = tempManagers;
      }

      if (initialValues.workTiming?.length) {
        const workTimings: any = [];
        user?.companyDetail?.company?.policy?.workTiming.forEach(
          (item: any) => {
            if (updatedInitialValues.workTiming.includes(item._id)) {
              workTimings.push({
                label: (
                  <div>
                    <div>{`${item.startTime} - ${item.endTime}`}</div>
                    <div>{`Days: ${item.daysOfWeek.join(", ")}`}</div>
                  </div>
                ),
                value: item._id,
              });
            }
          }
        );
        updatedInitialValues.workTiming = workTimings;
      }

      if (initialValues.workingLocation?.length) {
        const workingLocations: any = [];
        user?.companyDetail?.company?.policy?.workLocations?.forEach(
          (item: any) => {
            if (updatedInitialValues.workingLocation.includes(item._id)) {
              workingLocations.push({
                label: item.locationName,
                value: item._id,
              });
            }
          }
        );
        updatedInitialValues.workingLocation = workingLocations;
      }

      if (initialValues.department) {
        let depart: any = departmentCategories?.data.filter(
          (item: any) => item._id === initialValues.department
        );
        if (depart.length) {
          updatedInitialValues.department = {
            label: depart[0].title,
            value: initialValues.department,
          };
        }
      }

      if (initialValues.designation) {
        let depart: any = departments?.data.filter(
          (item: any) => item._id === initialValues.designation
        );
        if (depart.length) {
          updatedInitialValues.designation = {
            label: depart[0].title,
            value: depart[0]._id,
          };
        }
      }

      setFormInitialValues(updatedInitialValues);
    }, [
      initialValues,
      UsersRoles.data,
      departments.data,
      departmentCategories?.data,
      user?.companyDetail?.company?.policy?.workTiming,
      user?.companyDetail?.company?.policy?.workLocations,
    ]);

    interface CustomOptionProps {
      startTime: string;
      endTime: string;
      daysOfWeek: string[];
    }

    const CustomOption: React.FC<CustomOptionProps> = ({
      startTime,
      endTime,
      daysOfWeek,
    }) => (
      <div>
        <div>{`${startTime} - ${endTime}`}</div>
        <div>{`Days: ${daysOfWeek.join(", ")}`}</div>
      </div>
    );

    const WorkTimings = user?.companyDetail?.company?.policy?.workTiming?.map(
      (option: any) => ({
        label: (
          <CustomOption
            startTime={option.startTime}
            endTime={option.endTime}
            daysOfWeek={option.daysOfWeek}
          />
        ),
        value: option._id,
      })
    );

    const WorkLocations =
      user?.companyDetail?.company?.policy?.workLocations?.map(
        (option: any) => ({
          label: option.locationName,
          value: option._id,
        })
      );

    const DepartmentCategoriesOptions = departmentCategories?.data?.map(
      (option: any) => ({
        label: option.title,
        value: option._id,
      })
    );

    const DepartmentOptions = departments?.data?.map((option: any) => ({
      label: option.title,
      value: option._id,
    }));

    const UsersOptions = UsersRoles.data.map((item: any) => ({
      value: item?._id,
      label: item?.username,
    }));

    return (
      <Formik
        enableReinitialize={true}
        validationSchema={validations}
        initialValues={formInitialValues}
        onSubmit={(values, { setSubmitting, resetForm, setErrors }) => {
          handleSubmitProfile({
            values,
            setSubmitting,
            resetForm,
            setErrors,
            setShowError,
          });
        }}
      >
        {({
          values,
          errors,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          handleChange,
        }) => {
          return (
            <Form onSubmit={handleSubmit} style={{ height: "100%" }}>
              <Box p={4} borderRadius="lg" boxShadow="md" height="100%">
                <Grid>
                  <Heading color="#002058" fontSize="xl" mb={4}>
                    Company Details :-
                  </Heading>
                  <Divider />
                  <Grid
                    gridTemplateColumns={{ md: "1fr 1fr 1fr" }}
                    columnGap={4}
                    rowGap={2}
                    mb={5}
                  >
                    <CustomInput
                      type="date"
                      label="DOJ"
                      name="doj"
                      placeholder="Select Joining Date"
                      value={values.doj}
                      error={errors.doj}
                      showError={showError}
                      onChange={(e: any) => {
                        setFieldValue("doj", e);
                      }}
                      required={true}
                    />
                    <CustomInput
                      type="date"
                      label="Confirmation Date"
                      name="confirmationDate"
                      placeholder="Select Confirmation Date"
                      value={values.confirmationDate}
                      error={errors.confirmationDate}
                      showError={showError}
                      onChange={(e: any) => {
                        setFieldValue("confirmationDate", e);
                      }}
                      required={true}
                    />
                    <CustomInput
                      name="department"
                      type="select"
                      placeholder="Select The Department"
                      label="Department"
                      value={values.department}
                      error={errors.department}
                      onChange={(e) => {
                        setFieldValue("department", e);
                        setFieldValue("designation", null);
                        if (e) {
                          fetchDesignations(e.value);
                        }
                      }}
                      options={DepartmentCategoriesOptions}
                      showError={showError}
                      required={true}
                    />
                    <CustomInput
                      name="designation"
                      type="select"
                      placeholder="Select The Designation"
                      label="Designation"
                      value={values.designation}
                      error={errors.designation}
                      onChange={(e) => {
                        setFieldValue("designation", e);
                      }}
                      options={DepartmentOptions}
                      showError={showError}
                      required={true}
                    />
                    <CustomInput
                      name="workTiming"
                      type="select"
                      placeholder="Select The Work Timing"
                      label="Work Timing"
                      value={values.workTiming}
                      error={errors.workTiming}
                      onChange={(e) => {
                        setFieldValue("workTiming", e);
                      }}
                      options={WorkTimings}
                      showError={showError}
                      required={true}
                      isMulti={true}
                    />
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
                      isMulti={true}
                    />
                    <CustomInput
                      name="managers"
                      type="select"
                      placeholder="Select The managers"
                      label="Managers"
                      value={values.managers}
                      error={errors.managers}
                      isMulti={true}
                      onChange={(e) => {
                        setFieldValue("managers", e);
                      }}
                      options={UsersOptions}
                      showError={showError}
                      required={true}
                    />
                    <CustomInput
                      name="eType"
                      type="select"
                      placeholder="Select The E-Type"
                      label="E-Type"
                      value={values.eType}
                      error={errors.eType}
                      onChange={(e) => {
                        setFieldValue("eType", e);
                      }}
                      options={eTypeOption}
                      showError={showError}
                      required={true}
                    />
                  </Grid>
                  <CustomInput
                    name="description"
                    type="textarea"
                    placeholder="Description"
                    label="Description"
                    value={values.description}
                    error={errors.description}
                    onChange={handleChange}
                    showError={showError}
                  />
                </Grid>
                  <SubmitFormBtn
                    loading={isSubmitting}
                    onClick={() => {
                      setShowError(true);
                    }}
                  />
              </Box>
            </Form>
          );
        }}
      </Formik>
    );
  }
);

export default PersonalCompanyDetails;
