import axios from "axios";
import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";

const ExposureSettlementController = ({
  setPoOptions,
  setInvoiceOptions,
}: {
  setPoOptions: (data: any[]) => void;
  setInvoiceOptions: (data: any[]) => void;
}) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const url = process.env.REACT_APP_FX_BASE_URL;

  const {
    exposureType,
    settlementType,
    poNumber,
    invoiceBcNumber,
  } = values;

  // 🔒 Ref lock to prevent duplicate API calls
  const exposureFetchLock = useRef(false);

  /* --------------------------------------------------
     1️⃣ Fetch PO / Invoice Numbers
     Only when BOTH exposureType & settlementType exist
  -------------------------------------------------- */
  useEffect(() => {
    if (!exposureType || !settlementType) {
      setPoOptions([]);
      setInvoiceOptions([]);
      return;
    }

    const fetchPoInv = async () => {
      try {
        const res = await axios.post(
          `${url}/exportregister/exprtimprtpoinvnum/`,
          { exposureType, settlementType }
        );

        if (res.data?.status === "success") {
          setPoOptions(
            (res.data.data.poNum || []).map((po: string) => ({
              label: po,
              value: po,
            }))
          );

          setInvoiceOptions(
            (res.data.data.invNum || []).map((inv: string) => ({
              label: inv,
              value: inv,
            }))
          );

          // reset dependent selections
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
  }, [exposureType, settlementType]);

  /* --------------------------------------------------
     2️⃣ Fetch Exposure Data (LOCKED)
  -------------------------------------------------- */
  useEffect(() => {
    // 🔐 Hard guards
    if (
      !exposureType ||
      !settlementType ||
      (!poNumber && !invoiceBcNumber)
    ) {
      return;
    }

    // 🔒 Prevent duplicate calls
    if (exposureFetchLock.current) return;
    exposureFetchLock.current = true;

    const fetchExposureData = async () => {
      try {
        const payload = {
          exposureType,
          settlementType,
          poNum: poNumber || "",
          invNum: invoiceBcNumber || "",
        };

        const res = await axios.post(
          `${url}/exportregister/expimpexposuredata/`,
          payload
        );

        if (res.data?.status === "success" && res.data.data?.length) {
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
      } finally {
        // 🔓 Release lock
        exposureFetchLock.current = false;
      }
    };

    fetchExposureData();
  }, [
    exposureType,
    settlementType,
    poNumber,
    invoiceBcNumber,
  ]);

  return null;
};

export default ExposureSettlementController;
