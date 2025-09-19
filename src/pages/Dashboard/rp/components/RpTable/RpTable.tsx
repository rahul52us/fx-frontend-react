import { DownloadIcon } from "@chakra-ui/icons";
import { Button, Flex, Heading, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "react";
import { primaryColor } from "../../../../../globalColors";
import { primaryButtonHoverStyle, primaryButtonStyle } from "../../../../../globalStyles";

const RpTable = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [_, setFileBase64] = useState<string>("");

  const toast = useToast();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // setLoading(true);
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Convert file to Base64
      const base64 = await convertFileToBase64(file);
      setFileBase64(base64);

      // Send Base64 to API
      await submitExportForm(base64);

      setLoading(false);
    } catch (err) {
      console.error("Excel upload failed", err);
    }
  };

  // Convert file to Base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Converts to Base64
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const submitExportForm = async (base64: string) => {
    try {
      const payload = {
        userToken: "abcxyz",
        data: base64,
      };

      const response = await axios.post(
        "http://srv864630.hstgr.cloud:8000/rp/form/",
        payload
      );

      if (response.status === 200 && response.data.status === "success") {
        toast({
          title: "Success",
          description: response.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        toast({
          title: "Submission failed",
          description: "Unexpected server response.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error: any) {
      console.error("Error submitting form", error.message);
    }
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);


   const handleDownload = () => {
    // Create a link element
    const link = document.createElement('a');
    
    // Set the href to the path of the Excel file
    link.href = '/excel/RP_sample.xlsx';
    
    // Set the download attribute with the desired filename
    link.download = 'RP_sample.xlsx';
    
    // Append to the body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
    <Flex align={'center'} gap={4} justify={'space-between'}>
      <Heading color={primaryColor}>RP</Heading>
       <Button 
      onClick={handleDownload}
      leftIcon={<DownloadIcon />}
      colorScheme="blue"
       variant="outline"
      {...primaryButtonStyle}
      _hover={primaryButtonHoverStyle}
      >
      Download Sample
    </Button>
      </Flex>
      <Flex justify={"center"} mt={"100px"}>
        <Button
          size={"lg"}
          colorScheme="blue"
          isLoading={loading}
          variant="outline"
          {...primaryButtonStyle}
          _hover={primaryButtonHoverStyle}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Excel
        </Button>

        <input
          id="file-upload"
          accept=".xlsx"
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </Flex>
    </>
  );
};

export default RpTable;
