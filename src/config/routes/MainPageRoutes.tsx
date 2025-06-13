import { lazy } from "react";
import AddingparaForm from "../../pages/main/Contact/AddingparaForm";
import Home2 from "../../pages/main/Home/Home2";
import SingleProduct from "../../pages/main/Product/component/SingleProduct";
import { main } from "../constant/routes";
// const Home = lazy(() => import("../../pages/main/Home/Home"));
const About = lazy(() => import("../../pages/main/About/About"));
const PageNotFound = lazy(() => import("../component/common/WebPages/PageNotFound"));

const ProfileIndex = lazy(
  () => import("../../pages/main/profile/ProfileIndex")
);
const Pricing = lazy(() => import("../../pages/main/pricing/Pricing"));
const Testimonial = lazy(
  () => import("../../pages/main/Testimonial/Testimonial")
);
const Contact = lazy(() => import("../../pages/main/Contact/Contact"));
const YoutubeVideoIndex = lazy(
  () => import("../../pages/main/Videos/VideosIndex")
);
const CoursesIndex = lazy(() => import("../../pages/main/courses/Courses"));
const Faq = lazy(() => import("../../pages/main/Faq/Faq"));

// Blog Sections
const BlogIndex = lazy(() => import("../../pages/main/Blog/BlogIndex"))
const SingleBlogIndex = lazy(() => import("../../pages/main/Blog/SingleBlogIndex"))

// Quiz Sections
const QuizIndex = lazy(() => import('../../pages/main/quiz/QuizIndex'))
const QuizCategoryIndex = lazy(() => import('../../pages/main/quiz/pages/QuizCategoryIndex'))
const QuizQuestionIndex = lazy(() => import("../../pages/main/quiz/pages/QuizQuestionIndex")) ;
const ProjectIndex = lazy(() => import("../../pages/main/project/ProjectIndex"))
const IndividualCompanyHome = lazy(() => import("../../pages/main/IndividualCompanyHome/IndividualCompanyHome"))


export const MainPublicRoutes = [
  {
    element: <Home2 />,
    path: main.home,
    publicRoute: true,
  },
  {
    element: <About />,
    path: main.about,
    publicRoute: true,
  },
  {
    element: <SingleProduct />,
    path: main.product,
    publicRoute: true,
  },
  {
    element: <Pricing />,
    path: "/pricing",
    publicRoute: true,
  },
  {
    element: <Testimonial />,
    path: main.testimonial,
    publicRoute: true,
  },
  {
    element: <Contact />,
    path: main.contact,
    publicRoute: true,
  },
  {
    element: <YoutubeVideoIndex />,
    path: main.video,
    publicRoute: true,
  },
  {
    element: <CoursesIndex />,
    path: main.courses,
    publicRoutes: true,
  },
  {
    element: <ProfileIndex />,
    path: main.profile,
    publicRoutes: false,
  },
  {
    element: <ProfileIndex />,
    path: main.profileTab,
    publicRoutes: false,
  },
  {
    element: <Faq />,
    path: main.faq,
    publicRoutes: true,
  },
  {
    element: <AddingparaForm />,
    path: main.addingparaform,
    publicRoutes: true,
  },
  {
    element: <BlogIndex />,
    path:main.blog,
    publicRoutes:true
  },
  {
    element: <SingleBlogIndex />,
    path: main.singleBlog,
    publicRoutes:true
  },
  {
    element : <QuizIndex />,
    path:main.quizIndex,
    publicRoutes:true
  },
  {
    element : <QuizCategoryIndex />,
    path: main.quizTitle,
    publicRoutes:true
  },
  {
    element: <QuizQuestionIndex />,
    path:main.quizQuestionIndex,
    publicRoutes:true
  },
  {
    element : <ProjectIndex />,
    path: main.project,
    publicRoutes:false
  },
  {
    element : <IndividualCompanyHome />,
    path: main.individualHomeCompany,
    publicRoutes:true
  },
  {
    element : <PageNotFound />,
    path : '/*',
    privateRoutes : true
  },
];
