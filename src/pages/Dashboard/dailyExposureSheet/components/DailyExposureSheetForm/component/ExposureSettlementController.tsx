import axios from "axios";
import { useFormikContext } from "formik";
import { useEffect } from "react";

const ExposureSettlementController = ({
  setPoOptions,
  setInvoiceOptions,
}: {
  setPoOptions: (data: any[]) => void;
  setInvoiceOptions: (data: any[]) => void;
}) => {
  const { values, setFieldValue } = useFormikContext<any>();
const url = process.env.REACT_APP_FX_BASE_URL

  const {
    exposureType,
    poNumber,
    invoiceBcNumber,
    settlementType
  } = values;

  /* --------------------------------------------------
     1️⃣ Fetch PO / Invoice numbers on settlement type
  -------------------------------------------------- */
  useEffect(() => {
    if (!exposureType && !settlementType) return;

    const fetchPoInv = async () => {
      try {
        const res = await axios.post(
          `${url}/exportregister/exprtimprtpoinvnum/`,
          { exposureType,settlementType }
        );

        if (res.data?.status === "success") {
          setPoOptions(
            res.data.data.poNum.map((po: string) => ({
              label: po,
              value: po,
            }))
          );

          setInvoiceOptions(
            res.data.data.invNum.map((inv: string) => ({
              label: inv,
              value: inv,
            }))
          );

          // Reset dependent fields
          setFieldValue("poNumber", "");
          setFieldValue("invoiceBcNumber", "");
        }
      } catch (error) {
        console.error("PO/Invoice fetch failed", error);
        setPoOptions([]);
        setInvoiceOptions([]);
      }
    };

    fetchPoInv();
  }, [exposureType,settlementType]);

  /* --------------------------------------------------
     2️⃣ Auto-populate exposure data
  -------------------------------------------------- */
  useEffect(() => {
    if (!exposureType) return;
    if (!poNumber && !invoiceBcNumber) return;

    const fetchExposureData = async () => {
      try {
        const res = await axios.post(
          `${url}/exportregister/expimpexposuredata/`,
          {
            exposureType,
            poNum: poNumber || "",
            invNum: invoiceBcNumber || "",
          }
        );

        if (
          res.data?.status === "success" &&
          res.data?.data?.length
        ) {
          const d = res.data.data[0];

          setFieldValue("partyName", d.partyName || "");
          setFieldValue("businessUnit", d.businessUnit || "");
          setFieldValue("bank", d.bank || "");
          setFieldValue("currency", d.currency || "");
          setFieldValue("outstandingAmount", d.outstandingAmount || "");
          setFieldValue("documentDueDate", d.dueDate || "");
        }
      } catch (error) {
        console.error("Exposure data fetch failed", error);

        setFieldValue("partyName", "");
        setFieldValue("businessUnit", "");
        setFieldValue("bank", "");
        setFieldValue("currency", "");
        setFieldValue("outstandingAmount", "");
        setFieldValue("documentDueDate", "");
      }
    };

    fetchExposureData();
  }, [poNumber, invoiceBcNumber]);

  return null;
};

export default ExposureSettlementController;
