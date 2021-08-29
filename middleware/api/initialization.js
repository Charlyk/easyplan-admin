import { getCurrentUser } from "./auth";
import { getClinicDetails } from "./clinic";

export async function fetchAppData(headers = null, date = null) {
  const { data: user } = await getCurrentUser(headers);
  const { data: clinic } = await getClinicDetails(date, headers);
  return {
    currentUser: user,
    currentClinic: clinic,
  };
}
