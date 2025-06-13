import { Box, Text, useColorMode } from "@chakra-ui/react";
import DeleteModel from "../../../../../config/component/common/DeleteModel/DeleteModel";

const DeleteWorkLocation = ({formValues, setFormValues, deleteRecord} : any) => {
   const {colorMode} = useColorMode()
  return (
    <div>
        <DeleteModel
          id={formValues?.data}
          open={formValues?.open && formValues?.type === "delete"}
          close={() => {
            setFormValues({
              type: "add",
              data: null,
              open: false,
              loading: false,
            });
          }}
          title={formValues?.data?.title}
          submit={(id: any) => deleteRecord(id)}
          loading={formValues?.loading}
        >
          <Box p={5} textAlign="center" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={3}>
              Confirm Deletion
            </Text>
            <Text fontWeight="bold" color={colorMode === "dark" ? "white" : "gray.800"} fontSize="lg" mb={4}>
              Are you sure you want to delete the Location{" "}
              <Text as="span" color="red.500" fontWeight="bold">
                "{formValues?.data?.locationName}"
              </Text>
              ? This action cannot be undone. All associated data will also be
                Effected.
            </Text>
          </Box>
        </DeleteModel>
    </div>
  )
}

export default DeleteWorkLocation