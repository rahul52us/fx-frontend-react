import { useEffect } from "react";
import { useFormikContext } from "formik";

const FormAutoCalculator = () => {
  const { values, setFieldValue }: any = useFormikContext();

  // A. Total Interest Rate
  useEffect(() => {
    const floatRate = parseFloat(values.floatingInterestRate) || 0;
    const spread = parseFloat(values.bankSpread) || 0;

    const totalInterest = (floatRate + spread).toFixed(2);

    if (values.totalInterestRate !== totalInterest) {
      setFieldValue("totalInterestRate", totalInterest);
    }
  }, [
    values.floatingInterestRate,
    values.bankSpread,
    values.totalInterestRate,
    setFieldValue,
  ]);

  // B. Spot + Forward Weighted Drawdown Rate
  useEffect(() => {
    let totalAmount = 0;
    let weightedSum = 0;

    // Spot
    if (values.isSpotEnabled && values.spotList?.length) {
      values.spotList.forEach((item: any) => {
        const amt = parseFloat(item.amountConverted) || 0;
        const rate = parseFloat(item.netConversionRate) || 0;

        totalAmount += amt;
        weightedSum += amt * rate;
      });
    }

    // Forward
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

    if (Number(values.drawdownAmount) !== totalAmount) {
      setFieldValue("drawdownAmount", totalAmount.toFixed(2));
    }

    if (values.drawdownRate !== avgRate) {
      setFieldValue("drawdownRate", avgRate);
    }
  }, [
    values.isSpotEnabled,
    values.isForwardEnabled,
    values.spotList,
    values.forwardList,
    values.drawdownAmount,
    values.drawdownRate,
    setFieldValue,
  ]);

  return null; // logic-only component
};

export default FormAutoCalculator;
