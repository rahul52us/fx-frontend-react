import { Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FaRegEnvelope } from "react-icons/fa";
import store from "../../../../../../../store/store";
import { hoverColor } from "../../../../../../../globalColors";

const HeaderChatMessage = observer(() => {
  const { chatMessage: { setOpenMessageDrawer } } = store;

  const handleClick = () => {
    setOpenMessageDrawer('create');
  };

  return (
    <Flex align="center" justify="center" p={2}>
      <Tooltip label="New Message" aria-label="New Message Tooltip">
        <IconButton
          icon={<FaRegEnvelope />}
          variant="ghost"
          fontSize="1xl"
          color="black"
        transition={"all 0.3s ease-in-out"}
        _hover={{ color: "black.500", bg:`${hoverColor}`, borderRadius: "100px" }}
        _active={{ color: "black.500", bg:`${hoverColor}`, borderRadius: "100px" }}
          aria-label="chat-message-icons"
          onClick={handleClick}
        />
      </Tooltip>
    </Flex>
  );
});

export default HeaderChatMessage;