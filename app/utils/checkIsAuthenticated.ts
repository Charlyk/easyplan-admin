import checkIsAuthTokenValid from './checkAuthToken';
import { JwtRegex } from './constants';

const checkIsAuthenticated = async (
  authToken: string,
  clinicId: string | null | undefined,
): Promise<boolean> => {
  if (!authToken || !authToken.match(JwtRegex)) {
    // authentication token is not valid, redirect to login
    return false;
  }

  return await checkIsAuthTokenValid(authToken, clinicId);
};

export default checkIsAuthenticated;
