import { Checkbox, FormControl, Grid } from "@chakra-ui/react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import CustomInput from "../../../../../../../config/component/CustomInput/CustomInput";
import DrawerFormHeightContainer from "../../../../../../../config/component/Drawer/DrawerFormHeightContainer";
import { useEffect, useState } from "react";
import store from "../../../../../../../store/store";
import { getStatusType } from "../../../../../../../config/constant/statusCode";
import { observer } from "mobx-react-lite";
import SubmitFormBtn from "../../../../../../../config/component/Button/SubmitFormBtn";

// Define the schema for validation
const validationSchema = Yup.object({
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date().required("End date is required"),
  user: Yup.mixed().required("Select the User"),
  room: Yup.object().required("Select the Room"),
  seat: Yup.object().required("Select the Seat"),
  startTime: Yup.string()
    .test("time-required", "Start time is required", function (value) {
      const { fullDay } = this.parent;
      if (!fullDay && !value) {
        return false;
      }
      return true;
    })
    .matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
    .notRequired(),
  endTime: Yup.string()
    .test("time-required", "End time is required", function (value) {
      const { fullDay } = this.parent;
      if (!fullDay && !value) {
        return false;
      }
      return true;
    })
    .matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
    .notRequired(),
  fullDay: Yup.boolean(),
  status: Yup.object(),
});

// Define initial values
const defaultInitialValues = {
  user: undefined,
  room: undefined,
  company: "",
  seat: undefined,
  startDate: new Date(),
  endDate: new Date(),
  startTime: "",
  endTime: "",
  fullDay: false,
  status: { value: "active", label: "Active" },
};

