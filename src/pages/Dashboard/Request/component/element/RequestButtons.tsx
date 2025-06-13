import {
  Button,
  Flex,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  CloseIcon,
  RepeatIcon,
  TimeIcon,
  WarningIcon,
  ViewIcon,
} from "@chakra-ui/icons";

const RequestButtons = ({ setSelectRequestStatus }: any) => {
  const handleSelectStatus = (status: string) => {
    setSelectRequestStatus(status);
  };

  return (
    <Flex justify="space-around" align="center">
      <Box
        display={{ base: "none", md: "flex" }}
        justifyContent="space-around"
        alignItems="center"
      >
        <Button
          size="sm"
          colorScheme="blue"
          variant="solid"
          leftIcon={<TimeIcon />}
          mr={2}
          onClick={() => handleSelectStatus("pending")}
        >
          Pending to Submit
        </Button>
        <Button
          size="sm"
          colorScheme="green"
          variant="solid"
          leftIcon={<CheckCircleIcon />}
          mr={2}
          onClick={() => handleSelectStatus("approved")}
        >
          Approved
        </Button>
        <Button
          size="sm"
          colorScheme="purple"
          variant="solid"
          leftIcon={<RepeatIcon />}
          mr={2}
          onClick={() => handleSelectStatus("submitted")}
        >
          Submitted
        </Button>
        <Button
          size="sm"
          colorScheme="red"
          variant="solid"
          leftIcon={<CloseIcon />}
          mr={2}
          onClick={() => handleSelectStatus("rejected")}
        >
          Rejected
        </Button>
        <Button
          size="sm"
          colorScheme="orange"
          variant="solid"
          leftIcon={<WarningIcon />}
          mr={2}
          onClick={() => handleSelectStatus("cancelled")}
        >
          Cancelled
        </Button>
        <Button
          size="sm"
          colorScheme="orange"
          variant="solid"
          leftIcon={<ViewIcon />}
          mr={2}
          onClick={() => handleSelectStatus("all")}
        >
          All
        </Button>
      </Box>

      {/* Menu displayed on smaller screens */}
      <Box display={{ base: "block", md: "none" }} zIndex={99999}>
        <Menu>
          <MenuButton as={Button} size="sm" colorScheme="blue" variant="solid">
            More
          </MenuButton>
          <MenuList>
            <MenuItem
              icon={<TimeIcon />}
              onClick={() => handleSelectStatus("pending")}
            >
              {" "}
              Pending to Submit
            </MenuItem>
            <MenuItem
              icon={<CheckCircleIcon />}
              onClick={() => handleSelectStatus("approved")}
            >
              Approved
            </MenuItem>
            <MenuItem
              icon={<RepeatIcon />}
              onClick={() => handleSelectStatus("submitted")}
            >
              Submitted
            </MenuItem>
            <MenuItem
              icon={<CloseIcon />}
              onClick={() => handleSelectStatus("rejected")}
            >
              Rejected
            </MenuItem>
            <MenuItem
              icon={<WarningIcon />}
              onClick={() => handleSelectStatus("cancelled")}
            >
              Cancelled
            </MenuItem>
            <MenuItem
              icon={<ViewIcon />}
              onClick={() => handleSelectStatus("all")}
            >
              All
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default RequestButtons;
