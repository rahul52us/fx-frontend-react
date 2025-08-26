// hooks/useDeleteItem.ts
import axios from "axios";
import { useToast } from "@chakra-ui/react";

export const useDeleteItem = () => {
  const toast = useToast();

  const deleteItem = async ({
    url,
    rowId,
    formType,
    refetch,
  }: {
    url: string;
    rowId: string | number;
    formType: string;
    refetch?: () => void;
  }) => {
    try {
      const body = {
        formType: formType,
        userToken: "abcxyz", // hardcoded as per requirement
        rowId: rowId,
      };

      await axios.post(url, body);

      toast({
        title: "Deleted successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      if (refetch) refetch();
    } catch (err) {
      console.error("Delete error:", err);
      toast({
        title: "Failed to delete",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return { deleteItem };
};
