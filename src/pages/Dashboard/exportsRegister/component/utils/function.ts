import * as XLSX from "xlsx";

// export function exportToExcel({
//   columns,
//   data,
//   fileName = "export.xlsx",
// }: {
//   columns: { key: string; headerName: string }[];
//   data: Record<string, any>[];
//   fileName?: string;
// }) {
//   if (!columns.length || !data.length) {
//     console.warn("No columns or data to export.");
//     return;
//   }

//   // Use keys (not headerName) as headers
//   const headers = columns.map((col) => col.key);
//   const keys = headers;

//   const rows = data.map((row) =>
//     keys.map((key) => {
//       const value = row[key];
//       return typeof value === "string" || typeof value === "number"
//         ? value
//         : JSON.stringify(value ?? "");
//     })
//   );

//   const worksheetData = [headers, ...rows];

//   const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Export");

//   XLSX.writeFile(workbook, fileName);
// }


// import * as XLSX from "xlsx";

export function exportToExcel({
  columns,
  data,
  fileName = "export.xlsx",
}: {
  columns: { key: string; headerName: string }[];
  data: Record<string, any>[];
  fileName?: string;
}) {
  if (!columns.length || !data.length) {
    console.warn("No columns or data to export.");
    return;
  }

  const headers = columns.map((col) => col.key);
  const keys = headers;

  const rows = data.map((row) =>
    keys.map((key) => {
      const value = row[key];
      return typeof value === "string" || typeof value === "number"
        ? value
        : JSON.stringify(value ?? "");
    })
  );

  const worksheetData = [headers, ...rows];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Calculate column widths
  const colWidths = headers.map((header, colIndex) => {
    const maxContentWidth = worksheetData.reduce((maxWidth, row) => {
      const cellValue = String(row[colIndex] ?? "");
      return Math.max(maxWidth, cellValue.length);
    }, header.length);
    return { wch: maxContentWidth + 2 }; // +2 for padding
  });

  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Export");

  XLSX.writeFile(workbook, fileName);
}



export function importFromExcel(file: File): Promise<Record<string, any>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target?.result;
      if (!data) {
        reject("File data could not be read.");
        return;
      }

      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON using first row as keys
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        defval: "", // fallback for empty cells
      });

      resolve(jsonData as Record<string, any>[]);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsBinaryString(file);
  });
}

