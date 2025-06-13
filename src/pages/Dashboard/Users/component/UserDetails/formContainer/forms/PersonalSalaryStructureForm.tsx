import { observer } from "mobx-react-lite";
import SalaryStructureForm from "../../../../../salary/salaryStructure/component/SalaryStructureForm";
import { useCallback, useEffect, useState } from "react";
import store from "../../../../../../../store/store";
import { useParams } from "react-router-dom";
import { getStatusType } from "../../../../../../../config/constant/statusCode";

interface SalaryComponent {
  head: string;
  monthlyValue: number;
  yearlyValue: number;
  frequency: "Monthly" | "Yearly";
}

interface SalaryFormValues {
  effectiveFrom: any;
  disbursementFrom: any;
  salaryComponents: SalaryComponent[];
  benefits: SalaryComponent[];
  grossSalary: {
    monthly: number;
    yearly: number;
  };
  ctc: {
    monthly: number;
    yearly: number;
  };
  inHandSalary: number;
  remarks: string;
}

const initialValuess: SalaryFormValues = {
  effectiveFrom: undefined,
  disbursementFrom: undefined,
  salaryComponents: [
    { head: "", monthlyValue: 0, yearlyValue: 0, frequency: "Monthly" },
  ],
  benefits: [
    { head: "", monthlyValue: 0, yearlyValue: 0, frequency: "Monthly" },
  ],
  grossSalary: { monthly: 0, yearly: 0 },
  ctc: { monthly: 0, yearly: 0 },
  inHandSalary: 0,
  remarks: "",
};

const PersonalSalaryStructureForm = observer(() => {
  const [initialValues, setInitialValues] = useState(initialValuess)
  const {
    User: { getSalaryDetailsStructure, updateSalaryStructure },
    auth: { openNotification },
  } = store;
  const [showError, setShowError] = useState(false);
  const { id } = useParams();
  const [fetchExistingRecord, setFetchExistingRecord] = useState<any>(null)

  const getSalaryStructure = useCallback(() => {
    getSalaryDetailsStructure({ user: id })
      .then((data : any) => {
        if(data?.data?.currentSalaryStructure){
          setInitialValues({...data?.data?.currentSalaryStructure, effectiveFrom : new Date(data?.data?.currentSalaryStructure?.effectiveFrom),
            disbursementFrom : new Date(data?.data?.currentSalaryStructure?.disbursementFrom),

          })
          setFetchExistingRecord(data?.data?.currentSalaryStructure)
        }
      })
      .catch((err) => {
        openNotification({
          title: "Update Failed",
          message: err?.data?.message,
          type: getStatusType(err.status),
        });
      })
      .finally(() => {});
  }, [id,getSalaryDetailsStructure,openNotification]);

  useEffect(() => {
    getSalaryStructure();
  }, [getSalaryStructure]);

  const handleSubmit = ({ values, setSubmitting }: any) => {

    updateSalaryStructure({ user: id, id : fetchExistingRecord ? fetchExistingRecord?._id : undefined, ...values })
      .then((data: any) => {
        openNotification({
          title: "Successfully Updated",
          message: `${data.message}`,
          type: "success",
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
        setSubmitting(false)
      });
  };

  console.log(fetchExistingRecord)

  return (
    <div>
      <SalaryStructureForm
        initialValues={initialValues}
        showError={showError}
        setShowError={setShowError}
        handleSubmit={handleSubmit}
      />
    </div>
  );
});

export default PersonalSalaryStructureForm;
