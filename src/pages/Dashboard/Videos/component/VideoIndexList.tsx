import { observer } from "mobx-react-lite";
import CustomDrawer from "../../../../config/component/Drawer/CustomDrawer";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { FaFilePdf, FaStar } from "react-icons/fa";
import React, { useState } from "react";
import VideoCategoryForm from "./VideoCategoryForm";

interface IVideoList {
  title: string;
  open: boolean;
  close: any;
  videos: Array<{
    title: string;
    details: string;
    description: string;
    discountPrice: string;
    originalPrice: string;
    pricingType: string;
    amountType: string;
    rating: string;
    createdAt: Date;
    updatedAt: Date;
  }>[];
}

const VideosList = observer(({ title, open, close }: IVideoList) => {
  const [openCategoryModel, setOpenCategoryModel] = useState<any>({
    open: false,
    data: null,
    type: "add",
  });

  const tableBorderColor = useColorModeValue("gray.200", "gray.700");

  // Dummy data for testing
  const dummyData = [
    {
      title: "Video Title 1",
      details: "Video Details 1",
      description: "Video Description 1",
      discountPrice: "$19.99",
      originalPrice: "$29.99",
      pricingType: "Sale",
      amountType: "One-Time",
      rating: "4.5",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Video Title 2",
      details: "Video Details 2",
      description: "Video Description 2",
      discountPrice: "$15.99",
      originalPrice: "$24.99",
      pricingType: "Sale",
      amountType: "One-Time",
      rating: "4.2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Video Title 2",
      details: "Video Details 2",
      description: "Video Description 2",
      discountPrice: "$15.99",
      originalPrice: "$24.99",
      pricingType: "Sale",
      amountType: "One-Time",
      rating: "4.2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return (
    <React.Fragment>
      <CustomDrawer open={open} title={title} close={close}>
        <Button onClick={() => setOpenCategoryModel({ open: true, type : 'add', data : null })}>
          CREATE CATEGORY
        </Button>
        <Table variant="simple" colorScheme="teal" size="sm">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Video</Th>
              <Th>Price</Th>
              <Th>Type</Th>
              <Th>Rating</Th>
              <Th>Details</Th>
              <Th>Description</Th>
              <Th>Created At</Th>
              <Th>Updated At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dummyData.map((video, index) => (
              <Tr key={index} borderBottom={`1px solid ${tableBorderColor}`}>
                <Td>{video.title}</Td>
                <Td><FaFilePdf /></Td>
                <Td>{video.discountPrice}</Td>
                <Td>{video.pricingType}</Td>
                <Td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaStar color="teal" />
                    {video.rating}
                  </div>
                </Td>
                <Td>{video.details}</Td>
                <Td>{video.description}</Td>
                <Td>{video.createdAt.toLocaleDateString()}</Td>
                <Td>{video.updatedAt.toLocaleDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CustomDrawer>
      <VideoCategoryForm
        open={openCategoryModel.open}
        close={() => setOpenCategoryModel({ open: false, type: "add" })}
        title="Add New Category"
        type={openCategoryModel.type}
      />
    </React.Fragment>
  );
});

export default VideosList;
