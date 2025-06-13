export interface QuizCategoryValue {
  title: string;
  description: string;
  thumbnail:any;
  section:any;
  class:any;
  categories:any
}

export interface QuizCategoryPara {
  submitForm: (
    values: {
      title: string;
      description: string;
      section:any;
      class:any;
      thumbnail:any;
      categories:any
    },
    resetForm: () => void,
    setShowError:any
  ) => void;
   loading:boolean,
  initialValues : QuizCategoryValue
}