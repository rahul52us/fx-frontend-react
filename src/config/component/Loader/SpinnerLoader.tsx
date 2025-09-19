import { Spinner } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { primaryColor } from "../../../globalColors";

interface SpinnerLoaderI {
  size?: string;
}

const SpinnerLoader = observer(({ size = "xl" }: SpinnerLoaderI) => {
  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color={primaryColor}
      size={size ? size : "2xl"}
    />
  );
});

export default SpinnerLoader;
