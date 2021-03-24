import { getCurrentUser } from "./auth";
import { getClinicDetails } from "./clinic";

export async function fetchAppData(headers = null) {
  const { data: user } = await getCurrentUser(headers);
  const { data: clinic } = await getClinicDetails(headers);
  return {
    currentUser: user,
    currentClinic: clinic,
  };
}
