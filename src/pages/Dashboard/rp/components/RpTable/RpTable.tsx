import { DownloadIcon, AttachmentIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  useToast,
  Box,
  Text,
  VStack,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "react";
import { primaryColor } from "../../../../../globalColors";
import { primaryButtonHoverStyle, primaryButtonStyle } from "../../../../../globalStyles";
import { FaCloudUploadAlt, FaFileExcel } from "react-icons/fa";
import { usePermission } from "../../../../../config/component/customHooks/usePermission";
import RestrictedAccess from "../../../../../config/component/common/RestrictedAccess/RestrictedAccess";

const RpTable = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");

  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Permission checks
  const { canView } = usePermission('rp');

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const uploadBoxBg = useColorModeValue("gray.50", "gray.700");
  const uploadBoxHoverBg = useColorModeValue("blue.50", "gray.600");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    try {
      // Convert file to Base64
      const base64 = await convertFileToBase64(file);

      // Send Base64 to API
      await submitExportForm(base64);

      setLoading(false);
    } catch (err) {
      console.error("Excel upload failed", err);
      setLoading(false);
      toast({
        title: "Upload failed",
        description: "Something went wrong while uploading the file.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
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
        `${process.env.REACT_APP_FX_BASE_URL}/rp/form/`,
        payload
      );

      if (response.status === 200 && response.data.status === "success") {
        toast({
          title: "Success",
          description: response.data.message || "File uploaded successfully.",
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
      toast({
        title: "Error",
        description: "Failed to connect to the server.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

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
    canView ? (
      <Box p={4}>
        <Flex align={'center'} justify={'space-between'} mb={6}>
          <VStack align="start" spacing={0}>
            <Heading size="lg" color={primaryColor}>Realized Profit (RP)</Heading>
            <Text color="gray.500" fontSize="sm">Manage and upload your realized profit data.</Text>
          </VStack>
          <Button
            onClick={handleDownload}
            leftIcon={<DownloadIcon />}
            colorScheme="blue"
            variant="outline"
            size="sm"
            {...primaryButtonStyle}
            _hover={primaryButtonHoverStyle}
          >
            Download Sample Template
          </Button>
        </Flex>

        <Box
          bg={cardBg}
          p={8}
          borderRadius="xl"
          boxShadow="sm"
          border="1px solid"
          borderColor={borderColor}
          textAlign="center"
        >
          <VStack spacing={6}>
            <Icon as={FaFileExcel} w={12} h={12} color="green.500" />
            <VStack spacing={2}>
              <Heading size="md">Upload your RP Excel File</Heading>
              <Text color="gray.500" maxW="md">
                Select your Excel file to upload and process realized profit data.
                Ensure you are using the correct template format.
              </Text>
            </VStack>

            <Box
              p={10}
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="lg"
              w="100%"
              maxW="600px"
              bg={uploadBoxBg}
              cursor="pointer"
              onClick={() => fileInputRef.current?.click()}
              _hover={{ borderColor: primaryColor, bg: uploadBoxHoverBg }}
              transition="all 0.2s"
            >
              <VStack spacing={3}>
                <Icon as={FaCloudUploadAlt} w={10} h={10} color="gray.400" />
                <Text fontWeight="bold" color="gray.600">Click to upload or drag and drop</Text>
                <Text fontSize="sm" color="gray.400">XLSX files only</Text>
              </VStack>
            </Box>

            {fileName && (
              <Flex align="center" gap={2} p={2} bg="blue.50" borderRadius="md" color="blue.700">
                <AttachmentIcon />
                <Text fontSize="sm" fontWeight="medium">{fileName}</Text>
              </Flex>
            )}

            <Button
              size={"lg"}
              colorScheme="blue"
              isLoading={loading}
              loadingText="Uploading..."
              variant="solid"
              w="200px"
              isDisabled={!fileName && !loading} // Disable if no file selected (optional logic, currently file select triggers upload immediately but good for future)
              onClick={() => !fileName && fileInputRef.current?.click()} // If no file, open dialog. If file, maybe just show status? Current logic uploads on select.
            // Adjusted logic: The original code uploaded indiscriminately on select.
            // Let's keep the button to trigger selection if not selected.
            >
              {fileName ? "Processing..." : "Select File"}
            </Button>

            <input
              id="file-upload"
              accept=".xlsx"
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </VStack>
        </Box>
      </Box>) : <RestrictedAccess />
  );
};

export default RpTable;
