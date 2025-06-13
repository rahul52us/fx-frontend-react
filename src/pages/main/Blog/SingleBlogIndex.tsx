import { useState } from "react";
import { useEffect } from "react";
import { Box, Grid } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import BlogLikeContainer from "./component/mainBlogCotainer/component/BLogLikeContainer";
import { useLocation, useParams } from "react-router-dom";
import BlogViewContainer from "./component/mainBlogCotainer/component/BlogViewContainer";
import store from "../../../store/store";
import BlogSingleRight from "./component/mainBlogCotainer/component/BlogSingleRight";
import PageLoader from "../../../config/component/Loader/PageLoader";

const SingleBlogIndex = observer(() => {
  const [blogData, setBlogData] = useState<any>(null);
  const [loader, setLoader] = useState(false);
  const {
    BlogStore: { getSingleBlogs, getComments },
    auth: { openNotification },
  } = store;
  const { state } = useLocation();
  const param = useParams();

  useEffect(() => {
    let key: any = {};
    if (state) {
      key["blogId"] = state;
    } else {
      key["title"] = param.blogTitle?.split("-").join(" ");
    }
    setLoader(true);
    getSingleBlogs(key)
      .then((data) => {
        setBlogData(data);
      })
      .catch(() => {
      })
      .finally(() => {
        setLoader(false);
      });
  }, [openNotification, getSingleBlogs, state, param.blogTitle]);

  useEffect(() => {
    if (blogData) {
      getComments(blogData?._id, 1)
        .then(() => {})
        .catch((err: any) => {
          openNotification({
            title: "GET Comments Failed",
            message: err.message,
            type: "error",
          });
        });
    }
  }, [openNotification, getComments, blogData]);

  return (
    <Box display="flex" justifyContent="center" mb={10}>
      <Grid
        gridTemplateColumns={{ lg: "0.6fr 1.9fr 0.9fr" }}
        position="relative"
        width="100%"
      >
        <Box
          position="sticky"
          top={20}
          left={0}
          alignSelf="flex-start"
          justifyContent="center"
          display={{ base: "none", lg: "flex" }}
          style={{ marginTop: "80px" }}
        >
          <BlogLikeContainer />
        </Box>
        <Box w="100%" mt={{ base: 0, md: 5 }}>
          <PageLoader noRecordFoundText={!blogData} loading={loader} height={'0vh'}>
            {!loader && <BlogViewContainer item={blogData} />}
          </PageLoader>
        </Box>
        <Box position="sticky" top={5} right={0} alignSelf="flex-start" display="none">
          <BlogSingleRight item={blogData} />
        </Box>
      </Grid>
    </Box>
  );
});

export default SingleBlogIndex;
