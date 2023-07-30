import axios, { type AxiosResponse } from "axios";
import type { ApiResponse, DropDownValues } from "../type";
import { createAnchorButton, getServerUrl } from "../utils";

export const handleScrapping = async (
  dropdownValue: DropDownValues,
  link: string
) => {
  try {
    const { data }: AxiosResponse<ApiResponse> = await axios.post(
      getServerUrl(dropdownValue),
      {
        url: link,
      }
    );

    data?.pdf && createAnchorButton(data?.pdf, "application/pdf", "review.pdf");
    data?.excel &&
      createAnchorButton(
        data?.excel,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "data.xlsx"
      );
  } catch (err) {
    throw err;
  }
};
