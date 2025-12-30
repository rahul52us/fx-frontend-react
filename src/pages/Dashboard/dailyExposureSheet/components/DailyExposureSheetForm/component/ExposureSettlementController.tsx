import axios from "axios";
import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";

const ExposureSettlementController = ({
  setPoOptions,
  setInvoiceOptions,
  setIsPoDisabled,
  setIsInvoiceDisabled,
}: {
  setPoOptions: (data: any[]) => void;
  setInvoiceOptions: (data: any[]) => void;
  setIsPoDisabled: any;
  setIsInvoiceDisabled: any;
}) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const url = process.env.REACT_APP_FX_BASE_URL;

  const {
    exposureType,
    settlementType,
    poNumber,
    invoiceBcNumber,
  } = values;

  const exposureFetchLock = useRef(false);

  /* --------------------------------------------------
     0️⃣ RESET on Exposure / Settlement change
  -------------------------------------------------- */
  useEffect(() => {
    setFieldValue("poNumber", "");
    setFieldValue("invoiceBcNumber", "");

    setFieldValue("partyName", "");
    setFieldValue("businessUnit", "");
    setFieldValue("bank", "");
    setFieldValue("currency", "");
    setFieldValue("outstandingAmount", "");
    setFieldValue("dueDate", "");

    setPoOptions([]);
    setInvoiceOptions([]);

    setIsPoDisabled(false);
    setIsInvoiceDisabled(false);

    exposureFetchLock.current = false;
  }, [exposureType, settlementType]);

  /* --------------------------------------------------
     1️⃣ PO ↔ Invoice mutual exclusivity + disable
  -------------------------------------------------- */
  useEffect(() => {
    if (poNumber) {
      setFieldValue("invoiceBcNumber", "");
      setIsInvoiceDisabled(true);
      setIsPoDisabled(false);
    } else if (invoiceBcNumber) {
      setFieldValue("poNumber", "");
      setIsPoDisabled(true);
      setIsInvoiceDisabled(false);
    } else {
      // none selected
      setIsPoDisabled(false);
      setIsInvoiceDisabled(false);
    }

    // clear auto-populated exposure data on switch
    setFieldValue("partyName", "");
    setFieldValue("businessUnit", "");
    setFieldValue("bank", "");
    setFieldValue("currency", "");
    setFieldValue("outstandingAmount", "");
    setFieldValue("dueDate", "");

    exposureFetchLock.current = false;
  }, [poNumber, invoiceBcNumber]);

  /* --------------------------------------------------
     2️⃣ Fetch PO / Invoice numbers
  -------------------------------------------------- */
  useEffect(() => {
    if (!exposureType || !settlementType) return;

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
     3️⃣ Fetch Exposure Data (LOCKED)
  -------------------------------------------------- */
  useEffect(() => {
    if (
      !exposureType ||
      !settlementType ||
      (!poNumber && !invoiceBcNumber)
    ) {
      return;
    }

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
          setFieldValue("dueDate", d.dueDate || "");
        }
      } catch (error) {
        console.error("Exposure data fetch failed", error);
      } finally {
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
