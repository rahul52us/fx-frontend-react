import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  VStack,
  Heading,
  Divider,
  Select,
  CheckboxGroup,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import store from "../../../../../store/store";
import { observer } from "mobx-react-lite";
import { timeOptions, weekOptions } from "../utils/constant";

interface Timing {
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  isDelete?: boolean;
  isAdd?:boolean;
  isEdit?:boolean;
  index?:number
}


const WorkTimingForm = observer(({selectedPolicy, selectCompany} : any) => {
  const {
    company: { updateWorkTiming, getWorkTiming, workTiming },
    auth: { openNotification, getPolicy },
  } = store;
  const selectedCompany = useState(selectCompany || store.auth.getCurrentCompany())[0]
  const policy = useState(selectedPolicy || getPolicy())[0]
  const [deleteLoading,setDeleteLoading] = useState(false)
  const [selectedTiming, setSelectedTiming] = useState<Timing | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getWorkTiming({ policy: policy, company : selectedCompany })
      .then(() => {
      })
      .catch((err: any) => {
        openNotification({
          type: "error",
          title: "Failed to get Timing",
          message: err?.data?.message,
        });
      });
  }, [getWorkTiming, openNotification, getPolicy, policy, selectedCompany]);

  const handleAddTiming = () => {
    setSelectedTiming({ startTime: "", endTime: "", daysOfWeek: [], isAdd: true });
    onOpen();
  };

  const handleEditTiming = (timing: Timing, index : number) => {
    setSelectedTiming({ ...timing, index : index, isEdit: true });
    onOpen();
  };

  const handleDeleteTiming = (timing: Timing, index : number) => {
    setSelectedTiming({ ...timing, index : index, isDelete: true });
    onOpen();
  };

  const handleUpdateTiming = (values: Timing, setSubmitting: (isSubmitting: boolean) => void) => {
    const updatedTiming = {
      ...selectedTiming,
      startTime: values.startTime,
      endTime: values.endTime,
      daysOfWeek: values.daysOfWeek,
    };

    updateWorkTiming({ ...updatedTiming, policy, company : selectedCompany })
      .then((data: any) => {
        openNotification({
          title: "Updated Successfully",
          message: data?.message,
          type: "success",
        });
        getWorkTiming({ policy, company : selectedCompany })
          .catch((err: any) => {
            openNotification({
              type: "error",
              title: "Failed to get Timing",
              message: err?.data?.message,
            });
          });
        onClose();
      })
      .catch((err: any) => {
        openNotification({
          title: "Update Failed",
          message: err?.data?.message,
          type: "error",
        });
      })
      .finally(() => setSubmitting(false));
  };

  const handleConfirmDelete = () => {
    if (!selectedTiming) return;
    setDeleteLoading(true)
    updateWorkTiming({ ...selectedTiming, isDelete: true, policy, company : selectedCompany })
      .then((data: any) => {
        openNotification({
          title: "Deleted Successfully",
          message: data?.message,
          type: "success",
        });
        getWorkTiming({ policy: policy })
          .then(() => {})
          .catch((err: any) => {
            openNotification({
              type: "error",
              title: "Failed to get Timing",
              message: err?.data?.message,
            });
          }).finally(() => {
            setDeleteLoading(false)
          });
        onClose();
      })
      .catch((err: any) => {
        openNotification({
          title: "Delete Failed",
          message: err?.data?.message,
          type: "error",
        });
      });
  };

  return (
    <Box p={6} maxW="100%">
      <Heading size="lg" mb={6} textAlign="center" color="teal.500">
        Work Timing Form
      </Heading>
      <Divider mb={6} />

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Start Time</Th>
            <Th>End Time</Th>
            <Th>Days of Week</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {workTiming.data.map((timing : any, index) => (
            <Tr key={index}>
              <Td>{timing.startTime}</Td>
              <Td>{timing.endTime}</Td>
              <Td>{timing.daysOfWeek.join(", ")}</Td>
              <Td>
                <Flex gap={2}>
                  <Button colorScheme="teal" onClick={() => handleEditTiming(timing,index)}>
                    Edit
                  </Button>
                  <IconButton
                    aria-label="Remove timing"
                    icon={<MinusIcon />}
                    onClick={() => handleDeleteTiming(timing, index)}
                    colorScheme="red"
                  />
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <VStack mt={6}>
        <Button
          onClick={handleAddTiming}
          leftIcon={<AddIcon />}
          colorScheme="teal"
          variant="outline"
        >
          Add Timing
        </Button>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedTiming?.isDelete ? "Confirm Delete" : selectedTiming ? "Edit Timing" : "Add Timing"}
          </ModalHeader>
          <ModalBody>
            {selectedTiming?.isDelete ? (
              <Box>Are you sure you want to delete this timing?</Box>
            ) : (
              <Formik
                initialValues={
                  selectedTiming || { startTime: "", endTime: "", daysOfWeek: [] }
                }
                validationSchema={Yup.object({
                  startTime: Yup.string().required("Required"),
                  endTime: Yup.string().required("Required"),
                  daysOfWeek: Yup.array().min(1, "Select at least one day"),
                })}
                enableReinitialize
                onSubmit={(values, { setSubmitting }: FormikHelpers<Timing>) => {
                  handleUpdateTiming(values, setSubmitting);
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                      <Field
                        as={Select}
                        name="startTime"
                        value={values.startTime}
                        onChange={handleChange}
                      >
                        {timeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                      {errors.startTime && touched.startTime && (
                        <Box color="red.500" fontSize="sm">
                          {errors.startTime}
                        </Box>
                      )}

                      <Field
                        as={Select}
                        name="endTime"
                        value={values.endTime}
                        onChange={handleChange}
                      >
                        {timeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                      {errors.endTime && touched.endTime && (
                        <Box color="red.500" fontSize="sm">
                          {errors.endTime}
                        </Box>
                      )}

                      <CheckboxGroup
                        value={values.daysOfWeek}
                        onChange={(value) =>
                          handleChange({ target: { name: "daysOfWeek", value } })
                        }
                      >
                        {weekOptions.map((option) => (
                          <Checkbox key={option.value} value={option.value}>
                            {option.label}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                      {errors.daysOfWeek && touched.daysOfWeek && (
                        <Box color="red.500" fontSize="sm">
                          {errors.daysOfWeek}
                        </Box>
                      )}
                    </VStack>
                    <ModalFooter mt={4}>
                      <Button
                        colorScheme="teal"
                        type="submit"
                        isLoading={isSubmitting}
                        mr={3}
                      >
                        Save
                      </Button>
                      <Button variant="ghost" onClick={onClose}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Form>
                )}
              </Formik>
            )}
          </ModalBody>
          {selectedTiming?.isDelete && (
            <ModalFooter>
              <Button colorScheme="red" onClick={handleConfirmDelete} isLoading={deleteLoading}>
                Delete
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
});

export default WorkTimingForm;
