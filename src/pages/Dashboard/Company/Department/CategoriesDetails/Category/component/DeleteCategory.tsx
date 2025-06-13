import { Box, Text, useColorMode } from "@chakra-ui/react";
import DeleteModel from "../../../../../../../config/component/common/DeleteModel/DeleteModel";

const DeleteCategory = ({openModel, setOpenModel, deleteRecord} : any) => {
   const {colorMode} =  useColorMode()
  return (
    <DeleteModel
          id={openModel?.data?._id}
          open={openModel?.open}
          close={() => {
            setOpenModel({
              type: "add",
              data: null,
              open: false,
              loading: false,
            });
          }}
          title={openModel?.data?.title}
          submit={(id: any) => deleteRecord(id)}
          loading={openModel?.loading}
        >
          <Box p={5} textAlign="center" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={3}>
              Confirm Deletion
            </Text>
            <Text fontWeight="bold" color={colorMode === "dark" ? "white" : "gray.800"} fontSize="lg" mb={4}>
              Are you sure you want to delete the position{" "}
              <Text as="span" color="red.500" fontWeight="bold">
                "{openModel?.data?.title}"
              </Text>
              ? This action cannot be undone. All associated data will also be
              permanently removed.
            </Text>
          </Box>
        </DeleteModel>
  )
}

export default DeleteCategory