const ReserveSeatForm = observer(({ user, room, close }: any) => {
  const [roomSeatDatas, setRoomSeatDatas] = useState<any>([]);
  const userOptions = useState<any>(
    user ? [{ label: user.username, value: user._id }] : []
  )[0];
  const [initialValues, setInitialValues] = useState(defaultInitialValues);
  const [selectedRoom, setSelectedRoom] = useState<any>(room || null);
  const {
    bookLiberary: {
      createReserveRoomSeat,
      getAllSeatRooms,
      getAllDropdownRooms,
    },
    auth: { openNotification },
  } = store;
  const [roomOptions, setRoomOptions] = useState<any>([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (selectedRoom) {
      setInitialValues((prev: any) => ({
        ...prev,
        room: { title: selectedRoom.title, _id: selectedRoom._id },
      }));
      if (!user) {
        setRoomOptions([{ title: selectedRoom.title, _id: selectedRoom._id }]);
      }
      getAllSeatRooms({ room: selectedRoom._id })
        .then((dt) => {
          setRoomSeatDatas(dt);
        })
        .catch((err: any) => {
          openNotification({
            title: "Failed to Get Seats",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        });
    }
    if (!selectedRoom) {
      getAllDropdownRooms({})
        .then((dt: any) => {
          setRoomOptions(dt);
        })
        .catch((err) => {
          openNotification({
            title: "Failed to Get Rooms",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        });
    }

    if (user) {
      setInitialValues((prev: any) => ({
        ...prev,
        user: {label : user?.username, value : user._id},
      }));
    }
  }, [
    getAllSeatRooms,
    openNotification,
    selectedRoom,
    user,
    getAllDropdownRooms,
  ]);

  const handleSubmit = (
    values: any,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    setSubmitting(true); // Indicate submission in progress

    const { startDate, endDate, startTime, endTime, fullDay } = values;

    let startDateTime: Date;
    let endDateTime: Date;

    try {
      if (fullDay) {
        // For full day, use only the date
        startDateTime = new Date(startDate);
        endDateTime = new Date(endDate);

        // Validate dates
        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
          throw new Error("Invalid date format for full day reservation");
        }
      } else {
        // Ensure both date and time are provided
        if (!startDate || !endDate || !startTime || !endTime) {
          throw new Error("Missing date or time values");
        }

        // Check if startDate and endDate are Date objects or strings
        const startDateStr =
          typeof startDate === "string"
            ? startDate
            : startDate.toISOString().split("T")[0];
        const endDateStr =
          typeof endDate === "string"
            ? endDate
            : endDate.toISOString().split("T")[0];

        // Combine date and time to form complete date-time strings
        const startDateTimeStr = `${startDateStr}T${startTime}:00Z`;
        const endDateTimeStr = `${endDateStr}T${endTime}:00Z`;

        startDateTime = new Date(startDateTimeStr);
        endDateTime = new Date(endDateTimeStr);

        // Validate dates
        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
          throw new Error("Invalid date-time format");
        }
      }

      const payload = {
        ...values,
        user : values.user ? values.user?.value : undefined,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        startTime: fullDay ? null : startDateTime.toISOString(),
        endTime: fullDay ? null : endDateTime.toISOString(),
        seat: values.seat.value,
        room: values.room?._id,
        status: values.status.value,
      };

      createReserveRoomSeat(payload)
        .then((data) => {
          openNotification({
            title: "Successfully Created",
            message: `${data.message}`,
            type: "success",
          });
          close();
        })
        .catch((err: any) => {
          openNotification({
            title: "Create Failed",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    } catch (error: any) {
      setSubmitting(false);
    } finally {
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, errors, isSubmitting }) => {
        return (
          <Form>
            <DrawerFormHeightContainer>
              <Grid
                gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap={4}
              >
                <CustomInput
                  type="select"
                  options={roomOptions}
                  readOnly={true}
                  name="room"
                  value={values.room}
                  getOptionLabel={(item: any) => item.title}
                  getOptionValue={(item: any) => item._id}
                  onChange={(e) => {
                    setSelectedRoom(e);
                    setFieldValue("room", e);
                  }}
                  label="Room"
                  required
                  error={errors.room}
                  showError={showError}
                  disabled={room ? true : false}
                />
                <CustomInput
                  name="section"
                  type="select"
                  label="Section"
                  placeholder="Select the Section"
                  onChange={(e) => setFieldValue("section", e)}
                  options={[]}
                  showError={showError}
                />
                <CustomInput
                  label="Search User"
                  error={errors.user}
                  name="user"
                  placeholder="Search User"
                  type="real-time-user-search"
                  options={userOptions}
                  value={user ? {label : user?.username, value : user?._id} : undefined}
                  onChange={(e) => setFieldValue("user", e)}
                  required
                  showError={showError}
                  disabled={user ? true : false}
                />
                <CustomInput
                  label="Search Seat"
                  error={errors.seat}
                  name="seat"
                  placeholder="Search Seat"
                  type="select"
                  value={values.seat}
                  options={roomSeatDatas.map((item: any) => ({
                    label: item.seatNumber,
                    value: item._id,
                  }))}
                  onChange={(e) => setFieldValue("seat", e)}
                  required
                  showError={showError}
                />

                <CustomInput
                  error={errors.startDate}
                  type="date"
                  name="startDate"
                  value={values.startDate}
                  onChange={(e) => {
                    setFieldValue("startDate", e);
                    setFieldValue("endDate", e);
                  }}
                  label="Start Date"
                  required
                  showError={showError}
                />
                <CustomInput
                  error={errors.endDate}
                  type="date"
                  name="endDate"
                  value={values.endDate}
                  onChange={(e) => setFieldValue("endDate", e)}
                  label="End Date"
                  required
                  showError={showError}
                  minDate={values.startDate}
                />

                {!values.fullDay && (
                  <>
                    <CustomInput
                      error={errors.startTime}
                      type="time"
                      name="startTime"
                      value={values.startTime}
                      onChange={(e) => {
                        setFieldValue("startTime", e.target.value);
                      }}
                      label="Start Time"
                      showError={showError}
                      required={!values.fullDay ? true : false}
                    />
                    <CustomInput
                      error={errors.endTime}
                      type="time"
                      name="endTime"
                      value={values.endTime}
                      onChange={(e) => setFieldValue("endTime", e.target.value)}
                      label="End Time"
                      showError={showError}
                      required={!values.fullDay ? true : false}
                    />
                  </>
                )}

                <CustomInput
                  error={errors.status}
                  value={values.status}
                  label="Status"
                  name="status"
                  type="select"
                  placeholder="Select the Seat Status"
                  onChange={(e) => setFieldValue("status", e)}
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Cancelled", value: "cancelled" },
                  ]}
                  showError={showError}
                />
                <FormControl>
                  <Checkbox
                    id="fullDay"
                    name="fullDay"
                    isChecked={values.fullDay}
                    onChange={(e) => setFieldValue("fullDay", e.target.checked)}
                  >
                    Full Day
                  </Checkbox>
                </FormControl>
              </Grid>
            </DrawerFormHeightContainer>
            <SubmitFormBtn
              onClick={() => setShowError(true)}
              buttonText="Submit"
              loading={isSubmitting}
              cancelFunctionality={{
                show: true,
                text: "Cancel",
                onClick: () => close(),
              }}
            />
          </Form>
        );
      }}
    </Formik>
  );
});

export default ReserveSeatForm;
