import { useState } from "react";
import { Box, Button, Divider, Grid, Heading } from "@chakra-ui/react";
import { FieldArray, Form, Formik } from "formik";
import CustomInput from "../../../../../../../config/component/CustomInput/CustomInput";
import ShowFileUploadFile from "../../../../../../../config/component/common/ShowFileUploadFile/ShowFileUploadFile";
import SubmitFormBtn from "../../../../../../../config/component/Button/SubmitFormBtn";

const PersonalDocuments = ({
  type,
  handleSubmitProfile,
  initialValues,
}: any) => {
  const [showError, setShowError] = useState(false);

  return (
    <Formik
      initialValues={initialValues}
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
        handleSubmit,
        isSubmitting,
        setFieldValue,
        values,
        handleChange,
      }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Box p={4} borderRadius="lg" boxShadow="md">
              <Grid>
                <Heading color="#002058" fontSize="xl" mb={4}>
                  Documents:-
                </Heading>
                <Divider />
                <Grid columnGap={5} rowGap={3} mb={5}>
                  <FieldArray name="documents">
                    {({ push, remove }) => (
                      <Box>
                        {values.documents.map((file: any, index: number) => {
                          return (
                            <Box key={index} mb="20px">
                              <Grid gridTemplateColumns={{ md: "1fr" }} gap={2}>
                              <CustomInput
                                  name={`documents.${index}.title`}
                                  type="text"
                                  placeholder="Title"
                                  label="Title"
                                  value={file.title}
                                  required
                                  showError={showError}
                                  onChange={handleChange}
                                />
                                <Box width="100%">
                                  {(file && file?.file && file?.file[0]) ? (
                                    <ShowFileUploadFile
                                      edit={type === "edit" ? true : false}
                                      files={file.file[0]}
                                      removeFile={() => {
                                        if (type === "edit") {
                                          setFieldValue("deleteAttachments", [
                                            ...values.deleteAttachments,
                                            file ? file.file[0]?.name : null,
                                          ]);
                                        }
                                        const updatedFiles =
                                          values.documents.map(
                                            (item: any, i: number) =>
                                              i === index
                                                ? {
                                                    ...item,
                                                    file: null,
                                                    isDeleted: 1,
                                                    isAdd: 0,
                                                    index: index,
                                                  }
                                                : item
                                          );
                                        setFieldValue(
                                          "documents",
                                          updatedFiles
                                        );
                                      }}
                                      // Optionally, you can add functionality to remove files
                                    />
                                  ) : (
                                    <CustomInput
                                      name={`documents.${index}.file`}
                                      type="file-drag"
                                      placeholder="File"
                                      label="File"
                                      required
                                      showError={showError}
                                      onChange={(e: any) => {
                                        setFieldValue(
                                          `documents.${index}.file`,
                                          e.target.files
                                        );
                                        setFieldValue(
                                          `documents.${index}.isAdd`,
                                          1
                                        );
                                      }}
                                    />
                                  )}
                                </Box>

                              </Grid>
                              {values.documents.length && (
                                <Button
                                  colorScheme="red"
                                  variant="outline"
                                  size="sm"
                                  mt="10px"
                                  onClick={() => {
                                    if (type === "edit") {
                                      setFieldValue("deleteAttachments", [
                                        ...values.deleteAttachments,
                                        file ? file.file[0]?.name : null,
                                      ]);
                                    }
                                    remove(index);
                                  }}
                                >
                                  Remove Document
                                </Button>
                              )}
                            </Box>
                          );
                        })}
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
                              isAdd: 1,
                            })
                          }
                        >
                          Add Document
                        </Button>
                      </Box>
                    )}
                  </FieldArray>
                </Grid>
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
};

export default PersonalDocuments;