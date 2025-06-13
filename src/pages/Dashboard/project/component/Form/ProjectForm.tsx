import { useEffect, useState } from "react";
import { Box, Button, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import { FieldArray, Form, Formik } from "formik";
import { ProjectCreateValidation } from "../utils/validation";
import { observer } from "mobx-react-lite";
import store from "../../../../../store/store";
import SubmitFormBtn from "../../../../../config/component/Button/SubmitFormBtn";
import { ProjectFormValuesI } from "../utils/dto";
import { ProjectPrioties, projectStatus } from "../utils/constant";
import { generateProjectResponse } from "../utils/function";
import ShowFileUploadFile from "../../../../../config/component/common/ShowFileUploadFile/ShowFileUploadFile";
import { removeDataByIndex } from "../../../../../config/constant/function";
import NotFoundData from "../../../../../config/component/commonPages/NotFoundData";
import DrawerFormHeightContainer from "../../../../../config/component/Drawer/DrawerFormHeightContainer";

const ProjectForm = observer(
  ({ initialValuesOfProjects, handleSubmitForm, isEdit }: any) => {
    const [isSubmitting, setSubmitting] = useState(false)
    const [showError, setShowError] = useState(false);
    const {
      auth: { getCompanyUsers, openNotification },
      Project: { setOpenProjectDrawer },
    } = store;

    useEffect(() => {
      getCompanyUsers({ page: 1 })
        .then(() => {})
        .catch((err) => {
          openNotification({
            message: err?.message,
            title: "Fetch Users Failed",
            type: "err",
          });
        });
    }, [getCompanyUsers, openNotification]);

    const generateErrors = (
      errorType: any,
      errors: any,
      type: string,
      index: number
    ) => {
      if (errorType === "attachment") {
        const errorTypes = ["title"];
        if (errors.attach_files && errors.attach_files[index]) {
          const errorTypeIndex = errorTypes.indexOf(type);
          if (errorTypeIndex !== -1) {
            return errors.attach_files[index][errorTypes[errorTypeIndex]];
          }
        }
        return undefined;
      }
      if (errorType === "followers") {
        const errorTypes = ["user"];
        if (errors.followers && errors.followers[index]) {
          const errorTypeIndex = errorTypes.indexOf(type);
          if (errorTypeIndex !== -1) {
            return errors.followers[index][errorTypes[errorTypeIndex]];
          }
        }
        return undefined;
      }
      if (errorType === "team_members") {
        const errorTypes = ["user"];
        if (errors.team_members && errors.team_members[index]) {
          const errorTypeIndex = errorTypes.indexOf(type);
          if (errorTypeIndex !== -1) {
            return errors.team_members[index][errorTypes[errorTypeIndex]];
          }
        }
        return undefined;
      }
      if (errorType === "customers") {
        const errorTypes = ["user"];
        if (errors.customers && errors.customers[index]) {
          const errorTypeIndex = errorTypes.indexOf(type);
          if (errorTypeIndex !== -1) {
            return errors.customers[index][errorTypes[errorTypeIndex]];
          }
        }
        return undefined;
      }
      if (errorType === "project_manager") {
        const errorTypes = ["user"];
        if (errors.project_manager && errors.project_manager[index]) {
          const errorTypeIndex = errorTypes.indexOf(type);
          if (errorTypeIndex !== -1) {
            return errors.project_manager[index][errorTypes[errorTypeIndex]];
          }
        }
        return undefined;
      }
    };

    return (
      <div>
        <Formik
          initialValues={initialValuesOfProjects}
          validationSchema={ProjectCreateValidation}
          onSubmit={async(
            values: ProjectFormValuesI,
            { resetForm }
          ) => {
            const sendDataObject = await generateProjectResponse(values);
            handleSubmitForm({
              values: { ...values, ...sendDataObject },
              setSubmitting,
              resetForm,
            });
          }}
        >
          {({ handleChange, values, errors, setFieldValue }) => {
            console.log('the val are', values.deleteAttachments)
            console.log('the errors are', errors)

            return (
              <Form>
                <DrawerFormHeightContainer
                  rest={{ paddingRight: { base: "3px", md: "5px" } }}
                >
                  <Flex>
                    {values?.logo?.file?.length === 0 ? (
                      <CustomInput
                        type="file-drag"
                        name="logo"
                        value={values.logo}
                        isMulti={true}
                        accept="image/*"
                        onChange={(e: any) => {
                          setFieldValue("logo", {
                            ...values.logo,
                            file: e.target.files[0],
                            isAdd: 1,
                          });
                        }}
                        required={true}
                        showError={showError}
                        error={errors.logo}
                      />
                    ) : (
                      <Box mt={-5} width="100%">
                        <ShowFileUploadFile
                          files={values.logo?.file}
                          removeFile={(_: any) => {
                            setFieldValue("logo", {
                              ...values.logo,
                              file: removeDataByIndex(values.logo, 0),
                              isDeleted: 1,
                            });
                          }}
                          edit={isEdit}
                        />
                      </Box>
                    )}
                  </Flex>
                  <Box>
                    <Grid
                      gridTemplateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                      }}
                      gap={2}
                    >
                      <CustomInput
                        value={values.project_name}
                        name="project_name"
                        label="Project Name"
                        placeholder="Enter The project name"
                        required={true}
                        error={errors.project_name}
                        showError={showError}
                        onChange={handleChange}
                      />
                      <CustomInput
                        name="priority"
                        label="Priority"
                        value={values.priority}
                        required
                        placeholder="Select the Priority"
                        options={ProjectPrioties}
                        type="select"
                        onChange={(e: any) => {
                          setFieldValue("priority", e);
                        }}
                        error={errors.priority}
                        showError={showError}
                      />
                      <CustomInput
                        name="subtitle"
                        label="Sub Title"
                        placeholder="Write the subtitle"
                        value={values.subtitle}
                        error={errors.subtitle}
                        onChange={handleChange}
                        showError={showError}
                      />
                      <CustomInput
                        type="select"
                        name="status"
                        label="Status"
                        placeholder="Select the status"
                        value={values.status}
                        error={errors.status}
                        onChange={(e: any) => {
                          setFieldValue("status", e);
                        }}
                        options={projectStatus}
                        showError={showError}
                      />
                    </Grid>
                    <CustomInput
                      name="description"
                      label="Description"
                      placeholder="Write the Description"
                      type="textarea"
                      onChange={handleChange}
                      value={values.description}
                      error={errors.description}
                      showError={showError}
                    />
                    <GridItem>
                      <Grid
                        gridTemplateColumns={{
                          base: "repeat(1, 1fr)",
                          md: "repeat(2, 1fr)",
                          lg: "repeat(3, 1fr)",
                        }}
                        gap={2}
                      >
                        <CustomInput
                          name="tags"
                          type="tags"
                          label="Tags"
                          placeholder="Add a tag and press Enter"
                          value={values.tags}
                          onChange={(e) => {
                            setFieldValue("tags", e);
                          }}
                          showError={showError}
                        />
                      </Grid>
                    </GridItem>
                    <Grid
                      gridTemplateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                      }}
                      gap={2}
                    >
                      <CustomInput
                        value={values.startDate}
                        error={errors.startDate}
                        name="startDate"
                        label="Start Date"
                        onChange={(date: any) => {
                          setFieldValue("startDate", date ? date : "");
                        }}
                        placeholder="Select the Start Date"
                        type="date"
                        showError={showError}
                      />
                      <CustomInput
                        value={values.endDate}
                        name="endDate"
                        label="End Date"
                        onChange={(date: any) => {
                          setFieldValue("endDate", date ? date : "");
                        }}
                        minDate={values.startDate}
                        placeholder="Select the End Date"
                        type="date"
                        error={errors.endDate}
                        showError={showError}
                      />
                      <CustomInput
                        value={values.dueDate}
                        name="dueDate"
                        label="Due Date"
                        placeholder="Select the Due Date"
                        type="date"
                        onChange={(date: any) => {
                          setFieldValue("dueDate", date ? date : "");
                        }}
                        error={errors.dueDate}
                        showError={showError}
                        minDate={values.startDate}
                      />
                    </Grid>
                    <GridItem colSpan={{ base: 1, md: 4 }}>
                      <Box mt={5} mb={2}>
                        <Text fontWeight={"bold"}>Add Customer :- </Text>
                      </Box>
                      <FieldArray name="customers">
                        {({ push, remove }) => (
                          <>
                            {values.customers.length > 0 ? (
                              <Grid
                                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                                gap={4}
                                mb={4}
                              >
                                {values.customers.map(
                                  (user: any, index: number) => (
                                    <Box
                                      key={`customer-${index}-${user}`}
                                      p={4}
                                      borderWidth="1px"
                                      borderRadius="md"
                                      boxShadow="sm"
                                    >
                                      <Flex
                                        direction={{
                                          base: "column",
                                          md: "row",
                                        }}
                                        align="center"
                                        justify="space-between"
                                        gap={4}
                                      >
                                        <CustomInput
                                          name={`customers.${index}.user`}
                                          label="Customer"
                                          value={
                                            isEdit && user?.user
                                              ? {
                                                  label: user.user.username,
                                                  value: user.user._id,
                                                }
                                              : undefined
                                          }
                                          options={
                                            isEdit && user?.user
                                              ? [
                                                  {
                                                    label: user.user.username,
                                                    value: user.user._id,
                                                  },
                                                ]
                                              : []
                                          }
                                          placeholder="Select Customer"
                                          type="real-time-user-search"
                                          onChange={(selectedOption) => {
                                            setFieldValue(
                                              `customers.${index}.user`,
                                              selectedOption
                                            );
                                          }}
                                          isMulti={false}
                                          isSearchable
                                          showError={true}
                                          error={generateErrors(
                                            "customers",
                                            errors,
                                            "user",
                                            index
                                          )}
                                          rest={{ flex: 1 }}
                                        />
                                        <CustomInput
                                          type="checkbox"
                                          name={`customers.${index}.isActive`}
                                          label="Active"
                                          value={user.isActive}
                                          onChange={(e: any) => {
                                            setFieldValue(
                                              `customers.${index}.isActive`,
                                              e.target.checked
                                            );
                                          }}
                                          rest={{ flexShrink: 0 }}
                                        />
                                        <Button
                                          onClick={() => {
                                            remove(index);
                                          }}
                                          size="sm"
                                          colorScheme="red"
                                          variant="outline"
                                          flexShrink={0}
                                        >
                                          Delete
                                        </Button>
                                      </Flex>
                                    </Box>
                                  )
                                )}
                              </Grid>
                            ) : (
                              <Text
                                fontSize="md"
                                color="gray.500"
                                mb={4}
                                textAlign="center"
                                fontWeight="bold"
                              >
                                No Customer added yet.
                              </Text>
                            )}
                            <Button
                              mt={4}
                              width="100%"
                              onClick={() =>
                                push({
                                  user: undefined,
                                  isActive: true,
                                  isAdd: true
                                })
                              }
                              colorScheme="blue"
                            >
                              Add Customer
                            </Button>
                          </>
                        )}
                      </FieldArray>
                    </GridItem>
                    <GridItem colSpan={{ base: 1, md: 4 }}>
                      <Box mt={5} mb={2}>
                        <Text fontWeight={"bold"}>Add Project Manager :- </Text>
                      </Box>
                      <FieldArray name="project_manager">
                        {({ push, remove, form }) => (
                          <>
                            {form.values.project_manager.length > 0 ? (
                              <Grid
                                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                                gap={4}
                                mb={4}
                              >
                                {form.values.project_manager.map(
                                  (user: any, index: number) => {

                                    return(
                                    <Box
                                      key={`project-${index}`}
                                      p={4}
                                      borderWidth="1px"
                                      borderRadius="md"
                                      boxShadow="sm"
                                    >
                                      <Flex
                                        direction={{
                                          base: "column",
                                          md: "row",
                                        }}
                                        align="center"
                                        justify="space-between"
                                        gap={4}
                                      >
                                        <CustomInput
                                          name={`project_manager.${index}.user`}
                                          label="Members"
                                          value={
                                            isEdit && user?.user
                                              ? {
                                                  label: user.user.username,
                                                  value: user.user._id,
                                                }
                                              : undefined
                                          }
                                          options={
                                            isEdit && user?.user
                                              ? [
                                                  {
                                                    label: user.user.username,
                                                    value: user.user._id,
                                                  },
                                                ]
                                              : []
                                          }
                                          placeholder="Select Member"
                                          type="real-time-user-search"
                                          onChange={(selectedOption) => {
                                            form.setFieldValue(
                                              `project_manager.${index}.user`,
                                              selectedOption
                                            );
                                          }}
                                          isMulti={false}
                                          isSearchable
                                          showError={true}
                                          error={generateErrors(
                                            "project_manager",
                                            errors,
                                            "user",
                                            index
                                          )}
                                          // flex="1"
                                        />
                                        <CustomInput
                                          type="checkbox"
                                          name={`project_manager.${index}.isActive`}
                                          label="Active"
                                          value={user.isActive}
                                          onChange={(e: any) => {
                                            form.setFieldValue(
                                              `project_manager.${index}.isActive`,
                                              e.target.checked
                                            );
                                          }}
                                          // flexShrink={0}
                                        />

                                        <Button
                                          onClick={() => remove(index)}
                                          size="sm"
                                          colorScheme="red"
                                          variant="outline"
                                          flexShrink={0}
                                        >
                                          Delete
                                        </Button>
                                      </Flex>
                                    </Box>
                                  )}
                                )}
                              </Grid>
                            ) : (
                              <Text
                                fontSize="md"
                                color="gray.500"
                                mb={4}
                                textAlign="center"
                                fontWeight="bold"
                              >
                                No Manager added yet.
                              </Text>
                            )}
                            <Button
                              mt={4}
                              width="100%"
                              onClick={() =>
                                push({
                                  user: undefined,
                                  isActive: true,
                                  isAdd: true
                                })
                              }
                              colorScheme="blue"
                            >
                              Add Manager
                            </Button>
                          </>
                        )}
                      </FieldArray>
                    </GridItem>
                    <GridItem colSpan={{ base: 1, md: 4 }}>
                      <Box mt={5} mb={2}>
                        <Text fontWeight={"bold"}>Add Members :- </Text>
                      </Box>
                      <FieldArray name="team_members">
                        {({ push, remove }) => (
                          <Box>
                            {values.team_members.length > 0 ? (
                              <Grid
                                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                                gap={4}
                                mb={4}
                              >
                                {values.team_members.map(
                                  (user: any, index: number) => (
                                    <Box
                                      key={index}
                                      p={4}
                                      borderWidth="1px"
                                      borderRadius="md"
                                      boxShadow="sm"
                                    >
                                      <Flex
                                        direction={{
                                          base: "column",
                                          md: "row",
                                        }}
                                        align="center"
                                        justify="space-between"
                                        gap={4}
                                      >
                                        <CustomInput
                                          name={`team_members.${index}.user`}
                                          label="Members"
                                          value={
                                            isEdit && user?.user
                                              ? {
                                                  label: user.user.username,
                                                  value: user.user._id,
                                                }
                                              : undefined
                                          }
                                          options={
                                            isEdit && user?.user
                                              ? [
                                                  {
                                                    label: user.user.username,
                                                    value: user.user._id,
                                                  },
                                                ]
                                              : []
                                          }
                                          placeholder="Select Member"
                                          type="real-time-user-search"
                                          onChange={(selectedOption) => {
                                            setFieldValue(
                                              `team_members.${index}.user`,
                                              selectedOption
                                            );
                                          }}
                                          isMulti={false}
                                          isSearchable
                                          showError={showError}
                                          error={generateErrors(
                                            "team_members",
                                            errors,
                                            "user",
                                            index
                                          )}
                                          // flex="1"
                                        />
                                        <CustomInput
                                          type="checkbox"
                                          name={`team_members.${index}.isActive`}
                                          label="Active"
                                          value={user.isActive}
                                          onChange={(e: any) => {
                                            setFieldValue(
                                              `team_members.${index}.isActive`,
                                              e.target.checked
                                            );
                                          }}
                                          // flexShrink={0}
                                        />
                                        <Button
                                          onClick={() => remove(index)}
                                          size="sm"
                                          colorScheme="red"
                                          variant="outline"
                                          flexShrink={0}
                                        >
                                          Delete
                                        </Button>
                                      </Flex>
                                    </Box>
                                  )
                                )}
                              </Grid>
                            ) : (
                              <Text
                                fontSize="md"
                                color="gray.500"
                                mb={4}
                                textAlign="center"
                                fontWeight="bold"
                              >
                                No Team Manager added yet.
                              </Text>
                            )}
                            <Button
                              mt={4}
                              width="100%"
                              onClick={() =>
                                push({
                                  user: undefined,
                                  isActive: true,
                                  isAdd: true
                                })
                              }
                              colorScheme="blue"
                            >
                              Add Member
                            </Button>
                          </Box>
                        )}
                      </FieldArray>
                    </GridItem>
                    <GridItem colSpan={{ base: 1, md: 4 }}>
                      <Box mt={5} mb={2}>
                        <Text fontWeight={"bold"}>Add Followers :- </Text>
                      </Box>
                      <FieldArray name="followers">
                        {({ push, remove }) => (
                          <Box>
                            {values.followers.length > 0 ? (
                              <Grid
                                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                                gap={4}
                                mb={4}
                              >
                                {values.followers.map(
                                  (user: any, index: number) => {
                                    return (
                                      <Box
                                        key={`followers-${index}`}
                                        p={4}
                                        borderWidth="1px"
                                        borderRadius="md"
                                        boxShadow="sm"
                                      >
                                        <Flex
                                          direction={{
                                            base: "column",
                                            md: "row",
                                          }}
                                          align="center"
                                          justify="space-between"
                                          gap={4}
                                        >
                                          <CustomInput
                                            name={`followers.${index}.user`}
                                            label="Follower"
                                            value={
                                              isEdit && user?.user
                                                ? {
                                                    label: user.user.username,
                                                    value: user.user._id,
                                                  }
                                                : undefined
                                            }
                                            options={
                                              isEdit && user?.user
                                                ? [
                                                    {
                                                      label: user.user.username,
                                                      value: user.user._id,
                                                    },
                                                  ]
                                                : []
                                            }
                                            placeholder="Select Follower"
                                            type="real-time-user-search"
                                            onChange={(selectedOption) => {
                                              setFieldValue(
                                                `followers.${index}.user`,
                                                selectedOption
                                              );
                                            }}
                                            isMulti={false}
                                            isSearchable
                                            showError={showError}
                                            error={generateErrors(
                                              "followers",
                                              errors,
                                              "user",
                                              index
                                            )}
                                            // flex="1"
                                          />
                                          <CustomInput
                                            type="checkbox"
                                            name={`followers.${index}.isActive`}
                                            label="Active"
                                            value={user.isActive}
                                            onChange={(e: any) => {
                                              setFieldValue(
                                                `followers.${index}.isActive`,
                                                e.target.checked
                                              );
                                            }}
                                            // flexShrink={0}
                                          />
                                          <Button
                                            onClick={() => remove(index)}
                                            size="sm"
                                            colorScheme="red"
                                            variant="outline"
                                            flexShrink={0}
                                          >
                                            Delete
                                          </Button>
                                        </Flex>
                                      </Box>
                                    );
                                  }
                                )}
                              </Grid>
                            ) : (
                              <Text
                                fontSize="md"
                                color="gray.500"
                                mb={4}
                                textAlign="center"
                                fontWeight="bold"
                              >
                                No Followers added yet.
                              </Text>
                            )}
                            <Button
                              mt={4}
                              width="100%"
                              onClick={() =>
                                push({
                                  user: undefined,
                                  isActive: true,
                                  isAdd: true
                                })
                              }
                              colorScheme="blue"
                            >
                              Add Follower
                            </Button>
                          </Box>
                        )}
                      </FieldArray>
                    </GridItem>
                  </Box>
                  <Box>
                    <Box mt={5} mb={2}>
                      <Text fontWeight={"bold"}>Add Attachments :- </Text>
                    </Box>
                    <Box>
                      {values.attach_files?.length === 0 ? (
                        <Box>
                          <NotFoundData
                            title="No Attachment Are Found"
                            subTitle="Add New Attachment for the project description"
                            btnText="Add New Attachment"
                            onClick={() => {
                              setFieldValue("attach_files", [
                                {
                                  title: "",
                                  description: "",
                                  file: null,
                                  isAdd : 1
                                },
                              ]);
                            }}
                          />
                        </Box>
                      ) : (
                        <Grid columnGap={5} rowGap={3} mb={5}>
                          <FieldArray name="attach_files">
                            {({ push, remove }) => (
                              <Box>
                                {values.attach_files.map(
                                  (file: any, index: number) => {
                                    return (
                                      <Box key={index} mb="20px">
                                        <Grid
                                          gridTemplateColumns={{ md: "1fr" }}
                                          gap={2}
                                        >
                                          <Box width="100%">
                                            {file.file ? (
                                              <ShowFileUploadFile
                                                edit={isEdit}
                                                files={file.file[0]}
                                                removeFile={() => {
                                                  if(isEdit === true)
                                                  {
                                                    setFieldValue('deleteAttachments', [...values.deleteAttachments,file.file[0]?.name])
                                                  }
                                                  const updatedFiles =
                                                    values.attach_files.map(
                                                      (item: any, i: number) =>
                                                        i === index
                                                          ? {
                                                              ...item,
                                                              file: null,
                                                              isDeleted: 1,
                                                              isAdd: 0,
                                                              index : index
                                                            }
                                                          : item
                                                    );
                                                  setFieldValue(
                                                    "attach_files",
                                                    updatedFiles
                                                  );
                                                }}
                                                // Optionally, you can add functionality to remove files
                                              />
                                            ) : (
                                              <CustomInput
                                                name={`attach_files.${index}.file`}
                                                type="file-drag"
                                                placeholder="File"
                                                label="File"
                                                required
                                                showError={showError}
                                                onChange={(e: any) => {
                                                  setFieldValue(
                                                    `attach_files.${index}.file`,
                                                    e.target.files
                                                  );
                                                  setFieldValue(
                                                    `attach_files.${index}.isAdd`,
                                                    1
                                                  );
                                                }}
                                              />
                                            )}
                                          </Box>
                                          <CustomInput
                                            name={`attach_files.${index}.title`}
                                            type="text"
                                            placeholder="Title"
                                            label="Title"
                                            value={file.title}
                                            required
                                            showError={showError}
                                            onChange={handleChange}
                                            error={generateErrors(
                                              "attachment",
                                              errors,
                                              "title",
                                              index
                                            )}
                                          />
                                          <CustomInput
                                            name={`attach_files.${index}.description`}
                                            type="textarea"
                                            placeholder="Description"
                                            label="Description"
                                            value={file.description}
                                            showError={showError}
                                            onChange={handleChange}
                                          />
                                        </Grid>
                                        {values.attach_files.length && (
                                          <Button
                                            colorScheme="red"
                                            variant="outline"
                                            size="sm"
                                            mt="10px"
                                            onClick={
                                              () => {
                                                if(isEdit === true)
                                                  {
                                                    setFieldValue('deleteAttachments', [...values.deleteAttachments,file.file[0]?.name])
                                                  }
                                                remove(index)
                                              }
                                            }
                                          >
                                            Remove Section
                                          </Button>
                                        )}
                                      </Box>
                                    );
                                  }
                                )}
                                <Button
                                  colorScheme="blue"
                                  variant="outline"
                                  display="block"
                                  size="sm"
                                  mb="10px"
                                  mt={5}
                                  onClick={() =>
                                    push({
                                      title: "",
                                      description: "",
                                      file: null,
                                      isAdd:1
                                    })
                                  }
                                >
                                  Add Section
                                </Button>
                              </Box>
                            )}
                          </FieldArray>
                        </Grid>
                      )}
                    </Box>
                  </Box>
                </DrawerFormHeightContainer>
                <Flex justifyContent={"end"}>
                  <SubmitFormBtn
                    cancelFunctionality={{
                      show: true,
                      onClick: () => setOpenProjectDrawer("create"),
                    }}
                    onClick={() => setShowError(true)}
                    type="submit"
                    loading={isSubmitting}
                  />
                </Flex>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
);

export default ProjectForm;