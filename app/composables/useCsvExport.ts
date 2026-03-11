export const useCsvExport = () => {
  const exportToCsv = (filename: string, data: any[]) => {
    if (!data || !data.length) {
      alert("No data to export");
      return;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(","), // header row
      ...data.map(item => {
        return headers.map(header => {
          let value = item[header];
          
          // Handle null/undefined
          if (value === null || value === undefined) value = "";
          
          // Handle objects/arrays (e.g. nested data)
          if (typeof value === "object") value = JSON.stringify(value);
          
          // Escape quotes and wrap in quotes if contains comma
          const stringValue = String(value).replace(/"/g, '""');
          return stringValue.includes(",") ? `"${stringValue}"` : stringValue;
        }).join(",");
      })
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    exportToCsv
  };
};