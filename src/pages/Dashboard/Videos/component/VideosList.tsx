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
  IconButton,
} from "@chakra-ui/react";
import React, { useEffect, useState, useMemo } from "react";
import store from "../../../../store/store";
import StarRatingIcon from "../../../../config/component/StarRatingIcon/StarRatingIcon";
import { FaChevronLeft } from "react-icons/fa";
import TableLoader from "../../../../config/component/DataTable/TableLoader";
import VideoForm from "./VideosForm";
import YoutubeVideoPlayer from "../../../../config/component/VideoPlayer/YoutubeVideoPlayer";

interface IVideoList {
  title: string;
  open: boolean;
  close: any;
  categoryData: any;
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

const VideosList = observer(
  ({ title, open, close, categoryData }: IVideoList) => {
    const {
      VideoStore: { videos, getVideos },
    } = store;
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [openVideoModel, setOpenVideoModel] = useState<any>({
      open: false,
      data: null,
      type: "add",
    });

    const tableBorderColor = "gray.300";

    useEffect(() => {
      if (categoryData) {
        getVideos({ page: 1, category: categoryData._id })
          .then(() => {})
          .catch((err: any) => {
            console.log(err.message);
          });
      }
    }, [getVideos, categoryData]);

    const VideosData = useMemo(() => videos.data, [videos.data]);

    return (
      <React.Fragment>
        <CustomDrawer open={open} title={title} close={close}>
          <Flex alignItems="center" justifyContent="space-between" mb={2}>
            <IconButton
              colorScheme="teal"
              aria-label="Back"
              icon={<FaChevronLeft />}
              onClick={close}
              size="sm"
              mr={2}
              title="Back"
            />
            <Button
              colorScheme="teal"
              onClick={() =>
                setOpenVideoModel({ open: true, type: "add", data: null })
              }
              size="sm"
            >
              Create Video
            </Button>
          </Flex>
          <Box
            position="relative"
            overflow="auto hidden"
            className="customScrollBar"
            minH={"75vh"}
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            borderRadius="sm"
          >
            <Table className="customTable" variant="striped" size="sm">
              <Thead bg={"whiteAlpha.900"} stroke={"whiteAlpha.500"} h={10}>
                <Tr>
                  <HeaderCell label="Title" />
                  <HeaderCell label="Video" />
                  <HeaderCell label="Price" isEllipsis={false} />
                  <HeaderCell label="Type" />
                  <HeaderCell label="Rating" />
                  <HeaderCell label="Details" />
                  <HeaderCell label="Description" />
                  <HeaderCell label="Created At" />
                </Tr>
              </Thead>
              <TableLoader show={VideosData.length} loader={videos.loading}>
                <Tbody>
                  {VideosData.map((video: any, index: number) => (
                    <Tr
                      key={index}
                      borderBottom={`1px solid ${tableBorderColor}`}
                    >
                      <Td
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {video.title}
                      </Td>
                      <Td
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        onClick={() => setSelectedVideo(video.videoLink)}
                      >
                        {video.videoLink}
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
                        {video.description}
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
                        {video.createdAt}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </TableLoader>
            </Table>
          </Box>
        </CustomDrawer>
        <VideoForm
          open={openVideoModel.open}
          close={() => setOpenVideoModel({ open: false, type: "add" })}
          title="Add New Category"
          type={openVideoModel.type}
          data={openVideoModel.data}
          categoryId={categoryData?._id}
        />
        {selectedVideo && <YoutubeVideoPlayer link={selectedVideo} handleClose={() => setSelectedVideo(null)}/>}
      </React.Fragment>
    );
  }
);

export default VideosList;
