import { useEffect } from "react";
import { useFormikContext } from "formik";

const SpotForwardCalculation = () => {
  const { values, setFieldValue }: any = useFormikContext();

  /* ----------------------------------------------------
     A. Total Interest Rate
  ---------------------------------------------------- */
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

  /* ----------------------------------------------------
     B. Spot Net Conversion Rate
     Net = Spot - Cash/Tom ± Bank Margin (based on exposure type)
  ---------------------------------------------------- */
  useEffect(() => {
    if (!values.spotList?.length) return;
    
    const exposureType = values.exposureType;
    console.log("🔄 SpotForwardCalculation running for spotList with exposure:", exposureType);
    
    values.spotList?.forEach((item: any, index: number) => {
      const spot = parseFloat(item.spotBooked) || 0;
      const cashTom = parseFloat(item.cashTomSpot) || 0;
      const margin = parseFloat(item.bankMargin) || 0;

      let net;
      if (exposureType === "import") {
        net = (spot - cashTom + margin).toFixed(4);  // ADD for import
        // console.log(`Row ${index}: IMPORT calculation: ${spot} - ${cashTom} + ${margin} = ${net}`);
      } else {
        net = (spot - cashTom - margin).toFixed(4);  // SUBTRACT for export
        // console.log(`Row ${index}: EXPORT calculation: ${spot} - ${cashTom} - ${margin} = ${net}`);
      }

      if (item.netConversionRate !== net) {
        setFieldValue(`spotList.${index}.netConversionRate`, net);
      }
    });
  }, [values.spotList, values.exposureType, setFieldValue]); // Added exposureType dependency

  /* ----------------------------------------------------
     C. Forward Net Settlement Rate
     Net = Hedge + Forward Premium + Cash/Tom
  ---------------------------------------------------- */
  useEffect(() => {
    values.forwardList?.forEach((item: any, index: number) => {
      const hedge = parseFloat(item.hedgeRate) || 0;
      const premium = parseFloat(item.forwardPremium) || 0;
      const cashTom = parseFloat(item.cashTomSpot) || 0;

      const net = (hedge - premium - cashTom).toFixed(4);

      if (item.netSettlementRate !== net) {
        setFieldValue(`forwardList.${index}.netSettlementRate`, net);
      }
    });
  }, [values.forwardList, setFieldValue]);

  /* ----------------------------------------------------
     D. Weighted Drawdown Amount & Rate
     W.Avg = Σ(amount × rate) / Σ(amount)
  ---------------------------------------------------- */
  useEffect(() => {
    let totalAmount = 0;
    let weightedSum = 0;

    // Spot contribution
    if (values.isSpotEnabled && values.spotList?.length) {
      values.spotList.forEach((item: any) => {
        const amt = parseFloat(item.amountConverted) || 0;
        const rate = parseFloat(item.netConversionRate) || 0;

        totalAmount += amt;
        weightedSum += amt * rate;
      });
    }

    // Forward contribution
    if (values.isForwardEnabled && values.forwardList?.length) {
      values.forwardList.forEach((item: any) => {
        const amt = parseFloat(item.utilizationAmount) || 0;
        const rate = parseFloat(item.netSettlementRate) || 0;

        totalAmount += amt;
        weightedSum += amt * rate;
      });
    }

    const avgRate =
      totalAmount > 0 ? (weightedSum / totalAmount).toFixed(4) : "0.0000";

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

export default SpotForwardCalculation;





// import { useEffect } from "react";
// import { useFormikContext } from "formik";

// const SpotForwardCalculation = () => {
//   const { values, setFieldValue }: any = useFormikContext();

//   /* ----------------------------------------------------
//      A. Total Interest Rate
//   ---------------------------------------------------- */
//   useEffect(() => {
//     const floatRate = parseFloat(values.floatingInterestRate) || 0;
//     const spread = parseFloat(values.bankSpread) || 0;

//     const totalInterest = (floatRate + spread).toFixed(2);

//     if (values.totalInterestRate !== totalInterest) {
//       setFieldValue("totalInterestRate", totalInterest);
//     }
//   }, [
//     values.floatingInterestRate,
//     values.bankSpread,
//     values.totalInterestRate,
//     setFieldValue,
//   ]);

//   /* ----------------------------------------------------
//      B. Spot Net Conversion Rate
//      Net = Spot + Cash/Tom – Bank Margin
//   ---------------------------------------------------- */
//   useEffect(() => {
//     values.spotList?.forEach((item: any, index: number) => {
//       const spot = parseFloat(item.spotBooked) || 0;
//       const cashTom = parseFloat(item.cashTomSpot) || 0;
//       const margin = parseFloat(item.bankMargin) || 0;

//       const net = (spot - cashTom - margin).toFixed(4);

//       if (item.netConversionRate !== net) {
//         setFieldValue(`spotList.${index}.netConversionRate`, net);
//       }
//     });
//   }, [values.spotList, setFieldValue]);

//   /* ----------------------------------------------------
//      C. Forward Net Settlement Rate
//      Net = Hedge + Forward Premium + Cash/Tom
//   ---------------------------------------------------- */
//   useEffect(() => {
//     values.forwardList?.forEach((item: any, index: number) => {
//       const hedge = parseFloat(item.hedgeRate) || 0;
//       const premium = parseFloat(item.forwardPremium) || 0;
//       const cashTom = parseFloat(item.cashTomSpot) || 0;

//       const net = (hedge - premium - cashTom).toFixed(4);

//       if (item.netSettlementRate !== net) {
//         setFieldValue(`forwardList.${index}.netSettlementRate`, net);
//       }
//     });
//   }, [values.forwardList, setFieldValue]);

//   /* ----------------------------------------------------
//      D. Weighted Drawdown Amount & Rate
//      W.Avg = Σ(amount × rate) / Σ(amount)
//   ---------------------------------------------------- */
//   useEffect(() => {
//     let totalAmount = 0;
//     let weightedSum = 0;

//     // Spot contribution
//     if (values.isSpotEnabled && values.spotList?.length) {
//       values.spotList.forEach((item: any) => {
//         const amt = parseFloat(item.amountConverted) || 0;
//         const rate = parseFloat(item.netConversionRate) || 0;

//         totalAmount += amt;
//         weightedSum += amt * rate;
//       });
//     }

//     // Forward contribution
//     if (values.isForwardEnabled && values.forwardList?.length) {
//       values.forwardList.forEach((item: any) => {
//         const amt = parseFloat(item.utilizationAmount) || 0;
//         const rate = parseFloat(item.netSettlementRate) || 0;

//         totalAmount += amt;
//         weightedSum += amt * rate;
//       });
//     }

//     const avgRate =
//       totalAmount > 0 ? (weightedSum / totalAmount).toFixed(4) : "0.0000";

//     if (Number(values.drawdownAmount) !== totalAmount) {
//       setFieldValue("drawdownAmount", totalAmount.toFixed(2));
//     }

//     if (values.drawdownRate !== avgRate) {
//       setFieldValue("drawdownRate", avgRate);
//     }
//   }, [
//     values.isSpotEnabled,
//     values.isForwardEnabled,
//     values.spotList,
//     values.forwardList,
//     values.drawdownAmount,
//     values.drawdownRate,
//     setFieldValue,
//   ]);

//   return null; // logic-only component
// };

// export default SpotForwardCalculation;
