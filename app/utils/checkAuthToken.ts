import axios from 'axios';
import { baseApiUrl } from '../../eas.config';
import { HeaderKeys } from './constants';

const checkIsAuthTokenValid = async (
  authToken: string,
  clinicId: string | null | undefined,
): Promise<boolean> => {
  try {
    const headers = {
      [HeaderKeys.authorization]: authToken ?? '',
    };
    if (clinicId) {
      headers[HeaderKeys.clinicId] = clinicId;
    }
    // check if user is authenticated
    const url = `${baseApiUrl}/auth/check${clinicId ? '' : '/token'}`;
    await axios.get(url, { headers });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default checkIsAuthTokenValid;
