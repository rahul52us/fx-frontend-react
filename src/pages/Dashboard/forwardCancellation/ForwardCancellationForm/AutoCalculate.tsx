import { useFormikContext } from "formik";
import { useEffect } from "react";


const AutoCalculation = () => {
  const { values, setFieldValue } = useFormikContext<any>();
  useEffect(() => {
    const cancellationAmt = parseFloat(values.cancellationAmount || "0");
    const bookedRate = parseFloat(values.bookedRate || "0");
    const fwdPremium = parseFloat(values.fwdPremium || "0");
    const cashTomSpot = parseFloat(values.cashTomSpot || "0");
    const bankMargin = parseFloat(values.bankMargin || "0");

    // Example Net Cancellation Rate formula
    const netRate = bookedRate + fwdPremium + cashTomSpot - bankMargin;
    // Example P/L in FCY
    const plFCY = cancellationAmt * (bookedRate - netRate);
    // Example P/L in INR
    const washRate = parseFloat(values.washRate || "1");

    const plINR =
      values.currency === "INR" ? plFCY : plFCY * washRate;

    if (!isNaN(netRate)) setFieldValue("netCancellationRate", netRate.toFixed(2));
    if (!isNaN(plFCY)) setFieldValue("plInFCY", plFCY.toFixed(2));
    if (!isNaN(plINR)) setFieldValue("plInINR", plINR.toFixed(2));
  }, [
    values.cancellationAmount,
    values.bookedRate,
    values.fwdPremium,
    values.cashTomSpot,
    values.bankMargin,
    values.currency,
    values.washRate,
    setFieldValue,
  ]);
  return null;
};

export default AutoCalculation