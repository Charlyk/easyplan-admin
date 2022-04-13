import React, { useEffect, useMemo, useState, useRef } from 'react';
import { ThemeContainer } from '@easyplanpro/easyplan-components';
import { ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import moment from 'moment-timezone';
import App from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NextNprogress from 'nextjs-progressbar';
import { PubNubProvider } from 'pubnub-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import {
  closeChangeLogModal,
  openChangeLogModal,
} from 'app/components/common/modals/ChangeLogsModal/ChangeLogModal.reducer';
import { changeLogModalSelector } from 'app/components/common/modals/ChangeLogsModal/ChangeLogModal.selector';
import NotificationsProvider from 'app/context/NotificationsProvider';
import useWindowFocused from 'app/hooks/useWindowFocused';
import theme from 'app/styles/theme';
import { checkIfHasUnreadUpdates } from 'app/utils/checkIfHasUnreadUpdates';
import { textForKey } from 'app/utils/localization';
import parseCookies from 'app/utils/parseCookies';
import paths from 'app/utils/paths';
import { isDev, loginUrl, pubNubEnv } from 'eas.config';
import { requestCheckIsAuthenticated, signOut } from 'middleware/api/auth';
import { fetchAppData } from 'middleware/api/initialization';
import { pubnubClient } from 'pubnubUtils';
import { setImageModal } from 'redux/actions/imageModalActions';
import initialState from 'redux/initialState';
import {
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { appointmentModalSelector } from 'redux/selectors/appointmentsSelector';
import { imageModalSelector } from 'redux/selectors/imageModalSelector';
import { logoutSelector } from 'redux/selectors/rootSelector';
import { setAppData } from 'redux/slices/appDataSlice';
import { triggerUserLogOut } from 'redux/slices/mainReduxSlice';
import { handleRemoteMessageReceived } from 'redux/slices/pubnubMessagesSlice';
import { wrapper } from 'store';
import 'moment/locale/ro';
import 'app/styles/base/base.scss';
import 'react-h5-audio-player/src/styles.scss';
import 'app/utils';
import { useAnalytics } from '../app/utils/hooks';

const AppointmentModal = dynamic(() =>
  import(
    'app/components/dashboard/calendar/modals/AppointmentModal/AppointmentModal'
  ),
);

const FullScreenImageModal = dynamic(() =>
  import('app/components/common/modals/FullScreenImageModal'),
);
const ConfirmationModal = dynamic(() =>
  import('../app/components/common/modals/ConfirmationModal'),
);

const ChangeLogModal = dynamic(() =>
  import('app/components/common/modals/ChangeLogsModal'),
);

const EasyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const tawkMessengerRef = useRef(null);
  const currentUser = useSelector(currentUserSelector);
  const currentClinic = useSelector(currentClinicSelector);
  const appointmentModal = useSelector(appointmentModalSelector);
  const changeLogModal = useSelector(changeLogModalSelector);
  const [isChecking, setIsChecking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isWindowFocused = useWindowFocused();
  const imageModal = useSelector(imageModalSelector);
  const logout = useSelector(logoutSelector);
  const [logEvent] = useAnalytics();
  const currentPage = router.asPath;

  useEffect(() => {
    dispatch(setAppData(pageProps.appData));
    logEvent({ event: 'page_opened', payload: window.location.href });
  }, []);

  useEffect(() => {
    if (currentUser === null) return;

    checkIfHasUnreadUpdates().then((response) => {
      if (response?.hasUnread) {
        dispatch(openChangeLogModal());
      }
    });
  }, [currentUser]);

  const clinicRoom = useMemo(() => {
    const id = currentClinic?.id ?? -1;
    return `${id}-${pubNubEnv}-clinic-pubnub-channel`;
  }, [currentClinic]);

  useEffect(() => {
    if (router.asPath !== '/analytics/general') {
      localStorage.removeItem('dateRange');
    }
  }, [router.asPath]);

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
    updatePageTitle(currentClinic);
  }, [currentUser, currentClinic]);

  useEffect(() => {
    if (isWindowFocused) {
      checkUserIsAuthenticated();
    }
  }, [isWindowFocused]);

  const handlePubnubMessageReceived = (message) => {
    dispatch(handleRemoteMessageReceived(message));
  };

  const handleTawkMessengerLoad = () => {
    if (currentUser == null) {
      return;
    }

    tawkMessengerRef.current.visitor = {
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      email: currentUser.email,
    };
    tawkMessengerRef.current.setAttributes({
      id: currentUser.id,
      clinicId: currentClinic?.id,
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      email: currentUser.email,
    });
    if (currentClinic != null) {
      tawkMessengerRef.current.addTags([currentClinic.clinicName]);
    }
  };

  const setChatUserData = () => {
    try {
      if (currentUser == null) {
        return;
      }

      tawkMessengerRef.current.setAttributes({
        id: currentUser.id,
        clinicId: currentClinic?.id,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email,
      });
      if (currentClinic != null) {
        tawkMessengerRef.current.addTags([currentClinic.clinicName]);
      }
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
      path.includes('reset-password') ||
      path.includes('create-clinic') ||
      path.includes('how-to') ||
      isChecking
    ) {
      // no need to check auth status on integrations page
      return;
    }
    try {
      setIsChecking(true);
      await requestCheckIsAuthenticated();

      setChatUserData();
    } catch (error) {
      if (error.response != null) {
        const { status } = error.response;
        if (status === 401) {
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
    setIsLoading(true);
    await signOut();
    logEvent({
      event: 'user_logout',
      payload: { currentUser, currentClinic },
    });
    router.replace(loginUrl).then(() => {
      dispatch(triggerUserLogOut(false));
      dispatch(setAppData(initialState.appData));
      setIsLoading(false);
    });
  };

  const handleCancelLogout = () => {
    dispatch(triggerUserLogOut(false));
  };

  const handleCloseChangeLogModal = () => {
    dispatch(closeChangeLogModal());
  };

  return (
    <React.Fragment>
      <Head>
        <title>EasyPlan.pro</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <DndProvider backend={HTML5Backend}>
        <ThemeContainer>
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
                        isLoading={isLoading}
                        show={logout}
                      />
                    )}
                    {changeLogModal.open && (
                      <ChangeLogModal
                        {...changeLogModal}
                        onClose={handleCloseChangeLogModal}
                      />
                    )}
                    {appointmentModal?.open && <AppointmentModal />}
                    {imageModal.open && (
                      <FullScreenImageModal
                        {...imageModal}
                        onClose={handleCloseImageModal}
                      />
                    )}
                    {!currentPage.includes('confirmation') &&
                    !currentPage.includes('facebook') ? (
                      <TawkMessengerReact
                        propertyId='619407696bb0760a4942ea33'
                        widgetId='1fkl3ptc4'
                        ref={tawkMessengerRef}
                        onLoad={handleTawkMessengerLoad}
                      />
                    ) : null}
                    <NextNprogress
                      color='#29D'
                      startPosition={0.3}
                      height={2}
                    />
                    <Component {...pageProps} />
                  </React.Fragment>
                </NotificationsProvider>
              </PubNubProvider>
            </React.Fragment>
          </ThemeProvider>
        </ThemeContainer>
      </DndProvider>
    </React.Fragment>
  );
};

EasyApp.getInitialProps = wrapper.getInitialAppProps(
  (store) => async (context) => {
    const { ctx } = context;
    // wait for all page actions to dispatch
    const pageProps = {
      ...(await App.getInitialProps(context)).pageProps,
    };

    // stop the saga if on server
    if (context.ctx.req) {
      store.dispatch(END);
      await store.sagaTask.toPromise();
    }

    try {
      // fetch app global data
      const { auth_token: authToken } = parseCookies(ctx.req);
      const { date: queryDate } = ctx.query;
      const { data } = await fetchAppData(
        ctx.req?.headers,
        queryDate ?? moment().format('YYYY-MM-DD'),
      );
      const { currentUser, currentClinic } = data;

      // update moment default timezone
      moment.tz.setDefault(currentClinic.timeZone);

      // store global data in redux
      const cookies = ctx.req?.headers?.cookie ?? '';
      const appData = {
        currentClinic,
        currentUser,
        authToken,
        cookies,
      };
      store.dispatch(setAppData(appData));
    } catch (e) {
      console.error('App', e.message);
    }

    // return props
    return { pageProps };
  },
);

export default wrapper.withRedux(EasyApp);
