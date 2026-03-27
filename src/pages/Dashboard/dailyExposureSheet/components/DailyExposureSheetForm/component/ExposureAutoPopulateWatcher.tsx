import { useEffect } from "react";
import { useFormikContext } from "formik";
import axios from "axios";

const ExposureAutoPopulateWatcher = () => {
  const { values, setFieldValue } = useFormikContext<any>();
const url = process.env.REACT_APP_FX_BASE_URL

  const {
    settlementType,
    poNumber,
    invoiceBcNumber,
  } = values;

  useEffect(() => {
    // 🚫 Don't call API until required fields exist
    if (!settlementType) return;
    if (!poNumber && !invoiceBcNumber) return;

    const fetchExposureData = async () => {
      try {
        const res = await axios.post(
          `${url}/exportregister/expimpexposuredata/`,
          {
            settlementType,
            poNum: poNumber || "",
            invNum: invoiceBcNumber || "",
          }
        );

        if (
          res.data?.status === "success" &&
          res.data?.data?.length
        ) {
          const data = res.data.data[0];

          setFieldValue("partyName", data.partyName || "");
          setFieldValue("businessUnit", data.businessUnit || "");
          setFieldValue("bank", data.bank || "");
          setFieldValue("currency", data.currency || "");
        }
      } catch (error) {
        console.error("Failed to fetch exposure data", error);

        // Optional: clear auto-populated fields on error
        setFieldValue("partyName", "");
        setFieldValue("businessUnit", "");
        setFieldValue("bank", "");
        setFieldValue("currency", "");
      }
    };

    fetchExposureData();
  }, [settlementType, poNumber, invoiceBcNumber, setFieldValue, url]);

  return null; // 👈 watcher only
};

export default ExposureAutoPopulateWatcher;
