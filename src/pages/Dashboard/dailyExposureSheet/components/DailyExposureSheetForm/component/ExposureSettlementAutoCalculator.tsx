import { useEffect } from "react";
import { useFormikContext } from "formik";

const ExposureSettlementAutoCalculator = () => {
  const { values, setFieldValue }: any = useFormikContext();

  useEffect(() => {
    let totalAmount = 0;
    let weightedSum = 0;

    const add = (amount: any, rate: any) => {
      const amt = parseFloat(amount) || 0;
      const rt = parseFloat(rate) || 0;

      if (amt > 0) {
        totalAmount += amt;
        weightedSum += amt * rt;
      }
    };

    // === SPOT ===
    if (values.isSpotEnabled && values.spotList?.length) {
      values.spotList.forEach((item: any) => {
        add(item.amountConverted, item.netConversionRate);
      });
    }

    // === EEFC EXPORTS ===
    if (values.isEEFCExportsEnabled && values.eefcExportsList?.length) {
      values.eefcExportsList.forEach((item: any) => {
        add(item.utilizationAmount, item.netConversionRate);
      });
    }

    // === EEFC IMPORTS ===
    if (values.isEEFCImportsEnabled && values.eefcImportsList?.length) {
      values.eefcImportsList.forEach((item: any) => {
        add(item.amount, item.settlementRate);
      });
    }

    // === PCFC ===
    if (values.isPCFCEnabled && values.pcfcList?.length) {
      values.pcfcList.forEach((item: any) => {
        add(item.utilizationAmount, item.netDrawdownRate);
      });
    }

    // === FORWARD ===
    if (values.isForwardEnabled && values.forwardList?.length) {
      values.forwardList.forEach((item: any) => {
        add(item.utilizationAmount, item.netSettlementRate);
      });
    }

    const settlementRate =
      totalAmount > 0 ? (weightedSum / totalAmount).toFixed(4) : "";

    const settledAmount = totalAmount > 0 ? totalAmount.toFixed(2) : "";

    const settledAmountInINR =
      totalAmount > 0 && settlementRate
        ? (totalAmount * Number(settlementRate)).toFixed(2)
        : "";

    if (values.settledAmount !== settledAmount) {
      setFieldValue("settledAmount", settledAmount);
    }

    if (values.settlementRate !== settlementRate) {
      setFieldValue("settlementRate", settlementRate);
    }

    if (values.settledAmountInINR !== settledAmountInINR) {
      setFieldValue("settledAmountInINR", settledAmountInINR);
    }
  }, [
    values.isSpotEnabled,
    values.isEEFCExportsEnabled,
    values.isEEFCImportsEnabled,
    values.isPCFCEnabled,
    values.isForwardEnabled,
    values.spotList,
    values.eefcExportsList,
    values.eefcImportsList,
    values.pcfcList,
    values.forwardList,
    values.settledAmount,
    values.settlementRate,
    values.settledAmountInINR,
    setFieldValue,
  ]);

  return null; // logic-only component
};

export default ExposureSettlementAutoCalculator;
