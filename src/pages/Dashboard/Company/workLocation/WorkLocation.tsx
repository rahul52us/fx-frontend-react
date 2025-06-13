import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import store from "../../../../store/store";
import CustomTable from "../../../../config/component/CustomTable/CustomTable";
import { getStatusType } from "../../../../config/constant/statusCode";
import { generateResponse } from "./utils/function";
import AddWorkLocation from "./component/AddWorkLocation";
import EditWorkLocation from "./component/EditWorkLocation";
import DeleteWorkLocation from "./component/DeleteWorkLocation";
import { Button, Flex, Input } from "@chakra-ui/react";
import { readFileAsBase64 } from "../../../../config/constant/function";
import { employDropdownData } from "../../Users/component/UserDetails/utils/constant";

const WorkLocationDetails = observer(({selectedPolicy, selectCompany} : any) => {
  const {
    company: { getWorkLocations, workLocations, updateWorkLocation, updateWorkLocationsByExcel },
    auth: { openNotification, getPolicy },
  } = store;
  const inputRef = useRef<any>(null);
  const policy = useState(selectedPolicy || getPolicy())[0]
  const selectedCompany = useState(selectCompany || store.auth.getCurrentCompany())[0]
  const [uploadLoading, setUploadLoading] = useState(false);
  const dropdowns = useState(employDropdownData)[0];
  const [selectedOptions, setSelectedOptions] = useState({});
  const [date, setDate] = useState<any>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [formValues, setFormValues] = useState<any>({
    open: false,
    loading: false,
    type : 'add',
    data : null
  });

  useEffect(() => {
    getWorkLocations({policy, company : selectedCompany })
      .then(() => {})
      .catch((err: any) => {
        openNotification({
          type: getStatusType(err.status),
          title: "Failed to get Locations",
          message: err?.data?.message,
        });
      });
  }, [getWorkLocations, openNotification, getPolicy, policy, selectedCompany]);

  // function to get the data from backend on the page, limit, date and others
  const applyGetAllRecords = () => {
    const query: any = {policy, company : selectedCompany};
    getWorkLocations(query)
      .then(() => {})
      .catch((err: any) => {
        openNotification({
          type: "error",
          title: "Failed to get workLocations",
          message: err?.message,
        });
      });
  };

  const onDateChange = (e: any, type: string) => {
    setDate((prev: any) => ({ ...prev, [type]: e }));
  };

  const handleChangePage = () => {
    applyGetAllRecords();
  };

  const resetTableData = () => {
    setDate({
      startDate: new Date(),
      endDate: new Date(),
    });
    setSelectedOptions({});
    applyGetAllRecords();
  };

  const deleteRecord = (data : any) => {
    setFormValues(() => ({...formValues, loading : true}))
    updateWorkLocation({ locationName : data.locationName?.trim(), isDelete : 1, _id : formValues?.data?._id, policy, company : selectedCompany })
      .then((data: any) => {
        openNotification({
          title: "Deleted Successfully",
          message: data?.message,
          type: "success",
        });
        applyGetAllRecords()
        setFormValues(() => ({...formValues, loading : false , data : null, type : 'add', open : false}))
      })
      .catch((err: any) => {
        openNotification({
          title: "Deleted Failed",
          message: err?.data?.message,
          type: getStatusType(err.status),
        });
        setFormValues(() => ({...formValues, loading : false}))
      })
  }

  const UserTableColumns = [
    {
      headerName: "Location",
      key: "locationName",
      type: "tooltip",
      function: (e: any) => {
        setFormValues(() => ({...formValues, type : 'edit', data : e, open : true }))
      },
      props: {
        column: { textAlign: "center" },
        row: {
          minW: 120,
          textAlign: "center",
          fontWeight: 500,
          textDecoration: "none",
        },
      },
    },
    {
      headerName: "Ip Address",
      key: "ipAddress",
      props: { row: { minW: 100, textAlign: "center" } },
    },
    {
      headerName: "Actions",
      key: "table-actions",
      type: "table-actions",
      props: {
        row: {maxW : 60, textAlign: "center" },
        column: { maxW : 60, textAlign: "center" },
      },
    },
  ];

  const updateWorkLocationByExcel = async (file: any) => {
    try {
      setUploadLoading(true);
      const data = await readFileAsBase64(file);
      updateWorkLocationsByExcel({ file: data, policy : policy, company : selectedCompany })
        .then((response) => {

          if (response.status === "success") {
            resetTableData();
            openNotification({
              type: "success",
              title: "uploaded Successfully",
              message: "WorkLocations File Uploaded Successfully",
            });
          } else {
            openNotification({
              type: "error",
              title: "upload Failed",
              message: "Failed to Upload WorkLocations",
            });
          }
        })
        .catch((err) => {
          openNotification({
            title: "Uploaded Failed",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        })
        .finally(() => {
          setUploadLoading(false);
        });
    } catch (err) {}
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      updateWorkLocationByExcel(file);
    }
  };

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <>
    <Flex mb={2} justifyContent={"end"}>
        <Input
          type="file"
          ref={inputRef}
          display="none"
          onChange={handleFileChange}
        />
        <Button isLoading={uploadLoading} onClick={handleButtonClick}>
          Upload WorkLocations Excel
        </Button>
      </Flex>
      <CustomTable
        cells={true}
        actions={{
          applyFilter: {
            show: false,
            function: () => applyGetAllRecords(),
          },
          resetData: {
            show: true,
            text: "Reset Data",
            function: () => resetTableData(),
          },
          actionBtn: {
            addKey: {
              showAddButton: true,
              function: () => {
                setFormValues(() => ({...formValues,open : true, type : 'add'}))
              },
            },
            editKey: {
              showEditButton: true,
              function: (e: any) => {
                setFormValues(() => ({...formValues, type : 'edit', data : e, open : true }))
              },
            },
            viewKey: {
              showViewButton: false,
              function: (dt: string) => {
                alert(dt);
              },
            },
            deleteKey: {
              showDeleteButton: true,
              function: (dt: string) => {
                setFormValues(() => ({...formValues, data : dt, open : true, type : 'delete'}))
              },
            },
          },
          pagination: {
            show: false,
            onClick: handleChangePage,
            currentPage: 1,
            totalPages: workLocations.totalPages,
          },
          datePicker: {
            show: false,
            isMobile: true,
            date: {
              startDate: date.startDate,
              endDate: date.endDate,
            },
            onDateChange: (e: string, type: string) => onDateChange(e, type),
          },
          multidropdown: {
            show: false,
            title: "Apply Filters",
            placeholder: "Apply Filters",
            search: {
              searchValue: "",
              visible: true,
              placeholder: "Search Value here",
              onSearchChange: () => {},
            },
            dropdowns: dropdowns,
            onApply: () => applyGetAllRecords(),
            selectedOptions: selectedOptions,
            onDropdownChange: (value: any, label: string) => {
              setSelectedOptions((prev: any) => ({ ...prev, [label]: value }));
            },
          },
        }}
        title="Locations"
        data={generateResponse(workLocations.data)}
        columns={UserTableColumns}
        loading={workLocations.loading}
        serial={{ show: false, text: "S.No.", width: "10px" }}
      />
      <AddWorkLocation formValues={formValues} setFormValues={setFormValues} getAllRecords={applyGetAllRecords} policy={policy} company={selectedCompany}/>
      <EditWorkLocation formValues={formValues} setFormValues={setFormValues} getAllRecords={applyGetAllRecords} policy={policy} company={selectedCompany}/>
      <DeleteWorkLocation formValues={formValues} setFormValues={setFormValues} deleteRecord={deleteRecord} policy={policy} company={selectedCompany}/>
    </>
  );
});

export default WorkLocationDetails;
