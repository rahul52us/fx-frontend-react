import React from "react";
import CustomTable from "../../../../config/component/CustomTable/CustomTable";

interface SummaryTableProps {
  data: any;
  loading: boolean;
  exposureType: string;
  onViewDetails: (details: any[]) => void;
}

const SummaryTable: React.FC<SummaryTableProps> = ({ data, loading, exposureType, onViewDetails }) => {
  const getColumns = () => {
    if (exposureType === "export") {
      return [
        { headerName: "Month-Year", key: "monthYear" },
        { headerName: "Total Export Conversion", key: "totalExportConversion" },
        { headerName: "Settlement Rate", key: "settlementRate" },
        { headerName: "Average BMK Rate", key: "averageBmkRate" },
        { headerName: "BMK vs Settlement Rate", key: "bmkVsSettlementRate" },
        { headerName: "Spot on Settlement Date", key: "spotOnSettlementDate" },
        { headerName: "Spot vs Settlement Rate", key: "spotOnSettlementVsSettlementRate" },
        { headerName: "P/L on Forward Cancellation", key: "plOnForwardCancellation" },
        { headerName: "Net P/L", key: "netPl" },
        {
          headerName: "Actions",
          key: "table-actions",
          type: "table-actions",
        }
      ];
    }

    if (exposureType === "import") {
      return [
        { headerName: "Month-Year", key: "monthYear" },
        { headerName: "Total Import Conversion", key: "totalImportConversion" },
        { headerName: "Settlement Rate", key: "settlementRate" },
        { headerName: "Average BMK Rate", key: "averageBmkRate" },
        { headerName: "BMK vs Settlement Rate", key: "bmkVsSettlementRate" },
        { headerName: "Spot on Settlement Date", key: "spotOnSettlementDate" },
        { headerName: "Market vs Settlement Rate", key: "marketVsSettlementRate" },
        { headerName: "P/L on Forward Cancellation", key: "plOnForwardCancellation" },
        { headerName: "Net P/L", key: "netPl" },
        {
          headerName: "Actions",
          key: "table-actions",
          type: "table-actions",
        }
      ];
    }

    return [
        { headerName: "Month-Year", key: "monthYear" },
        { headerName: "BMK vs Settlement Rate", key: "bmkVsSettlementRate" },
        { headerName: "Market vs Settlement Rate", key: "marketVsSettlementRate" },
        { headerName: "P/L on Forward Cancellation", key: "plOnForwardCancellation" },
        { headerName: "Net P/L", key: "netPl" },
        {
          headerName: "Actions",
          key: "table-actions",
          type: "table-actions",
        }
    ];
  };

  return (
    <CustomTable
      title={`${exposureType.charAt(0).toUpperCase() + exposureType.slice(1)} Summary`}
      columns={getColumns()}
      data={data || []}
      loading={loading}
      actions={{
        actionBtn: {
          viewKey: {
            showViewButton: true,
            function: (row: any) => {
              if (exposureType === "total") {
                onViewDetails(row); // Pass the whole row for total
              } else {
                onViewDetails(row.details || []);
              }
            },
          },
        },
      }}
    />
  );
};

export default SummaryTable;
