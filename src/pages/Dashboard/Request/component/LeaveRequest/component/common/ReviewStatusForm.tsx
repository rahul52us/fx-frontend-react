import {
Button,
Box,
Text,
Flex,
Divider,
Spinner,
Textarea,
Heading,
Stack,
useColorModeValue,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, WarningIcon } from "@chakra-ui/icons";
import { useState } from "react";
import store from "../../../../../../../store/store";
import { getStatusType } from "../../../../../../../config/constant/statusCode";

const ReviewStatusForm = ({
data,
onClose,
applyGetAllRecords,
selectRequestStatus,
}: any) => {
const {
  requestStore: { updateRequest, deleteRequest },
  auth: { openNotification },
} = store;

const [loading, setLoading] = useState(false);
const [comment, setComment] = useState("");
const bgColor = useColorModeValue("gray.50", "gray.800");
const textColor = useColorModeValue("gray.600", "gray.300");

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Calculate total days of leave
const calculateTotalDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
};

const totalDays = calculateTotalDays(data.startDate, data.endDate);

// Function to handle status update
const updateStatus = async (action: string) => {
  setLoading(true);
  try {
    let requestData;
    if (action === "delete") {
      requestData = { _id: data._id };
    } else {
      requestData = {
        _id: data._id,
        status: action,
        reason: comment,
        user: data.userId,
      };
    }

    const requestPromise =
      action === "delete"
        ? deleteRequest(requestData)
        : updateRequest(requestData);

    const { data: responseData } = await requestPromise;

    openNotification({
      title: `${capitalizeFirstLetter(action)} Successful`,
      message: responseData?.message || "Request updated successfully.",
      type: "success",
    });

    applyGetAllRecords({ selectRequestStatus });
    onClose();
  } catch (err: any) {
    openNotification({
      title: `${capitalizeFirstLetter(action)} Failed`,
      message: err?.data?.message || "Something went wrong.",
      type: getStatusType(err.status),
    });
  } finally {
    setLoading(false);
  }
};

return (
  <Box
    borderWidth={1}
    borderRadius="lg"
    shadow="lg"
    bg={bgColor}
    mx="auto"
    p={[4, 6, 8]}
  >
    <Heading as="h2" size="lg" mb={4} textAlign="center">
      Review Request Status
    </Heading>
    <Text fontSize="md" color={textColor} mb={4} textAlign="center">
      Please review the request details below and provide your response.
    </Text>
    <Divider mb={4} />
    <Text mb={2}>
      <strong>Leave Type:</strong> {data.leaveType}
    </Text>
    <Text mb={2}>
      <strong>Applied On :</strong>{" "}
      {new Date(data.createdAt).toLocaleDateString()}
    </Text>
    <Text mb={2}>
      <strong>Start Date :</strong>{" "}
      {new Date(data.startDate).toLocaleDateString()}
    </Text>
    <Text mb={2}>
      <strong>End Date :</strong>{" "}
      {new Date(data.endDate).toLocaleDateString()}
    </Text>
    <Text mb={2}>
      <strong>Total Days:</strong> {totalDays}
    </Text>
    <Flex justifyContent="space-between" mb={4} alignItems="center">
      <Text>
        <strong>Status:</strong> {data.status}
      </Text>
      {loading && <Spinner size="sm" />}
    </Flex>
    <Textarea
      placeholder="Enter your reason or comment here..."
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      isDisabled={loading}
      mb={4}
    />
    <Stack direction={["column", "row"]} spacing={4}>
      {data.userType !== "user" ? (
        <>
          <Button
            colorScheme="green"
            leftIcon={<CheckIcon />}
            onClick={() => updateStatus("approved")}
            isLoading={loading}
            isDisabled={loading}
            flex="1"
          >
            Approve
          </Button>
          <Button
            colorScheme="red"
            leftIcon={<CloseIcon />}
            onClick={() => updateStatus("rejected")}
            isLoading={loading}
            isDisabled={loading}
            flex="1"
          >
            Reject
          </Button>
          <Button
            colorScheme="yellow"
            leftIcon={<WarningIcon />}
            onClick={() => updateStatus("cancelled")}
            isLoading={loading}
            isDisabled={loading}
            flex="1"
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Button
            colorScheme="green"
            leftIcon={<CheckIcon />}
            onClick={() => updateStatus("submitted")}
            isLoading={loading}
            isDisabled={loading}
            flex="1"
          >
            Submitted
          </Button>
          <Button
            colorScheme="red"
            leftIcon={<CloseIcon />}
            onClick={() => updateStatus("delete")}
            isLoading={loading}
            isDisabled={loading}
            flex="1"
          >
            Delete
          </Button>
        </>
      )}
    </Stack>
    <Button
      mt={4}
      colorScheme="blue"
      onClick={onClose}
      width="100%"
      variant="outline"
    >
      Close
    </Button>
  </Box>
);
};

export default ReviewStatusForm;
