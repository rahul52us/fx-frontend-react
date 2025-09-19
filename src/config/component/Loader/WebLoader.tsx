import { Box, Spinner } from "@chakra-ui/react"
import { primaryColor } from "../../../globalColors"

const WebLoader = ({ height }: any) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={height ? height : "100vh"}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color={primaryColor}
        size="xl"
      />
    </Box>
  )
}

export default WebLoader