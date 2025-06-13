import { Grid } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import store from "../../../../store/store";
import SideFilterContainer from "../../../../config/component/FilterContainer/SideFilterContainer/SideFilterContainer";
import SkeletanCategoryCard from "../../../../config/component/Card/CategoryCard/SkeletanCategoryCard";
import QuizCategoryCard from "../../../../config/component/Card/CategoryCard/QuizCategoryCard";

const QuizCategoryGridLayout = observer(({ handleClick }: any) => {
  const {
    quiz: {
      dashQuiz: { data, loading },
    },
  } = store;
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "1fr",
        md: "1fr 2fr",
        lg: "1fr 4fr",
      }}
      gap={4}
      columnGap={3}
    >
      <SideFilterContainer
        data={data.quiz || []}
        loading={loading}
        filtering={() => {}}
      />
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "1fr",
          md: "1fr",
          lg: "1fr 1fr",
          xl: "1fr 1fr 1fr",
        }}
        gap={5}
      >
        {data?.quiz?.map((item: any, index: any) => {
          return (
            <QuizCategoryCard
              item={item}
              thumbnail={item.thumbnail?.url}
              key={index}
              title={item.title}
              description={item.description}
              username={item?.createdBy?.name}
              userPic={item?.createdBy?.pic}
              discountPrice={item.discountPrice}
              originalPrice={item.originalPrice}
              rating={item.rating}
              totalCount={item?.totalChildData}
              handleClick={handleClick}
            />
          );
        })}
        {loading.loading && (
          <>
            <SkeletanCategoryCard />
            <SkeletanCategoryCard />
            <SkeletanCategoryCard />
            <SkeletanCategoryCard />
          </>
        )}
      </Grid>
    </Grid>
  );
});

export default QuizCategoryGridLayout;