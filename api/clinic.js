import Axios from "axios";
import { baseURL } from "../src/utils/api/dataAPI";

export async function fetchClinicDetails(headers) {
  try {
    const response = await Axios.get(`${baseURL}/clinics/details`, { headers });
    const { data: responseData } = response;
    if (responseData == null) {
      return {
        isError: true,
        message: 'something_went_wrong',
      };
    }
    return responseData;
  } catch (e) {
    return {
      isError: true,
      message: e.message,
    };
  }
}
