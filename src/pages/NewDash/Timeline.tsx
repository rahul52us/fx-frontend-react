import React, { useState, useContext, createContext, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
  useColorModeValue,
  SimpleGrid,
  Tooltip,
  IconButton,
  Button,
} from "@chakra-ui/react";
import {
  addMonths,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";

import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

// Event interface
interface Event {
  id: number;
  title: string;
  date: string;
}

interface CalendarContextType {
  events: Event[];
  addEvent: (title: string, date: string) => void;
  removeEvent: (id: number) => void;
}

// Context for managing calendar events
const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};

const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<Event[]>([]);

  const addEvent = (title: string, date: string) => {
    const newEvent = { id: Date.now(), title, date };
    setEvents([...events, newEvent]);
  };

  const removeEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <CalendarContext.Provider value={{ events, addEvent, removeEvent }}>
      {children}
    </CalendarContext.Provider>
  );
};

// Component for the compact monthly calendar
const CompactCalendar: React.FC = () => {
  const { events } = useCalendar();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [title, setTitle] = useState("");
  const { addEvent } = useCalendar();
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  console.log(days);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    onOpen();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleAddEvent = () => {
    if (selectedDate && title.trim()) {
      addEvent(title, selectedDate);
      setTitle("");
      setSelectedDate(null); // Close the modal after adding event
    }
  };

  const startOfCalendar = startOfWeek(startOfMonth(currentMonth), {
    weekStartsOn: 0,
  }); // week starts on Sunday
  const endOfCalendar = endOfWeek(endOfMonth(currentMonth), {
    weekStartsOn: 0,
  });
  const calendarDays = eachDayOfInterval({
    start: startOfCalendar,
    end: endOfCalendar,
  });
  const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const bgHover = useColorModeValue("gray.100", "blue.700");

  const renderDayCell = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const dayEvents = events.filter((event) => event.date === formattedDate);
    const isToday = isSameDay(date, new Date());
    const isCurrentMonth = isSameMonth(date, currentMonth);

    const dayIndicator = isToday ? (
      <Box
        as="span"
        bg="blue.500"
        color="white"
        p={1}
        borderRadius="full"
        fontWeight="bold"
      >
        {format(date, "d")}
      </Box>
    ) : (
      <Text color={isCurrentMonth ? "inherit" : "gray.400"}>
        {format(date, "d")}
      </Text>
    );

    return (
      <Tooltip
        key={formattedDate}
        label={dayEvents.map((event) => event.title).join(", ")}
        bg="blue.600"
      >
        <Box
          p={1}
          borderRadius="xl"
          _hover={{ bg: bgHover }}
          transition={"background-color 0.2s ease"}
          borderColor={isCurrentMonth ? "gray.300" : "transparent"}
          onClick={() => handleDateClick(formattedDate)}
          cursor="pointer"
          bg={dayEvents.length > 0 ? "blue.100" : "transparent"}
        >
          <Text textAlign="center">{dayIndicator}</Text>
          {/* {dayEvents.length > 0 && (
            <Flex justify="center" mt={1}>
              <BsFillCalendarFill color="blue" />
            </Flex>
          )} */}
        </Box>
      </Tooltip>
    );
  };

  return (
    <>
      <Box
        p={4}
        bg={useColorModeValue("white", "gray.700")}
        borderRadius="md"
        shadow="md"
      >
        <Flex justify="space-between" align="center" mb={4}>
          <IconButton
            aria-label="Previous Month"
            icon={<ChevronLeftIcon />}
            onClick={handlePrevMonth}
            variant="ghost"
          />
          <Text fontSize="xl" fontWeight="bold">
            {format(currentMonth, "MMMM yyyy")}
          </Text>
          <IconButton
            aria-label="Next Month"
            icon={<ChevronRightIcon />}
            onClick={handleNextMonth}
            variant="ghost"
          />
        </Flex>
        <SimpleGrid columns={7} spacing={1} mb={2}>
          {dayLabels.map((day, index) => (
            <Box
              key={index}
              p={1}
              textAlign="center"
              fontWeight="700"
              color={"blue.600"}
            >
              {day}
            </Box>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={7} spacing={1}>
          {calendarDays.map((date) => renderDayCell(date))}
        </SimpleGrid>

        <Button
          size="sm"
          mt={4}
          w="full"
          onClick={() => setShowFullCalendar(true)}
        >
          View Full Calendar
        </Button>
      </Box>

      <EventModal
        selectedDate={selectedDate}
        onClose={() => {
          setSelectedDate(null);
          onClose();
        }}
        isOpen={isOpen}
        title={title}
        setTitle={setTitle}
        handleAddEvent={handleAddEvent}
      />

      {showFullCalendar && (
        <FullCalendarModal
          isOpen={showFullCalendar}
          onClose={() => setShowFullCalendar(false)}
        />
      )}
    </>
  );
};

// Modal for adding events
const EventModal: React.FC<{
  selectedDate: string | null;
  onClose: () => void;
  isOpen: boolean;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  handleAddEvent: () => void;
}> = ({ selectedDate, onClose, isOpen, title, setTitle, handleAddEvent }) => {
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
    }
  }, [isOpen, setTitle]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            mb={3}
          />
          <Input type="date" value={selectedDate ?? ""} isReadOnly mb={3} />
        </ModalBody>
        <ModalFooter>
          <Flex w="100%" justify="space-between">
            <Button
              colorScheme="blue"
              onClick={() => {
                handleAddEvent();
                onClose();
              }}
              mr={3}
            >
              Add
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Modal for full calendar view with all events
const FullCalendarModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { events } = useCalendar();
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  const days = eachDayOfInterval({ start, end });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Full Calendar View</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={7} spacing={1} p={2}>
            {days.map((date) => {
              const formattedDate = format(date, "yyyy-MM-dd");
              const dayEvents = events.filter(
                (event) => event.date === formattedDate
              );
              const isCurrentMonth = isSameMonth(date, new Date());

              return (
                <Box
                  key={formattedDate}
                  p={2}
                  borderRadius="md"
                  border="1px solid"
                  borderColor={isCurrentMonth ? "gray.300" : "transparent"}
                  bg={dayEvents.length > 0 ? "blue.100" : "transparent"}
                >
                  <Text textAlign="center" mb={2} fontWeight="bold">
                    {format(date, "d")}
                  </Text>
                  <VStack spacing={1} align="start">
                    {dayEvents.map((event) => (
                      <Box
                        key={event.id}
                        w="100%"
                        bg="blue.200"
                        p={1}
                        borderRadius="md"
                      >
                        <Text fontSize="sm" isTruncated>
                          {event.title}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// Export the component
const CalendarApp: React.FC = () => (
  <CalendarProvider>
    <CompactCalendar />
  </CalendarProvider>
);

export default CalendarApp;
