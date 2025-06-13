import { useState } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { FaPlus, FaTimes } from "react-icons/fa";
import CustomInput from "../../../../config/component/CustomInput/CustomInput";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import store from "../../../../store/store";
import { videosValidation } from "../utils/videos.validation";
import FormModel from "../../../../config/component/common/FormModel/FormModel";

interface VideoFormValues {
  title: string;
  videoType: any;
  videoLink: string;
  description: string;
  category?: string;
}

const VideoForm = observer(({ open, close, type, categoryId }: any) => {
  const [showError, setShowError] = useState(false);
  const {auth : {user}} = store
  const {
    VideoStore: { createVideo },
    auth: { openNotification },
  } = store;

  return (
    <FormModel
      isCentered={true}
      title={type === "add" ? "Add New Video" : "Edit Video"}
      open={open}
      close={close}
    >
      <Box p={4}>
        <Formik<VideoFormValues>
          initialValues={{
            title: "",
            videoLink: "",
            description: "",
            videoType: "",
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            values.category = categoryId;
            values.videoType = values.videoType.value;
            createVideo({...values,company:user.comanyDetail?.company})
              .then((data) => {
                openNotification({
                  title: "Create Successfully",
                  message: data?.message,
                  type: "success",
                });
                resetForm();
                close();
              })
              .catch((err) => [
                openNotification({
                  title: "Create Failed",
                  message: err?.message,
                  type: "error",
                }),
              ])
              .finally(() => {
                setSubmitting(false);
                setShowError(false);
              });
          }}
          validationSchema={videosValidation}
        >
          {({ handleChange, setFieldValue, values, errors, isSubmitting }) => {
            return (
              <Form>
                <Flex gap={4} flexDirection={{base : 'column', sm : 'row'}}>
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
                    label="Video Type"
                    required={true}
                    type="select"
                    name="videoType"
                    value={values.videoType}
                    error={errors.videoType}
                    options={[{ label: "Youtube", value: "youtube" }]}
                    onChange={(e: any) => setFieldValue("videoType", e)}
                    showError={showError}
                  />
                </Flex>
                <CustomInput
                  name="videoLink"
                  placeholder="Enter the Video Link"
                  label="Video Link"
                  required={true}
                  onChange={handleChange}
                  value={values.videoLink}
                  error={errors.videoLink}
                  showError={showError}
                />
                <CustomInput
                  name="description"
                  placeholder="Description"
                  label="Description"
                  type="textarea"
                  error={errors.description}
                  onChange={handleChange}
                  value={values.description}
                  rows={4}
                  showError={showError}
                  required
                />
                <Flex justifyContent="end" mt={5} mr={3} mb={2}>
                  <Button leftIcon={<FaTimes />} mr={2} onClick={close}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    leftIcon={<FaPlus />}
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    onClick={() => {
                      setShowError(true);
                    }}
                  >
                    Create
                  </Button>
                </Flex>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </FormModel>
  );
});

export default VideoForm;
