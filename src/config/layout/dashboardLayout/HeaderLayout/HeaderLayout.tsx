"use client"; // Add this for client-side component in Next.js

import { Flex } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import HeaderNavbar from "./component/HeaderNavbar/HeaderNavbar";
import HeaderLogo from "./component/Logo/HeaderLogo";
import { observer } from "mobx-react-lite";
import { headerHeight, headerPadding } from "../../../constant/variable";


const HeaderLayout = observer(() => {
  const [isLargerThan1020] = useMediaQuery("(min-width: 1020px)");

  return (
    <Flex
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      height={headerHeight}
      padding={headerPadding}
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)" // Moved styled-components shadow to Chakra UI prop
    >
      <Flex width={isLargerThan1020 ? "85%" : "95%"}>
        <HeaderLogo />
      </Flex>
      <HeaderNavbar />
    </Flex>
  );
});

export default HeaderLayout;