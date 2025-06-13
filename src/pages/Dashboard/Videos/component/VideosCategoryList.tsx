import { observer } from "mobx-react-lite";
import CustomDrawer from "../../../../config/component/Drawer/CustomDrawer";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect, useState, useMemo } from "react";
import VideoCategoryForm from "./VideoCategoryForm";
import store from "../../../../store/store";
import StarRatingIcon from "../../../../config/component/StarRatingIcon/StarRatingIcon";
import VideosList from "./VideosList";
import TableLoader from "../../../../config/component/DataTable/TableLoader";
import { formatDate } from "../../../../config/constant/dateUtils";

interface IVideoList {
  title: string;
  open: boolean;
  close: any;
  selectedCategory:any,
  setSelectedCategory:any,
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

const HeaderCell = ({
  label,
  isEllipsis = true,
}: {
  label: string;
  isEllipsis?: boolean;
}) => (
  <Th
    backgroundColor="teal.500"
    color="white"
    fontWeight="bold"
    whiteSpace={isEllipsis ? "nowrap" : "unset"}
    overflow={isEllipsis ? "hidden" : "unset"}
    textOverflow={isEllipsis ? "ellipsis" : "unset"}
  >
    {label}
  </Th>
);

const VideosCategoryList = observer(({ title, open, close, setSelectedCategory, selectedCategory }: IVideoList) => {

  const {
    VideoStore: { getCategories, categories },
  } = store;

  const [openCategoryModel, setOpenCategoryModel] = useState<any>({
    open: false,
    data: null,
    type: "add",
  });

  const tableBorderColor = "gray.300";

  useEffect(() => {
    getCategories({ page: 1 })
      .then(() => {})
      .catch((err: any) => {
        console.log(err.message);
      });
  }, [getCategories]);

  const categoriesData = useMemo(() => categories.data, [categories.data]);

  return (
    <React.Fragment>
      <CustomDrawer open={open} title={title} close={close}>
        <Flex justifyContent="end">
          <Button
            colorScheme="teal"
            onClick={() =>
              setOpenCategoryModel({ open: true, type: "add", data: null })
            }
            marginBottom="1rem"
            size="sm"
          >
            Create Category
          </Button>
        </Flex>
        <Box
          position="relative"
          overflow="auto hidden"
          className="customScrollBar"
          minH={'75vh'}
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          borderRadius="sm"
          >
          <Table
            className="customTable"
            variant="striped"
            colorScheme="teal"
            size="sm"
          >
          <Thead bg={"whiteAlpha.900"} stroke={"whiteAlpha.500"} h={10}>
              <Tr>
                <HeaderCell label="Title" />
                <HeaderCell label="Details" />
                <HeaderCell label="Description" />
                <HeaderCell label="Price" isEllipsis={false} />
                <HeaderCell label="Type" />
                <HeaderCell label="Rating" />
                <HeaderCell label="Created At" />
              </Tr>
            </Thead>
            <TableLoader
              show={categoriesData.length}
              loader={categories.loading}
            >
              <Tbody>
                {categoriesData.map((video: any, index: number) => (
                  <Tr
                    key={index}
                    borderBottom={`1px solid ${tableBorderColor}`}
                  >
                    <Td
                      _hover={{ textDecoration: "underline" }}
                      cursor="pointer"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      onClick={() =>
                        setSelectedCategory({ open: true, category: video })
                      }
                    >
                      {video.title}
                    </Td>
                    <Td
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {video.details}
                    </Td>
                    <Td
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {video.description}
                    </Td>
                    <Td>{video.discountPrice}</Td>
                    <Td
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {video.pricingType}
                    </Td>
                    <Td
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      <StarRatingIcon rating={video.rating} />
                    </Td>
                    <Td
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {video.createdAt ? formatDate(video.createdAt) : "-"}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </TableLoader>
          </Table>
        </Box>
      </CustomDrawer>
      <VideoCategoryForm
        open={openCategoryModel.open}
        close={() => setOpenCategoryModel({ open: false, type: "add" })}
        title="Add New Category"
        type={openCategoryModel.type}
      />
      <VideosList
        title={selectedCategory?.category?.title || ""}
        open={selectedCategory.open}
        close={() => setSelectedCategory({ open: false, category: null })}
        categoryData={selectedCategory.category}
      />
    </React.Fragment>
  );
});

export default VideosCategoryList;
