import { Box} from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import HeaderNavbar from "./component/HeaderNavbar/HeaderNavbar";
import HeaderLogo from "./component/Logo/HeaderLogo";
import { observer } from "mobx-react-lite";

const HeaderLayout = observer(() => {
  const [isLargerThan1020] = useMediaQuery("(min-width: 1020px)");
  return (
    <>
      <Box width={isLargerThan1020 ? "40%" : "95%"}>
        <HeaderLogo />
      </Box>
      <HeaderNavbar />
    </>
  );
});

export default HeaderLayout;
