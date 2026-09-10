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

//   // Calculate column widths
//   const colWidths = headers.map((header, colIndex) => {
//     const maxContentWidth = worksheetData.reduce((maxWidth, row) => {
//       const cellValue = String(row[colIndex] ?? "");
//       return Math.max(maxWidth, cellValue.length);
//     }, header.length);
//     return { wch: maxContentWidth + 2 }; // +2 for padding
//   });

//   worksheet["!cols"] = colWidths;

//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Export");

//   XLSX.writeFile(workbook, fileName);
// }


export function exportToExcel({
  data,
  fileName = "export.xlsx",
}: {
  data: Record<string, any>[];
  fileName?: string;
}) {
  if (!data.length) {
    console.warn("No data to export.");
    return;
  }

  // Get headers directly from the first row's keys
  const headers = Object.keys(data[0]);
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

  // Auto column widths
  const colWidths = headers.map((header, colIndex) => {
    const maxContentWidth = worksheetData.reduce((maxWidth, row) => {
      const cellValue = String(row[colIndex] ?? "");
      return Math.max(maxWidth, cellValue.length);
    }, header.length);
    return { wch: maxContentWidth + 2 };
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



export   const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Try to parse and format the date
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch (error) {
      console.error("Error formatting date:", error);
    }
    
    return "";
  };

//   export const calculateDueDate = (blDate: string, paymentTerms: number) => {
//   if (!blDate || !paymentTerms) return "";

//   const date = new Date(blDate);
//   date.setDate(date.getDate() + Number(paymentTerms));

//   return date.toISOString().split("T")[0]; // YYYY-MM-DD
// };


export const calculateDueDate = (
  blDate: string,
  paymentTerms: number
) => {
  if (!blDate || !paymentTerms) return "";

  const date = new Date(blDate);
  if (isNaN(date.getTime())) return "";

  date.setDate(date.getDate() + Number(paymentTerms));

  return date.toISOString().split("T")[0];
};

export const normalizeDate = (value?: string | Date) => {
  if (!value) return "";

  // 1️⃣ Date object → ISO
  if (value instanceof Date) {
    if (isNaN(value.getTime())) return "";
    return value.toISOString().split("T")[0];
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    // 2️⃣ dd.mm.yyyy → yyyy-mm-dd
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(trimmed)) {
      const [day, month, year] = trimmed.split(".");
      return `${year}-${month}-${day}`;
    }

    // 3️⃣ dd-mm-yyyy → yyyy-mm-dd
    if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
      const [day, month, year] = trimmed.split("-");
      return `${year}-${month}-${day}`;
    }

    // 4️⃣ yyyy-mm-dd → accept ONLY this
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
  }

  return ""; // ⛑️ hard stop – prevents datepicker crash
};


// export const normalizeDate = (value?: string | Date) => {
//   if (!value) return "";

//   // already Date
//   if (value instanceof Date && !isNaN(value.getTime())) {
//     return value.toISOString().split("T")[0];
//   }

//   if (typeof value === "string") {
//     // dd.mm.yyyy → yyyy-mm-dd
//     if (value.includes(".")) {
//       const [day, month, year] = value.split(".");
//       if (day && month && year) {
//         return `${year}-${month}-${day}`;
//       }
//     }

//     // yyyy-mm-dd (already valid)
//     if (!isNaN(new Date(value).getTime())) {
//       return value;
//     }
//   }

//   return ""; // ⛑️ SAFE FALLBACK
// };

export const updateDueDate = (
  blDate: string,
  paymentTerms: number,
  setFieldValue: any
) => {
  if (blDate && paymentTerms) {
    setFieldValue(
      "dueDate",
      calculateDueDate(blDate, paymentTerms)
    );
  } else {
    setFieldValue("dueDate", "");
  }
};

export const normalizeExcelDate = (value: any): string => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  // Excel serial date number
  if (typeof value === "number") {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(
      excelEpoch.getTime() + value * 24 * 60 * 60 * 1000
    );

    return date.toISOString().slice(0, 10);
  }

  // JS Date object
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  // String date
  const stringValue = String(value).trim();

  if (!stringValue) {
    return "";
  }

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
    return stringValue;
  }

  const date = new Date(stringValue);

  if (!isNaN(date.getTime())) {
    return date.toISOString().slice(0, 10);
  }

  return "";
};
