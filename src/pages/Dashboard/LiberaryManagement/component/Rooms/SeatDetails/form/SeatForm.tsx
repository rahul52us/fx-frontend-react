import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  Divider,
  SimpleGrid,
  Grid,
  GridItem,
  Flex,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import store from "../../../../../../../store/store";
import { getStatusType } from "../../../../../../../config/constant/statusCode";
import CustomInput from "../../../../../../../config/component/CustomInput/CustomInput";
import SubmitFormBtn from "../../../../../../../config/component/Button/SubmitFormBtn";

// Define TypeScript interfaces for form values
interface FormValues {
  generationType: { label: string; value: string };
  startValue: string;
  seatCount: number;
  room: string;
  section: string;
}

interface Seat {
  seatNumber: string | number;
  room: string;
  section: string;
}

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  generationType: Yup.object().required("Generation type is required"),
  startValue: Yup.string().required("Start value is required"),
  seatCount: Yup.number()
    .required("Seat count is required")
    .min(1, "Must generate at least 1 seat"),
  room: Yup.string().required("Room is required"),
  section: Yup.string().required("Section is required"),
});

interface SeatFormProps {
  data: any;
  close : any
}

const SeatForm: React.FC<SeatFormProps> = ({ data,close }) => {
  const {
    bookLiberary: { createRoomSeat },
    auth: { openNotification },
  } = store;

  const [showError, setShowError] = useState(false);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [submitLoading, setSubmittingLoading] = useState(false);

  // Initialize initialValues with room and section from props
  const [initialValues, setInitialValues] = useState<FormValues>({
    generationType: { label: "Numeric", value: "numeric" },
    startValue: "",
    seatCount: 10,
    room: data.title || "",
    section: data.section || "",
  });

  useEffect(() => {
    setInitialValues((prevValues) => ({
      ...prevValues,
      room: data.title,
      section: data.section,
    }));
  }, [data.title, data.section]);

  const handleGenerateSeats = (values: FormValues) => {
    const { generationType, startValue, seatCount, room, section } = values;
    const generatedSeats: Seat[] = [];

    if (generationType.value === "numeric") {
      for (let i = 0; i < seatCount; i++) {
        generatedSeats.push({
          seatNumber: parseInt(startValue, 10) + i,
          room,
          section,
        });
      }
    } else if (generationType.value === "alphabetic") {
      const generateAlphabeticSequence = (
        start: string,
        count: number
      ): string[] => {
        const result: string[] = [];
        let current = start;

        for (let i = 0; i < count; i++) {
          result.push(current);
          current = incrementAlphabetic(current);
        }

        return result;
      };

      const incrementAlphabetic = (str: string): string => {
        let arr = str.split("");
        let i = arr.length - 1;

        while (i >= 0) {
          if (arr[i] === "Z") {
            arr[i] = "A";
            i--;
          } else {
            arr[i] = String.fromCharCode(arr[i].charCodeAt(0) + 1);
            break;
          }
        }

        if (i < 0) arr.unshift("A");

        return arr.join("");
      };

      const alphabeticSeats = generateAlphabeticSequence(startValue, seatCount);

      for (const seat of alphabeticSeats) {
        generatedSeats.push({
          seatNumber: seat,
          room,
          section,
        });
      }
    }

    setSeats(generatedSeats);
  };

  const handleCreateSeats = () => {
    setSubmittingLoading(true);
    createRoomSeat({
      room: data._id,
      seats: seats.map((seat: Seat) => ({ seatNumber: seat.seatNumber })),
    })
      .then((response: any) => {
        openNotification({
          title: "Successfully Created",
          message: response.message,
          type: "success",
        });
        setShowError(false);
      })
      .catch((error: any) => {
        openNotification({
          title: "Create Failed",
          message: error?.data?.message || "An error occurred",
          type: getStatusType(error.status),
        });
      })
      .finally(() => {
        setSubmittingLoading(false);
      });
  };

  return (
    <Box mt={2} p={6} borderWidth={1}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={(values) => handleGenerateSeats(values)}
      >
        {({ values, errors, handleChange, setFieldValue }) => (
          <Form>
            <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <GridItem colSpan={{base : 1, md : 2}}>
                <CustomInput
                  label="Seat Generation Type"
                  type="select"
                  name="generationType"
                  value={values.generationType}
                  options={[
                    { label: "Numeric", value: "numeric" },
                    { label: "Alphabetic", value: "alphabetic" },
                  ]}
                  onChange={(e: any) => setFieldValue("generationType", e)}
                />
              </GridItem>
              <CustomInput
                type="text"
                name="startValue"
                value={values.startValue}
                onChange={handleChange}
                placeholder={
                  values.generationType.value === "numeric"
                    ? "e.g. 1"
                    : "e.g. A"
                }
                label={`Start ${
                  values.generationType.value === "numeric"
                    ? "Number"
                    : "Letter"
                }`}
                error={errors.startValue}
                showError={showError}
              />

              <CustomInput
                type="number"
                label="Number of seats"
                name="seatCount"
                placeholder="Seat Counts"
                onChange={handleChange}
                value={values.seatCount}
                showError={showError}
                error={errors.seatCount}
              />

              <CustomInput
                type="text"
                name="room"
                value={values.room}
                onChange={handleChange}
                placeholder="Room"
                label="Room"
                error={errors.room}
                showError={showError}
              />
              <CustomInput
                label="Section"
                type="text"
                name="section"
                value={values.section}
                onChange={handleChange}
                placeholder="Section"
                error={errors.section}
                showError={showError}
              />
            </Grid>
            <Flex mt={3} justifyContent="space-between" gap={4}>
              <Button
                colorScheme="teal"
                size="lg"
                type="submit"
                onClick={() => setShowError(true)}
              >
                Generate Seats
              </Button>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => {
                  setShowError(true);
                  handleCreateSeats();
                }}
                isDisabled={seats.length === 0 || Object.keys(errors).length > 0}
                isLoading={submitLoading}
              >
                Create Seats
              </Button>
            </Flex>
            {seats.length > 0 && (
              <>
                <Divider my={4} />
                <Text fontWeight="bold" fontSize="lg" textAlign="center" mb={4}>
                  Preview Generated Seats
                </Text>
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3 }}
                  spacing={{ base: 4, md: 6 }}
                >
                  {seats.map((seat, index) => (
                    <Box
                      key={index}
                      p={4}
                      borderWidth={1}
                      borderRadius="md"
                      textAlign="center"
                      bg="white"
                      borderColor="gray.200"
                      boxShadow="md"
                      transition="transform 0.2s, box-shadow 0.2s"
                      _hover={{
                        transform: "scale(1.05)",
                        boxShadow: "lg",
                      }}
                    >
                      <Text fontSize="lg" fontWeight="bold" color="teal.600">
                        {seat.seatNumber}
                      </Text>
                      <Text fontSize="md" color="gray.600" mt={2}>
                        {seat.room}/{seat.section}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
                <SubmitFormBtn
                onClick={() => setShowError(true)}
                buttonText="Submit"
                loading={submitLoading}
                cancelFunctionality={{
                  show: true,
                  text: "Cancel",
                  onClick: close()
                }}
              />
              </>
            )}
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SeatForm;
