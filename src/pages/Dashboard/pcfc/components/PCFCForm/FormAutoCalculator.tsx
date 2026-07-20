import { useEffect } from "react";
import { useFormikContext } from "formik";

const FormAutoCalculator = () => {
  const { values, setFieldValue }: any = useFormikContext();

  // A. Total Interest Rate
  useEffect(() => {
    const floatRate = parseFloat(values.floatingInterestRate) || 0;
    const spread = parseFloat(values.bankSpread) || 0;
    const totalInterest = (floatRate + spread).toFixed(2);

    if (String(values.totalInterestRate) !== totalInterest) {
      setFieldValue("totalInterestRate", totalInterest, false);
    }
  }, [values.floatingInterestRate, values.bankSpread, setFieldValue]);

  // B. Spot + Forward Weighted Drawdown Rate
  useEffect(() => {
    let totalAmount = 0;
    let weightedSum = 0;

    if (values.isSpotEnabled && values.spotList?.length) {
      values.spotList.forEach((item: any) => {
        const amt = parseFloat(item.amountConverted) || 0;
        const rate = parseFloat(item.netConversionRate) || 0;

        totalAmount += amt;
        weightedSum += amt * rate;
      });
    }

    if (values.isForwardEnabled && values.forwardList?.length) {
      values.forwardList.forEach((item: any) => {
        const amt = parseFloat(item.utilizationAmount) || 0;
        const rate = parseFloat(item.netSettlementRate) || 0;

        totalAmount += amt;
        weightedSum += amt * rate;
      });
    }

    const avgRate =
      totalAmount > 0 ? (weightedSum / totalAmount).toFixed(4) : "0";
    const nextDrawdownAmount = totalAmount.toFixed(2);

    if (Number(values.drawdownAmount) !== totalAmount) {
      setFieldValue("drawdownAmount", nextDrawdownAmount, false);
    }

    if (String(values.drawdownRate) !== avgRate) {
      setFieldValue("drawdownRate", avgRate, false);
    }
  }, [
    values.isSpotEnabled,
    values.isForwardEnabled,
    values.spotList,
    values.forwardList,
    setFieldValue,
  ]);

  return null; // logic-only component
};

export default FormAutoCalculator;
