import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

interface StoreEditedPayload {
  register: string;
  data: any[];
}

export const useStoreEdited = () => {
  const toast = useToast();
  const [editLoading, setEditLoading] = useState(false);

  const storeEdited = async (
    payload: StoreEditedPayload,
    onClose: () => void,
  ) => {
    setEditLoading(true);

    try {
      //   const token = localStorage.getItem("accessToken"); // or wherever you store it

      const response: any = await axios.post(
        "http://srv864630.hstgr.cloud:8000/api/storeedited/",
        payload,
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "application/json",
        //   },
        // }
      );

      if (response.status === "success") {
        toast({
          title: "Changes saved successfully",
          description: response?.data?.message || "Data updated",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        onClose();
      }
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast({
        title: "Failed to save changes",
        description: errorMessage,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });

      throw error; // important if caller wants to handle it
    } finally {
      setEditLoading(false);
    }
  };

  return {
    storeEdited,
    editLoading,
  };
};
