import { useState } from "react";
import store from "../../../store/store";
import { Box, Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { nextDayMidnight } from "../../../config/constant/dateUtils";

const PunchInComponent = observer(() => {
  const [loading, setLoading] = useState(false);
  const {
    AttendencePunch: { handlePunch },
    auth: { openNotification, getPolicy },
  } = store;
  const [, setLatitude] = useState<number | null>(null);
  const [, setLongitude] = useState<number | null>(null);

  // Function to get geolocation data
  const getGeolocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => resolve(position),
          (error) => reject(error)
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

  // Punch function
  const handlePunchFun = async () => {
    try {
      setLoading(true);
      const position = await getGeolocation();
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      handlePunch({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        deviceInfo: navigator.userAgent,
        date : nextDayMidnight,
        policy : getPolicy()
      })
        .then(() => {
          openNotification({
            type: "success",
            title: "Update Successfully",
            message: "Punch Successfully",
          });
        })
        .catch((err) => {
          openNotification({
            type: "error",
            title: "Failed to Punch In",
            message: err?.message,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error: any) {
      openNotification({
        type: "error",
        title: "Failed to Punch In",
        message: error?.message,
      });
    }
  };
  return (
    <Box>
      <Button isLoading={loading} onClick={handlePunchFun}>
        Punch
      </Button>
    </Box>
  );
});

export default PunchInComponent;
