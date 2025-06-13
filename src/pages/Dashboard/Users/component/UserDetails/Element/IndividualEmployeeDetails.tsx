import { Box, Button } from "@chakra-ui/react";
// import { observer } from "mobx-react-lite";
import store from "../../../../../../store/store";
import { useEffect } from "react";

interface IndividualUsereDetailsProps {
  UsereId: string;
  onClose: () => void;
}

const IndividualUsereDetails: React.FC<IndividualUsereDetailsProps> = ({
  UsereId,
  onClose,
}) => {
  const {
    Usere: { getUsereDetailsById },
    auth: { openNotification },
  }: any = store;

  useEffect(() => {
    if (UsereId) {
      getUsereDetailsById(UsereId)
        .then((details: any) => {
          console.log(details);
          // openNotification("Usere details fetched successfully");
        })
        .catch((error: any) => {
          console.error("Failed to fetch Usere details", error);
          // openNotification("Failed to fetch Usere details", "error");
        });
    }
  }, [UsereId, getUsereDetailsById, openNotification]);

  return (
    <Box>
      {/* Render Usere details here */}
      <p>Details for Usere ID: {UsereId}</p>
      <Button onClick={onClose}>Close</Button>
    </Box>
  );
};

export default IndividualUsereDetails;
