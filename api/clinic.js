import Axios from "axios";
import { baseURL } from './schedules';

export async function fetchClinicDetails(clinicId, token) {
  try {
    const headers = {
      Authorization: token,
      'X-EasyPlan-Clinic-Id': clinicId,
    };
    const response = await Axios.get(
      `${baseURL}/clinics/details`,
      { headers }
    );
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
