import { Box, Image } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { main } from "../../../../../constant/routes";
// import Logo from "../../../../../assets/icon_images/Logo.jpg";

const HeaderLogo = observer(() => {
  const navigate = useNavigate();
  return (
    <Box p={4}>
      <Image
        src="https://themefisher.com/images/logo/logo.svg"
        alt=""
        cursor="pointer"
        mb={3}
        onClick={() => navigate(main.home)}
      />
      {/* <Heading color="blue.400">LOGO</Heading> */}
    </Box>
  );
});

export default HeaderLogo;
