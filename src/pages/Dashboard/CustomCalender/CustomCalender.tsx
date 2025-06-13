import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import moment from "moment";

const AttendanceCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<any>(null);

  const handleCellClick = (arg: DateClickArg) => {
    setSelectedDate(arg.dateStr);
  };

  const handleEventClick = (clickInfo: any) => {
    console.log("Event clicked:", clickInfo.event);
    setEventDetails(clickInfo.event);
  };

  const closeModal = () => {
    setEventDetails(null);
  };

  const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    dateClick: handleCellClick,
    selectable: true,
    eventClick: handleEventClick,
    eventSources: [
      // Array of event sources
      {
        events: [
          {
            title: "John Doe - Present",
            start: moment("2024-03-15").toDate(),
            end: moment("2024-03-18").add(1, "hours").toDate(),
            classNames: ["present-event"], // Add class to style present events differently
            color: "green", // Define color for present events
          },
          {
            title: "John Doe - Present",
            start: moment("2024-03-20").toDate(),
            end: moment("2024-03-20").add(1, "hours").toDate(),
            classNames: ["present-event"], // Add class to style present events differently
            color: "green", // Define color for present events
          },
          {
            title: "John Doe - Present",
            start: moment().toDate(),
            end: moment().add(1, "hours").toDate(),
            classNames: ["present-event"], // Add class to style present events differently
            color: "green", // Define color for present events
          },
          {
            title: "Jane Smith - Leave",
            start: moment().add(2, "days").toDate(),
            end: moment().add(3, "days").toDate(),
            classNames: ["leave-event"], // Add class to style leave events differently
            color: "red", // Define color for leave events
          },
          // Add more events as needed
        ],
        color: "transparent", // Hide default background color
        textColor: "black", // Set text color for events
      },
    ],
    // Add more options as per your requirements
  };

  console.log("Event details:", eventDetails);
  console.log("selected Date", selectedDate)
  return (
    <>
      <Box height={"100%"}>
        <FullCalendar {...calendarOptions} />
      </Box>
      {eventDetails && (
        <Modal isOpen={true} onClose={closeModal} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Event Details</ModalHeader>
            <ModalBody>
              <p>Title: {eventDetails.title}</p>
              <p>
                Start: {moment(eventDetails.start).format("YYYY-MM-DD HH:mm")}
              </p>
              <p>End: {moment(eventDetails.end).format("YYYY-MM-DD HH:mm")}</p>
              {/* Add more event details as needed */}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default AttendanceCalendar;
