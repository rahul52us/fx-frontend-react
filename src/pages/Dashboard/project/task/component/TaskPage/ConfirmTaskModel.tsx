import { observer } from "mobx-react-lite";
import SubmitFormBtn from "../../../../../../config/component/Button/SubmitFormBtn";
import { Text, useColorModeValue, VStack } from "@chakra-ui/react";
import FormModel from "../../../../../../config/component/common/FormModel/FormModel";
import store from "../../../../../../store/store";
import { useState } from "react";
import { getStatusType } from "../../../../../../config/constant/statusCode";

const ConfirmTaskModel = observer(
  ({ openConfirmModel, setOpenConfirmModel,fetchRecords }: any) => {
    const [isSubmitting, setSubmitting] = useState(false);
    const {
      Project: { updateTask },
      auth: { openNotification },
    } = store;
    const handleSubmit = () => {
      if (openConfirmModel.data) {
        setSubmitting(true)
        updateTask({
          _id: openConfirmModel?.data?._id,
          projectId: openConfirmModel.data.projectId,
          status: openConfirmModel.destinationColumn,
        })
          .then((data: any) => {
            fetchRecords()
            openNotification({
              title: "Successfully Updated",
              message: `${data.message}`,
              type: "success",
            });
            setOpenConfirmModel({
              data: null,
              open: false,
              sourceColumn: "",
              destinationColumn: "",
            });
          })
          .catch((err) => {
            openNotification({
              title: "Update Failed",
              message: err?.data?.message,
              type: getStatusType(err.status),
            });
          })
          .finally(() => {
            setSubmitting(false);
          });
      }
    };

    return (
      <FormModel
        title="Confirm Status Change"
        isCentered
        open={openConfirmModel.open}
        size="lg"
        close={() =>
          setOpenConfirmModel({
            data: null,
            open: false,
            sourceColumn: "",
            destinationColumn: "",
          })
        }
      >
        <VStack
          spacing={4}
          align="stretch"
          p={4}
          bg={useColorModeValue("white", "gray.700")}
          borderRadius="md"
        >
          <Text
            fontSize="lg"
            fontWeight="semibold"
            textAlign="center"
            color={useColorModeValue("black", "white")}
          >
            Are you sure you want to move task
            <Text
              as="span"
              fontWeight="bold"
              color={useColorModeValue("blue.500", "blue.300")}
            >
              {` "${openConfirmModel.data?.title}"`}
            </Text>{" "}
            from
            <Text
              as="span"
              fontWeight="bold"
              color={useColorModeValue("blue.500", "blue.300")}
            >
              {` "${openConfirmModel.sourceColumn}"`}
            </Text>{" "}
            to
            <Text
              as="span"
              fontWeight="bold"
              color={useColorModeValue("blue.500", "blue.300")}
            >
              {` "${openConfirmModel.destinationColumn}"`}
            </Text>
            ?
          </Text>
          <SubmitFormBtn
            loading={isSubmitting}
            onClick={() => handleSubmit()}
            buttonText="Confirm"
            cancelFunctionality={{
              show: true,
              onClick: () =>
                setOpenConfirmModel({
                  data: null,
                  open: false,
                  sourceColumn: "",
                  destinationColumn: "",
                }),
            }}
          />
        </VStack>
      </FormModel>
    );
  }
);

export default ConfirmTaskModel;
