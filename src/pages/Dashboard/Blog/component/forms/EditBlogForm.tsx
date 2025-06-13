import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import store from "../../../../../store/store";
import { observer } from "mobx-react-lite";
import BlogForm from "./BlogForm";
import PageLoader from "../../../../../config/component/Loader/PageLoader";

const EditBlogForm = observer(() => {
  const [blogData, setBlogData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const {
    BlogStore: { getSingleBlogs, updateBlog },
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

    setLoading(true); // Start loading when the request is made

    getSingleBlogs(key)
      .then((data) => {
        if (data) {
          setBlogData({
            ...data,
            coverImage: {
              fileName: data?.coverImage?.name || null,
              type: data?.coverImage?.type || null,
              buffer: data?.coverImage?.url || null,
              isAdd :0,
              isDeleted:0
            },
          });
        } else {
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [openNotification, getSingleBlogs, state, param.blogTitle]);

  const submitForm = (submitData: any) => {
    setFormLoading(true);
    updateBlog({...submitData, id : blogData?._id})
      .then((data) => {
        openNotification({
          title: "Updated SUCCESSFULLY",
          message: data.message,
        });
        setBlogData({...data?.data,coverImage: {
          fileName: data?.coverImage?.name || null,
          type: data?.coverImage?.type || null,
          buffer: data?.coverImage?.url || null,
          isAdd:0,
          isDeleted:0
        }, });
      })
      .catch((err: any) => {
        openNotification({
          title: "CREATE FAILED",
          message: err.message,
          type: "error",
        });
      })
      .finally(() => {
        setFormLoading(false);
      });
  };

  return (
    <PageLoader height="0vh" noRecordFoundText={!blogData} loading={loading}>
      {blogData && (
        <BlogForm
          initialValues={blogData}
          submitForm={submitForm}
          loading={formLoading}
          isEdit={true}
        />
      )}
    </PageLoader>
  );
});

export default EditBlogForm;
