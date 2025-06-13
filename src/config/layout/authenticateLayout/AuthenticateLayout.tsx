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
import store from "../../../store/store";
import Loader from "../../component/Loader/Loader";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "https://d8it4huxumps7.cloudfront.net/uploads/images/login/login-img-4.png?d=734x734",
  "https://d8it4huxumps7.cloudfront.net/uploads/images/login/login-img-1.png?d=734x734",
  "https://d8it4huxumps7.cloudfront.net/uploads/images/login/login-img-2.png?d=734x734",
];

const AuthenticateLayout = observer(() => {
  const {
    auth: { restoreUser },
  } = store;
  const navigate = useNavigate();

  useEffect(() => {
    if (restoreUser()) {
      navigate("/");
    }
  }, [navigate, restoreUser]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    fade: true,
  };

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minH="100vh"
      px={4}
      py={{ base: 4, md: 8 }}
      bg={useColorModeValue("gray.100", "gray.800")}
      transition="background-color 0.2s ease"
    >
      <Box
        width="100%"
        maxWidth={{ base: "100%", md: "900px" }}
        overflow="hidden"
        borderRadius="lg"
        border="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        boxShadow="lg"
        bg={useColorModeValue("white", "gray.700")}
        transition="box-shadow 0.3s ease"
      >
        <Flex flexDirection={{ base: "column", md: "row" }}>
          <Box
            flex="1"
            p={{ base: 6, md: 8 }}
            position="relative"
            bg={useColorModeValue("blue.50", "blue.900")}
            borderTopLeftRadius="lg"
            borderBottomLeftRadius={{ base: "0", md: "lg" }}
            overflow="hidden"
          >
            <Box position="absolute" top={"20px"} left={{base : "45%", md : "20px"}} zIndex="1">
              <Image
                src="https://d8it4huxumps7.cloudfront.net/uploads/images/login/login-img-4.png"
                alt="Company Logo"
                width="70px"
                height="auto"
                opacity={0.9}
              />
            </Box>
            <Center height="100%" mt={{base : "60px", md : 0}}>
              <Box width="100%" maxWidth="300px">
                <Slider {...settings}>
                  {images.map((src, index) => (
                    <Box key={index} p={2} textAlign="center">
                      <Image
                        src={src}
                        alt={`Carousel Image ${index + 1}`}
                        width="100%"
                        height="auto"
                        borderRadius="lg"
                        objectFit="contain"
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
