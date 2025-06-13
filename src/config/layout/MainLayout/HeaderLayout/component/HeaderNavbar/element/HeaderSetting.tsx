import { observer } from "mobx-react-lite";
import HeaderLanguageSwitch from "../HeaderLanguageSwitch/HeaderLanguageSwitch";
import HeaderThemeSwitch from "../HeaderThemeSwitch/HeaderThemeSwitch";
import { Flex } from "@chakra-ui/react";
import HeaderChatMessage from "../HeaderChatMessage/HeaderChatMessage";
import HeaderNotification from "../HeaderNotification/HeaderNotification";

const HeaderSetting = observer(() => {
  return (
    <Flex justifyContent="space-around">
      <HeaderLanguageSwitch />
      <HeaderThemeSwitch />
      <HeaderChatMessage />
      <HeaderNotification />
    </Flex>
  );
});

export default HeaderSetting;
