import {
  FormControl,
  FormLabel,
  Grid,
  Heading,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import {
  AiOutlineCloudDownload,
  AiOutlineEye,
  AiOutlineFilePdf,
  AiOutlineShareAlt,
} from "react-icons/ai";

type ProfileCardI= {
  title?: string;
  src?: string;
};

function ProfileCard({ src }: ProfileCardI) {
  return (
    <Grid templateColumns={{ md: "1fr 1fr" }}>
      <Grid
        className="main"
        p={2}
        rounded={8}
        bg={"gray.50"}
        // height="50vh"
        boxShadow="rgb(0 0 0 / 20%) 0px 0px 11px"
        templateRows={{ base: "2fr 22fr 0.1fr", md: "1fr 6fr 0.1fr" }}
      >
        <Grid alignItems={"center"} className="pcHead">
          <Heading
            fontWeight={600}
            fontSize={"xl"}
            px={{ base: "0.9rem", md: "1.7rem" }}
          >
            {/* {title} ||  */}
            My Children_01
          </Heading>
        </Grid>
        <Grid className="pcHero">
          <Grid
            templateRows={{ base: "1fr 1fr", md: "1fr" }}
            templateColumns={{ md: "2fr 3fr" }}
          >
            <Grid order={0} className="photoSec" templateRows={"8fr 2fr"}>
              <Grid
                justifyContent={"center"}
                alignItems={"center"}
                p={{ base: "0.25rem 0.5rem", md: "0.5rem 1.5rem" }}
                className="photo"
              >
                <Image
                  rounded={8}
                  boxSize={{ base: "295px", md: "220px" }}
                  src={
                    src
                      ? src
                      : "https://upload.wikimedia.org/wikipedia/commons/4/40/POS17_%40Kristsll-197_%2835166607974%29.jpg"
                  }
                  alt="Id Photo"
                />
              </Grid>
              <Grid
                // fontSize={"3rem"}
                gap={2}
                p={{ base: "0.5rem 0.75rem", md: "0.35rem 1.7rem" }}
                className="photoFooter"
                templateColumns={"repeat(4,1fr)"}
              >
                <IconButton
                  aria-label="label"
                  alignItems={"center"}
                  justifyContent={"center"}
                  bg={"gray.100"}
                  rounded={8}
                >
                  <AiOutlineEye fontSize={"1.5rem"} />
                </IconButton>
                <IconButton
                  aria-label=""
                  alignItems={"center"}
                  justifyContent={"center"}
                  bg={"gray.100"}
                  rounded={8}
                >
                  <AiOutlineFilePdf fontSize={"1.5rem"} />
                </IconButton>
                <IconButton
                  aria-label=""
                  alignItems={"center"}
                  justifyContent={"center"}
                  bg={"gray.100"}
                  rounded={8}
                >
                  <AiOutlineCloudDownload fontSize={"1.5rem"} />
                </IconButton>
                <IconButton
                  aria-label=""
                  alignItems={"center"}
                  justifyContent={"center"}
                  bg={"gray.100"}
                  rounded={8}
                >
                  <AiOutlineShareAlt fontSize={"1.5rem"} />
                </IconButton>
              </Grid>
            </Grid>
            <Grid p={{ base: "1rem", md: "0.5rem 1rem" }} className="textField">
              <FormControl
                display={"grid"}
                gridTemplateColumns={{ base: "1fr 1fr", md: "2fr 3fr" }}
              >
                <FormLabel display={"inline-flex"}>Name:</FormLabel>
                <Text display={"inline-flex"}>Greg Gonzalez</Text>

                <FormLabel display={"inline-flex"}>Gender:</FormLabel>
                <Text display={"inline-flex"}>Male</Text>

                <FormLabel display={"inline-flex"}>DOB:</FormLabel>
                <Text display={"inline-flex"}>18/1/2008</Text>

                <FormLabel display={"inline-flex"}>Admission Id:</FormLabel>
                <Text display={"inline-flex"}>chippi-chippi-chappa</Text>

                <FormLabel display={"inline-flex"}>Admission Date:</FormLabel>
                <Text display={"inline-flex"}>18/3/2008</Text>

                <FormLabel display={"inline-flex"}>Class:</FormLabel>
                <Text display={"inline-flex"}>10</Text>

                <FormLabel display={"inline-flex"}>Section:</FormLabel>
                <Text display={"inline-flex"}>A</Text>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid className="pcFooter" />
      </Grid>
    </Grid>
  );
}

ProfileCard.defaultProps = {
  title: "My Children_01",
};

export default ProfileCard;
