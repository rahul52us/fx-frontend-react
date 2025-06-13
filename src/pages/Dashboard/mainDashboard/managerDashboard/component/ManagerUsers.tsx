import { observer } from "mobx-react-lite";
import store from "../../../../../store/store";
import { useEffect, useState, useCallback } from "react";
import { miniTablePageLimit } from "../../../../../config/constant/variable";
import { generateManagerData } from "../utils/function";
import useDebounce from "../../../../../config/component/customHooks/useDebounce";
import { managerUserColumns } from "../utils/constant";
import NormalTable from "../../../../../config/component/Table/NormalTable/NormalTable";

const ManagerUsers = observer(() => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(miniTablePageLimit);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    User: { getAllManagerUsers, managerUsers },
    auth: { openNotification, user },
  } = store;

  const applyGetAllManagerUsers = useCallback(({ page, limit, reset, search }: any) => {
    const query: any = {};
    query["managerId"] = user._id;
    if (reset) {
      query["page"] = 1;
      query["limit"] = miniTablePageLimit;
    } else {
      query["page"] = page || currentPage;
      query["limit"] = limit || pageLimit;
    }
    if (search) {
      query["search"] = search;
    }
    getAllManagerUsers(query)
      .then(() => {})
      .catch((err: any) => {
        openNotification({
          type: "error",
          title: "Failed to get users",
          message: err?.message,
        });
      });
  }, [user._id, currentPage, pageLimit, getAllManagerUsers, openNotification]);

  useEffect(() => {
    if (user.role === "manager" || user.role === "admin" || user.role === "superadmin") {
      applyGetAllManagerUsers({ page: currentPage, limit: miniTablePageLimit, search: debouncedSearchQuery });
    }
  }, [user.role, currentPage, debouncedSearchQuery, applyGetAllManagerUsers]);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <NormalTable
      title="Team Members"
      data={generateManagerData(managerUsers.data)}
      loading={managerUsers.loading}
      searchValue={searchQuery}
      onSearchChange={(e: any) => setSearchQuery(e.target.value)}
      currentPage={currentPage}
      totalPages={managerUsers.totalPages || 1}
      onPageChange={handleChangePage}
      columns={managerUserColumns}
    />
  );
});

export default ManagerUsers;
