import { useFormikContext } from "formik";
import { useEffect } from "react";

const AutoCalculation = () => {
  const { values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    const spotBooked   = parseFloat(values.spotBooked     || "0");
    const fwdPremium   = parseFloat(values.fwdPremium     || "0");
    const cashTomSpot  = parseFloat(values.cashTomSpot    || "0");
    const bankMargin   = parseFloat(values.bankMargin     || "0");
    const cancellationAmt = parseFloat(values.cancellationAmount || "0");
    const bookedRate   = parseFloat(values.bookedRate     || "0");
    const washRate     = parseFloat(values.washRate       || "1");
    const exposureType = (values.exposureType || "").toLowerCase();

    // ✅ Net Cancellation Rate formula:
    // spotBooked + fwdPremium - cashTomSpot → then +bankMargin (export) or -bankMargin (import)
    let netRate = spotBooked + fwdPremium - cashTomSpot;

    if (exposureType === "export") {
      netRate += bankMargin;
    } else if (exposureType === "import") {
      netRate -= bankMargin;
    }

    // P/L in FCY
    const plFCY = cancellationAmt * (bookedRate - netRate);

    // P/L in INR
    const plINR = values.currency === "INR" ? plFCY : plFCY * washRate;

    if (!isNaN(netRate)) setFieldValue("netCancellationRate", netRate.toFixed(2));
    if (!isNaN(plFCY))   setFieldValue("plInFCY", plFCY.toFixed(2));
    if (!isNaN(plINR))   setFieldValue("plInINR", plINR.toFixed(2));
  }, [
    values.spotBooked,
    values.fwdPremium,
    values.cashTomSpot,
    values.bankMargin,
    values.exposureType,
    values.cancellationAmount,
    values.bookedRate,
    values.currency,
    values.washRate,
    setFieldValue,
  ]);

  return null;
};

export default AutoCalculation;