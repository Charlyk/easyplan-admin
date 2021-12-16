import React, { useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';

import NextNprogress from 'nextjs-progressbar';
import { PubNubProvider } from 'pubnub-react';
import { useDispatch, useSelector } from 'react-redux';
import { START_TIMER, STOP_TIMER } from 'redux-timer-middleware';
import NotificationsProvider from 'app/context/NotificationsProvider';
import theme from 'app/styles/theme';
import { UnauthorizedPaths } from 'app/utils/constants';
import useWindowFocused from 'app/utils/hooks/useWindowFocused';
import { textForKey } from 'app/utils/localization';
import parseCookies from 'app/utils/parseCookies';
import paths from 'app/utils/paths';
import { appBaseUrl, isDev, pubNubEnv } from 'eas.config';
import { requestCheckIsAuthenticated, signOut } from 'middleware/api/auth';
import { fetchAppData } from 'middleware/api/initialization';
import { handlePubnubMessage, pubnubClient } from 'pubnubUtils';
import { triggerUserLogout } from 'redux/actions/actions';
import { setImageModal } from 'redux/actions/imageModalActions';
import {
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { appointmentModalSelector } from 'redux/selectors/appointmentModalSelector';
import { imageModalSelector } from 'redux/selectors/imageModalSelector';
import { logoutSelector } from 'redux/selectors/rootSelector';
import { setAppData } from 'redux/slices/appDataSlice';
import { closeAppointmentModal } from 'redux/slices/createAppointmentModalSlice';
import types from 'redux/types';
import { wrapper } from 'store';
import 'moment/locale/ro';
import 'app/styles/base/base.scss';
import 'react-h5-audio-player/src/styles.scss';
import 'react-awesome-lightbox/build/style.css';
import 'app/utils';

const AddAppointmentModal = dynamic(() =>
  import('app/components/dashboard/calendar/modals/AddAppointmentModal'),
);

const FullScreenImageModal = dynamic(() =>
  import('app/components/common/modals/FullScreenImageModal'),
);
const ConfirmationModal = dynamic(() =>
  import('app/components/common/modals/ConfirmationModal'),
);

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector(currentUserSelector);
  const currentClinic = useSelector(currentClinicSelector);
  const appointmentModal = useSelector(appointmentModalSelector);
  const [isChecking, setIsChecking] = useState(false);
  const isWindowFocused = useWindowFocused();
  const imageModal = useSelector(imageModalSelector);
  const logout = useSelector(logoutSelector);
  const currentPage = router.asPath;

  const clinicRoom = useMemo(() => {
    const id = currentClinic?.id ?? -1;
    return `${id}-${pubNubEnv}-clinic-pubnub-channel`;
  }, [currentClinic]);

  useEffect(() => {
    dispatch({
      type: START_TIMER,
      payload: {
        actionName: types.setUpdateHourIndicatorPosition,
        timerName: 'hourIndicatorTimer',
        timerInterval: 1000,
      },
    });
    return () => {
      dispatch({
        type: STOP_TIMER,
        payload: {
          timerName: 'hourIndicatorTimer',
        },
      });
    };
  }, []);

  useEffect(() => {
    // Remove the server-side injected CSS.
    document.querySelector('#jss-server-side')?.remove();
  }, []);

  useEffect(() => {
    pubnubClient.subscribe({ channels: [clinicRoom] });
    pubnubClient.addListener({ message: handlePubnubMessageReceived });
    return () => {
      pubnubClient.removeListener({ message: handlePubnubMessageReceived });
      pubnubClient.unsubscribe({ channels: [clinicRoom] });
    };
  }, [clinicRoom]);

  useEffect(() => {
    setChatVisitor(currentUser);
    updatePageTitle(currentClinic);
  }, [currentUser, currentClinic]);

  useEffect(() => {
    if (isWindowFocused) {
      checkUserIsAuthenticated();
    }
  }, [isWindowFocused]);

  const handlePubnubMessageReceived = (message) => {
    handlePubnubMessage(message);
  };

  const handleAppointmentModalClose = () => {
    dispatch(closeAppointmentModal());
  };

  const setChatVisitor = (currentUser) => {
    if (currentUser == null) {
      return;
    }
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.visitor = {
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      email: currentUser.email,
    };
  };

  const setChatUserData = () => {
    try {
      if (currentUser == null) {
        return;
      }
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.onLoad = () => {
        window.Tawk_API.setAttributes({
          id: currentUser.id,
          clinicId: currentClinic?.id,
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          email: currentUser.email,
        });
        if (currentClinic != null) {
          window.Tawk_API.addTags([currentClinic.clinicName]);
        }
      };
    } catch (error) {
      console.error('Error', error?.message);
    }
  };

  const checkUserIsAuthenticated = async () => {
    const path = router.asPath;
    if (
      path.includes('integrations') ||
      path.includes('register') ||
      path.includes('accept-invitation') ||
      path.includes('confirmation') ||
      path.includes('create-clinic') ||
      isChecking
    ) {
      // no need to check auth status on integrations page
      return;
    }
    try {
      setIsChecking(true);
      await requestCheckIsAuthenticated();
      setChatUserData();
      if (router.asPath === '/login') {
        await router.reload();
      }
    } catch (error) {
      if (error.response != null) {
        const { status } = error.response;
        if (status === 401) {
          if (UnauthorizedPaths.includes(router.asPath)) {
            return;
          }
          await handleUserLogout();
        }
      }
    } finally {
      setIsChecking(false);
    }
  };

  const updatePageTitle = (clinic) => {
    const pathName = paths[router.pathname] || '';
    const clinicName = clinic?.clinicName || 'EasyPlan.pro';
    if (!pathName) {
      document.title = clinicName;
    } else {
      document.title = `${clinicName} - ${pathName}`;
    }
  };

  const handleCloseImageModal = () => {
    dispatch(setImageModal({ open: false }));
  };

  const handleUserLogout = async () => {
    await signOut();
    dispatch(setAppData({ currentUser: null, currentClinic: null }));
    window.location = appBaseUrl;
  };

  const handleCancelLogout = () => {
    dispatch(triggerUserLogout(false));
  };

  return (
    <React.Fragment>
      <Head>
        <title>EasyPlan.pro</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
        {!currentPage.includes('confirmation') &&
        !currentPage.includes('facebook') ? (
          <Script type='text/javascript' src='/tawkto.js' />
        ) : null}
      </Head>
      <ThemeProvider theme={theme}>
        <React.Fragment>
          <CssBaseline />
          <PubNubProvider client={pubnubClient}>
            <NotificationsProvider>
              <React.Fragment>
                {isDev && (
                  <Typography className='develop-indicator'>Dev</Typography>
                )}
                {logout && (
                  <ConfirmationModal
                    title={textForKey('Logout')}
                    message={textForKey('logout message')}
                    onConfirm={handleUserLogout}
                    onClose={handleCancelLogout}
                    show={logout}
                  />
                )}
                {appointmentModal?.open && (
                  <AddAppointmentModal
                    currentClinic={currentClinic}
                    onClose={handleAppointmentModalClose}
                    schedule={appointmentModal?.schedule}
                    open={appointmentModal?.open}
                    doctor={appointmentModal?.doctor}
                    date={appointmentModal?.date}
                    patient={appointmentModal?.patient}
                    startHour={appointmentModal?.startHour}
                    endHour={appointmentModal?.endHour}
                    cabinet={appointmentModal?.cabinet}
                    isDoctorMode={appointmentModal?.isDoctorMode}
                  />
                )}
                {imageModal.open && (
                  <FullScreenImageModal
                    {...imageModal}
                    onClose={handleCloseImageModal}
                  />
                )}
                <NextNprogress color='#29D' startPosition={0.3} height={2} />
                <Component {...pageProps} />
              </React.Fragment>
            </NotificationsProvider>
          </PubNubProvider>
        </React.Fragment>
      </ThemeProvider>
    </React.Fragment>
  );
};

App.getInitialProps = wrapper.getInitialAppProps(
  (store) =>
    async ({ Component, ctx }) => {
      try {
        const { auth_token: authToken } = parseCookies(ctx.req);
        const { date: queryDate } = ctx.query;
        const { data } = await fetchAppData(
          ctx.req.headers,
          queryDate ?? moment().format('YYYY-MM-DD'),
        );
        const { currentUser, currentClinic } = data;
        store.dispatch(
          setAppData({
            currentClinic,
            currentUser,
            authToken,
          }),
        );
      } catch (e) {
        console.error(e.message);
      }
      return {
        pageProps: {
          ...(Component.getInitialProps
            ? await Component.getInitialProps({ ...ctx, store })
            : {}),
          pathname: ctx.pathname,
        },
      };
    },
);

export default wrapper.withRedux(App);
