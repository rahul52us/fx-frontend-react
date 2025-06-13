import { Box } from "@chakra-ui/react";
import DashPageHeader from "../../../config/component/common/DashPageHeader/DashPageHeader";
import VideoGridLayout from "./Layout/VideoGridLayout";
import { headerHeight } from "../../../config/constant/variable";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import VideoCategoryList from './component/VideosCategoryList'
import { videoBreadCrumb } from "../utils/breadcrumb.constant";
import VideoChartContainer from "./component/VideoChartContainer";

const VideosIndex = observer(() => {
  const [selectedCategory, setSelectedCategory] = useState<any>({
    open: false,
    category: null,
  });
  const [openVideosList, setOpenVideosList] = useState<any>({
    open: false,
    data: null,
  });

  return (
    <Box minHeight={`calc(100vh - ${headerHeight})`} m={-2} p={3}>
      <DashPageHeader
        title="Videos"
        breadcrumb={videoBreadCrumb}
      />
      <VideoChartContainer addData={() => setOpenVideosList({ open: true })}/>
      <VideoGridLayout handleClick={(item : any) => {setSelectedCategory({open : true, category : item})}}/>
      <VideoCategoryList
        videos={[]}
        title="Videos Categories"
        open={openVideosList.open}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        close={() => {
          setOpenVideosList({ open: false, data: null });
        }}
      />
    </Box>
  );
});

export default VideosIndex;
