import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import TaskCard from "../../../component/TaskCard/TaskCard";
import React, { useState } from "react";
import ConfirmTaskModel from "./ConfirmTaskModel";

const TaskPage = ({ taskData, setActiveSelectedTask, fetchRecords }: any) => {
  const [openConfirmModel, setOpenConfirmModel] = useState<any>({
    open: false,
    data: null,
    sourceColumn: "",
    destinationColumn: "",
  });
  const statuses = ["backlog", "inProgress", "toDo", "done", "complete"];

  const gradient = [
    useColorModeValue(
      "linear(to-t, orange.300, orange.400)",
      "linear(to-t, orange.400, orange.600)"
    ),
    useColorModeValue(
      "linear(to-t, red.300, red.400)",
      "linear(to-t, red.400, red.600)"
    ),
    useColorModeValue(
      "linear(to-t, green.300, green.400)",
      "linear(to-t, green.400, green.600)"
    ),
    useColorModeValue(
      "linear(to-t, blue.300, blue.400)",
      "linear(to-t, blue.400, blue.600)"
    ),
    useColorModeValue(
      "linear(to-t, purple.300, purple.400)",
      "linear(to-t, purple.400, purple.600)"
    ),
  ];

  const borderColor = useColorModeValue("gray.200", "gray.600");

  const tasksByStatus = statuses.reduce((acc: any, status) => {
    acc[status] = taskData?.filter((task: any) => task.status === status);
    return acc;
  }, {});

  const handleTaskMoved = (
    draggableId: string,
    sourceColumn: string,
    destinationColumn: string
  ) => {
    const task = taskData.find((task: any) => task._id === draggableId);
    if (task) {
      setOpenConfirmModel({
        open: true,
        data: task,
        sourceColumn,
        destinationColumn,
      });
    } else {
      console.log(`Task ${draggableId} not found`);
    }
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;

    if (sourceColumn !== destinationColumn) {
      handleTaskMoved(draggableId, sourceColumn, destinationColumn);
    }
  };

  return (
    <React.Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Flex
          gap={4}
          flexDirection={{ base: "column", xl: "row" }}
          w="100%"
          justifyContent="center"
          p={4}
        >
          {statuses?.map((status, index) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <Box
                  w={{ base: "100%", xl: `calc(100% / ${statuses.length})` }}
                  minW={{ base: "100%", xl: `calc(100% / ${statuses.length})` }}
                  border={"2px solid"}
                  borderColor={borderColor}
                  borderStyle={"dashed"}
                  p={2}
                  borderRadius="lg"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  mb={{ base: 4, md: 0 }}
                >
                  <Box mb={4} p={2} bgGradient={gradient[index]} rounded={"lg"}>
                    <Text fontWeight={500} color={"white"}>
                      {status?.charAt(0).toUpperCase() + status?.slice(1)}
                    </Text>
                  </Box>
                  {tasksByStatus[status]?.map((task: any, index: number) => (
                    <Draggable
                      draggableId={task._id}
                      index={index}
                      key={task._id}
                    >
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided?.draggableProps}
                          {...provided?.dragHandleProps}
                          mb={4}
                        >
                          <TaskCard
                            task={task}
                            setActiveSelectedTask={setActiveSelectedTask}
                          />
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided?.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </Flex>
      </DragDropContext>
      <ConfirmTaskModel
        openConfirmModel={openConfirmModel}
        setOpenConfirmModel={setOpenConfirmModel}
        fetchRecords={fetchRecords}
      />
    </React.Fragment>
  );
};

export default TaskPage;
