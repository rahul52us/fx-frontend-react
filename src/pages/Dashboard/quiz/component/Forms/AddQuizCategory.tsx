import QuizCategoryForm from "./QuizCategoryForm";
import { observer } from "mobx-react-lite";
import store from "../../../../../store/store";
import { QuizCategoryValue } from "./utils/dto";
import { readFileAsBase64 } from "../../../../../config/constant/function";
import { useState } from "react";

const AddQuizCategory = observer(() => {
  const [submitting, setSubmitting] = useState(false)
  const {
    quiz: { CreateQuiz },
    auth: { openNotification },
  } = store;

  const initialValues = {
    title: "",
    description: "",
    class: undefined,
    section: undefined,
    thumbnail: "",
    categories: [{ title: "", description: "", thumbnail: "" }],
  };

  const addCategoryStore = async (
    values: QuizCategoryValue,
    resetForm: () => void,
    setShowError: any
  ) => {
    setSubmitting(true)
    const categories : any = []
    await Promise.all(values.categories.map(async (item : any) => {
      let fileData : any = ""
      if(item.thumbnail && item.thumbnail !== ""){
         let base64 = await readFileAsBase64(item.thumbnail);
         fileData  = {
          filename : item.thumbnail?.name,
          buffer : base64,
          type : item.thumbnail?.type
        }
      }
      categories.push({...item,thumbnail:fileData})
    }));
    if (values.thumbnail.length) {
      const buffer = await readFileAsBase64(values.thumbnail[0]);
      const fileData = {
        buffer: buffer,
        filename: values.thumbnail[0].name,
        type: values.thumbnail[0].type,
      };
      values.thumbnail = fileData;
    }
    if (categories.length === 0) {
      delete values.categories;
    }
    CreateQuiz({
      ...values,
      categories:categories,
      class: values.class?._id,
      section: values.section?._id,
    })
      .then((data: any) => {
        openNotification({
          title: "Create Successfully",
          message: data.message,
        });
        resetForm();
        setShowError(false);
      })
      .catch((err: any) => {
        if (err.statusCode === 422) {
          openNotification({
            title: "Create Failed",
            message: err.data?.message,
            type: "error",
          });
        } else {
          openNotification({
            title: "Create Failed",
            message: err?.message,
            type: "error",
          });
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <QuizCategoryForm
      loading={submitting}
      submitForm={addCategoryStore}
      initialValues={initialValues}
    />
  );
});

export default AddQuizCategory;
