import {
  Box,
  Card,
  Divider,
  Flex,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import LeaveRequestForm from "./LeaveRequestForm";
import {
  generateRequestInitialValues,
  generateResponse,
} from "../../utils/function";
import store from "../../../../../../../store/store";
import { getStatusType } from "../../../../../../../config/constant/statusCode";
import { useNavigate, useParams } from "react-router-dom";
import { dashboard } from "../../../../../../../config/constant/routes";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Loader from "../../../../../../../config/component/Loader/Loader";

const LeaveEditRequest = observer(() => {
  const {
    auth: { openNotification },
    requestStore: { createRequest, getRequestById },
  } = store;
  const [formValues, setFormValues] = useState({
    data: null,
    loading: false,
  });
  const navigate = useNavigate();
  const [requestType, setRequestType] = useState("submit");
  const [showError, setShowError] = useState(false);
  const { requestId, userId } = useParams();

  console.log('the user Id are', userId)

  useEffect(() => {
    setFormValues((previousValues: any) => ({
      ...previousValues,
      data: null,
      loading: true,
    }));
    getRequestById({ _id: requestId })
      .then((data: any) => {
        console.log(data.data);
        setFormValues((previousValues: any) => ({
          ...previousValues,
          data: data.data[0],
          loading: false,
        }));

        // Handle the data if needed
      })
      .catch((err) => {
        setFormValues((previousValues: any) => ({
          ...previousValues,
          data: null,
          loading: false,
        }));
        openNotification({
          title: "Edit Failed",
          message: err?.data?.message,
          type: getStatusType(err.status),
        });
        setTimeout(() => {
          navigate(dashboard.request.index);
        }, 2000);
      });
  }, [requestId, getRequestById, openNotification, navigate, setFormValues]);

  const handleSubmit = ({ values, setSubmitting, resetForm }: any) => {
    createRequest(generateResponse(values))
      .then((data: any) => {
        openNotification({
          title: "Create Successfully",
          message: data?.message,
          type: "success",
        });
        resetForm();
      })
      .catch((err: any) => {
        openNotification({
          title: "Failed Failed",
          message: err?.data?.message,
          type: getStatusType(err.status),
        });
      })
      .finally(() => {
        setSubmitting(false);
        setShowError(false);
      });
  };

  return (
    <Card>
      <Flex p={3} alignItems="center">
        <IconButton
          aria-label=""
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon fontSize="xl" />
        </IconButton>
        <Heading fontSize="2xl" borderColor="gray.800" ml={3}>
          Edit Request
        </Heading>
      </Flex>
      <Divider color="lightgray" borderWidth={1} />
      {!formValues.loading ? (
        <LeaveRequestForm
          initialValues={generateRequestInitialValues(formValues.data)}
          showError={showError}
          setShowError={setShowError}
          close={() => {}}
          handleSubmit={handleSubmit}
          setRequestType={setRequestType}
          requestType={requestType}
        />
      ) : (
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="65vh"
        >
          <Box>
            <Loader height="100%"/>
          </Box>
        </Flex>
      )}
    </Card>
  );
});

export default LeaveEditRequest;
