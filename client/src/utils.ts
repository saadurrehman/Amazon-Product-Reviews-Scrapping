import { BACKEND_PATH } from "./constants";
import type { DropDownValues } from "./type";

export const getServerUrl = (dropdownValue: string) => {
  switch (dropdownValue) {
    case "excel":
      return `${BACKEND_PATH}?key=${dropdownValue}`;
    case "pdf":
      return `${BACKEND_PATH}?key=${dropdownValue}`;

    default:
      return BACKEND_PATH;
  }
};

export const getSVGName = (dropdownValue: DropDownValues) => {
  switch (dropdownValue) {
    case "excel":
      return "icons8-excel.svg";
    case "pdf":
      return "pdf-svgrepo-com.svg";
    case "both":
      return "excel-removebg-preview.png";

    default:
      return "excel-removebg-preview.png";
  }
};

export const createAnchorButton = (
  data: string,
  type: string,
  filename: string
) => {
  if (!data) return;
  const uint8ArrayData = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));

  // Create a Blob from the Uint8Array data
  const blob = new Blob([uint8ArrayData], { type });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a download link for the Blob and trigger the download
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.id = filename;
  downloadLink.download = filename; // 'reviews.pdf';
  downloadLink.click();

  URL.revokeObjectURL(url);
};
