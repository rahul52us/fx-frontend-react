import {
  Button,
  Center,
  Flex,
  Grid,
  Icon,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { web } from "../../../config/constant/routes";
import store from "../../../store/store";
import { useCallback, useEffect, useState } from "react";
import useDebounce from "../../../config/component/customHooks/useDebounce";
import { tablePageLimit } from "../../../config/constant/variable";
import WebTemplatePreviewCard from "./components/WebTemplatePreviewCard";
import DashPageHeader from "../../../config/component/common/DashPageHeader/DashPageHeader";
import { dashBreadCrumb } from "../utils/breadcrumb.constant";
import Loader from "../../../config/component/Loader/Loader";
import MainPagePagination from "../../../config/component/pagination/MainPagePagination";
import { useQueryParams } from "../../../config/component/customHooks/useQuery";
import { FiPlus } from "react-icons/fi";

const WebsiteCustomisationIndex = observer(() => {
  const {
    WebTemplateStore: { getAllWebTemplate, webTemplates },
    auth: { openNotification },
  } = store;
  const navigate = useNavigate();

  const [pageLimit] = useState(tablePageLimit);
  const [searchQuery] = useState("");
  const { getQueryParam, setQueryParam } = useQueryParams();
  const [currentPage, setCurrentPage] = useState(() =>
    getQueryParam("page") ? Number(getQueryParam("page")) : 1
  );
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const applyGetAllRecords = useCallback(
    ({ page, limit, reset }: any) => {
      const query: any = {};
      if (reset) {
        query["page"] = 1;
        query["limit"] = tablePageLimit;
      } else {
        if (debouncedSearchQuery.trim()) {
          query["search"] = debouncedSearchQuery;
        }
        query["page"] = page || currentPage;
        query["limit"] = limit || pageLimit;
      }
      getAllWebTemplate(query)
        .then(() => {})
        .catch((err) => {
          openNotification({
            type: "error",
            title: "Failed to get users",
            message: err?.message,
          });
        });
    },
    [
      debouncedSearchQuery,
      currentPage,
      pageLimit,
      getAllWebTemplate,
      openNotification,
    ]
  );

  useEffect(() => {
    applyGetAllRecords({
      page: currentPage,
      limit: tablePageLimit,
      search: debouncedSearchQuery,
    });
  }, [currentPage, debouncedSearchQuery, applyGetAllRecords]);

  const handleChangePage = (page: any) => {
    setCurrentPage(page);
    setQueryParam("page", page);
  };

  return (
    <>
      <Flex justifyContent="space-between" mb={2} alignItems="center">
        <DashPageHeader title="Dashboard" breadcrumb={dashBreadCrumb} />
        <Button
          onClick={() => navigate(web.websiteCustomisation.create)}
          colorScheme="teal"
          variant="solid"
          leftIcon={<Icon as={FiPlus} />}
          size="lg"
          _hover={{
            transform: "scale(1.05)",
            boxShadow: "lg",
          }}
          _active={{
            transform: "scale(0.98)",
          }}
          loadingText="Creating..."
          display={{ base: "flex", sm: "inline-flex" }}
        >
          <span
            style={{
              display: useBreakpointValue({ base: "none", sm: "inline" }),
            }}
          >
            CREATE DOMAIN
          </span>
        </Button>
      </Flex>
      {webTemplates.data?.length > 0 ? (
        <Grid
          gridTemplateColumns={{
            base: "1fr",
            md: "1fr 1fr",
            xl: "1fr 1fr 1fr",
          }}
          gap={4}
        >
          {webTemplates.data.map((item: any, index: number) => (
            <WebTemplatePreviewCard key={index} item={item} />
          ))}
        </Grid>
      ) : (
        webTemplates.loading === false && (
          <Center w="100%" mt={"15vh"}>
            <Image src="/img/emptyData.jpg" w={280} h={280} />
          </Center>
        )
      )}
      {webTemplates.loading && (
        <Flex justifyContent="center">
          <Loader height="5vh" />
        </Flex>
      )}

      {webTemplates?.totalPages > 0 ? (
        <Flex justifyContent="center" mt={8}>
          <MainPagePagination
            currentPage={currentPage}
            onPageChange={(page: any) => handleChangePage(page.selected)}
            totalPages={webTemplates?.totalPages}
          />
        </Flex>
      ) : null}
    </>
  );
});

export default WebsiteCustomisationIndex;
