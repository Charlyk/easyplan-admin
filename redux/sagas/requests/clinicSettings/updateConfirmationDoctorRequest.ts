import { AxiosResponse } from 'axios';
import { updateConfirmationDoctorSettings } from 'middleware/api/clinic';
import { ClinicSettings } from 'types';

export async function requestUpdateConfirmationDoctor(
  showDoctor: boolean,
): Promise<AxiosResponse<ClinicSettings>> {
  return updateConfirmationDoctorSettings(showDoctor);
}
