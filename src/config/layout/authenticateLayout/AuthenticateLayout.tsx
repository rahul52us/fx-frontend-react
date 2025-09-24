import {
  Box,
  Center,
  Flex,
  Image,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import store from "../../../store/store";
import Loader from "../../component/Loader/Loader";
import { glassLoginPageStyle } from "../../../globalStyles";
const images = [
  "https://img.freepik.com/free-photo/business-person-futuristic-business-environment_23-2150970204.jpg?uid=R98118533&ga=GA1.1.1625681573.1739726311&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/3d-rendering-financial-neon-bull_23-2151691955.jpg?uid=R98118533&ga=GA1.1.1625681573.1739726311&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/dynamic-data-visualization-3d_23-2151904315.jpg?uid=R98118533&ga=GA1.1.1625681573.1739726311&semt=ais_hybrid&w=740"
  // "https://d8it4huxumps7.cloudfront.net/uploads/images/login/login-img-1.png?d=734x734",
  // "https://d8it4huxumps7.cloudfront.net/uploads/images/login/login-img-2.png?d=734x734",
];

const AuthenticateLayout = observer(() => {
  const {
    auth: { restoreUser, user },
  } = store;
  const navigate = useNavigate();

  useEffect(() => {
    if (restoreUser()) {
      navigate("/dashboard");
    }
  }, [navigate, restoreUser, user]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    fade: true,
    draggable: false, // disables mouse drag
    swipe: false,  
  };

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minH="100vh"  
      transition="background-color 0.2s ease"
      className="loginPageBackground"
    >
      <Box
        width="100%"
        maxWidth={{ base: "100%", md: "900px" }}
        overflow="hidden"
        transition="box-shadow 0.3s ease"
        {...glassLoginPageStyle}
        style={{border:"none"}}
      >
        <Flex flexDirection={{ base: "column", md: "row" }}>
          <Box
            flex="1"
            position="relative"
            borderTopLeftRadius="lg"
            borderBottomLeftRadius={{ base: "0", md: "lg" }}
            overflow="hidden"
            display={{ base: "none", md: "block" }}
          >
            {/* <Box position="absolute" top={"20px"} left={{base : "45%", md : "20px"}} zIndex="1">
              <Image
                // src="https://d8it4huxumps7.cloudfront.net/uploads/images/login/login-img-4.png"
                src="https://img.freepik.com/free-vector/bull-logo-mascot-design_474888-7192.jpg?uid=R98118533&ga=GA1.1.1625681573.1739726311&semt=ais_hybrid&w=740"
                alt="Company Logo"
                blendMode={"multiply"}
                rounded={"xl"}
                width="60px"
                height="auto"
                opacity={0.9}
              />
            </Box> */}
            <Center height="100%" mt={{base : "60px", md : 0}}>
              <Box width="100%" maxWidth="100%" className="loginSlider" height={"100%"}>
                <Slider {...settings} >
                  {images.map((src, index) => (
                    <Box key={index} p={2} textAlign="center" style={{height:"100%"}}>
                      <Image
                        src={src}
                        alt={`Carousel Image ${index + 1}`}
                        width="100%"                       
                        height={"100%"}
                        borderRadius="lg"
                        objectFit="cover"
                        boxShadow="lg"
                        _hover={{ transform: "scale(1.05)" }}
                        transition="transform 0.3s ease"
                      />
                    </Box>
                  ))}
                </Slider>
              </Box>
            </Center>
          </Box>

          <Flex
            flex="1"
            alignItems="center"
            justifyContent="center"
            p={{ base: 8, md: 4 }}
            borderTopRightRadius="lg"
            borderBottomRightRadius="lg"
            bg={useColorModeValue("white", "gray.700")}
            transition="background-color 0.2s ease"
          >
            <VStack spacing={6} align="stretch" width="100%">
              <Suspense
                fallback={
                  <Center>
                    <Loader />
                  </Center>
                }
              >
                <Outlet />
              </Suspense>
            </VStack>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
});

export default AuthenticateLayout;
