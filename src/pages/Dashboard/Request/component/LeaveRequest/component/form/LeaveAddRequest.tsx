import { Card, Divider, Flex, Heading, IconButton } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import LeaveRequestForm from "./LeaveRequestForm";
import { generateRequestInitialValues, generateResponse } from "../../utils/function";
import store from "../../../../../../../store/store";
import { getStatusType } from "../../../../../../../config/constant/statusCode";
import { dashboard } from "../../../../../../../config/constant/routes";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const LeaveAddRequest = observer(() => {
  const navigate = useNavigate()
  const {auth : {openNotification, user}, requestStore : {createRequest}} = store
  const [requestType, setRequestType] = useState('submit')
  const [showError, setShowError] = useState(false);

  const handleSubmit = ({ values, setSubmitting, resetForm }: any) => {
    generateResponse(values)
    createRequest(generateResponse({...values, user : user._id}))
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
          title: "Create Failed",
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
        <IconButton aria-label="" onClick={() => navigate(dashboard.request.index)}><ArrowBackIcon fontSize="xl"/></IconButton>
        <Heading fontSize="2xl" borderColor="gray.800" ml={3}>
          Add Request
        </Heading>
      </Flex>
      <Divider color="lightgray" borderWidth={1}/>
      <LeaveRequestForm
        initialValues={generateRequestInitialValues(null)}
        showError={showError}
        setShowError={setShowError}
        close={() => {}}
        handleSubmit={handleSubmit}
        setRequestType={setRequestType}
        requestType={requestType}
      />
    </Card>
  );
});

export default LeaveAddRequest;
