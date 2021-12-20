import moment from 'moment-timezone';
import { GetServerSidePropsContext } from 'next';
import { Store } from 'redux';
import parseCookies from 'app/utils/parseCookies';
import { fetchAppData } from 'middleware/api/initialization';
import { setAppData } from 'redux/slices/appDataSlice';
import { AppDataState } from 'redux/types';

const withClinicAndUser = async (
  store: Store,
  context: GetServerSidePropsContext,
) => {
  const { req, query } = context;
  const { date: queryDate } = query;
  const { auth_token: authToken } = parseCookies(req);
  const { data } = await fetchAppData(
    req?.headers,
    queryDate ?? moment().format('YYYY-MM-DD'),
  );
  const { currentUser, currentClinic } = data;

  moment.tz.setDefault(currentClinic.timeZone);
  const cookies = req?.headers?.cookie ?? '';
  const appData: AppDataState = {
    currentClinic,
    currentUser,
    authToken,
    cookies,
  };
  store.dispatch(setAppData(appData));
};

export default withClinicAndUser;
