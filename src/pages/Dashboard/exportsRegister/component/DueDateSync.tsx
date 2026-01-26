import { useEffect } from "react";
import { useFormikContext } from "formik";
import { calculateDueDate } from "./utils/function";

const DueDateSync = () => {
  const { values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    const { blDate, paymentTerms } = values;

    if (blDate && paymentTerms) {
      const dueDate = calculateDueDate(
        blDate,
        Number(paymentTerms)
      );

      setFieldValue("dueDate", dueDate, false);
    } else {
      setFieldValue("dueDate", "", false);
    }
  }, [values.blDate, values.paymentTerms]);

  return null;
};

export default DueDateSync;
