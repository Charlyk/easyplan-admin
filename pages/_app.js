import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NextNprogress from 'nextjs-progressbar';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { START_TIMER, STOP_TIMER } from 'redux-timer-middleware';
import theme from 'app/styles/theme';
import { APP_DATA_API, UnauthorizedPaths } from 'app/utils/constants';
import useWindowFocused from 'app/utils/hooks/useWindowFocused';
import { textForKey } from 'app/utils/localization';
import paths from 'app/utils/paths';
import { appBaseUrl } from 'eas.config';
import { requestCheckIsAuthenticated, signOut } from 'middleware/api/auth';
import { triggerUserLogout } from 'redux/actions/actions';
import { setImageModal } from 'redux/actions/imageModalActions';
import { imageModalSelector } from 'redux/selectors/imageModalSelector';
import { logoutSelector } from 'redux/selectors/rootSelector';
import types from 'redux/types/types';
import { wrapper } from 'store';
import 'moment/locale/ro';
import 'react-h5-audio-player/src/styles.scss';
import 'react-awesome-lightbox/build/style.css';
import 'app/styles/base/base.scss';
import 'app/utils';

const FullScreenImageModal = dynamic(() =>
  import('../app/components/common/modals/FullScreenImageModal'),
);
const ConfirmationModal = dynamic(() =>
  import('../app/components/common/modals/ConfirmationModal'),
);

const pubnub = new PubNub({
  publishKey: 'pub-c-feea66ec-303f-476d-87ec-0ed7f6379565',
  subscribeKey: 'sub-c-6cdb4ab0-32f2-11eb-8e02-129fdf4b0d84',
  uuid: PubNub.generateUUID(),
});

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(false);
  const isWindowFocused = useWindowFocused();
  const imageModal = useSelector(imageModalSelector);
  const logout = useSelector(logoutSelector);

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
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    if (pageProps.fallback == null) {
      updatePageTitle(null);
      return;
    }
    const { currentClinic, currentUser } = pageProps.fallback[APP_DATA_API];
    setChatVisitor(currentUser);
    if (currentClinic == null) {
      return;
    }

    updatePageTitle(currentClinic);
  }, [pageProps]);

  useEffect(() => {
    if (isWindowFocused) {
      checkUserIsAuthenticated();
    }
  }, [isWindowFocused]);

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

  const setChatUserData = (currentUser, currentClinic) => {
    try {
      if (currentUser == null) {
        return;
      }
      window.Tawk_API.setAttributes({
        id: currentUser.id,
        clinicId: currentClinic?.id,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email,
      });
      if (currentClinic != null) {
        window.Tawk_API.addTags([currentClinic.clinicName]);
      }
    } catch (error) {
      console.error('Error setting user info', error);
    }
  };

  const checkUserIsAuthenticated = async () => {
    if (router.asPath.includes('integrations') || isChecking) {
      // no need to check auth status on integrations page
      return;
    }
    try {
      setIsChecking(true);
      await requestCheckIsAuthenticated();
      const { currentClinic, currentUser } = pageProps.fallback[APP_DATA_API];
      setChatUserData(currentUser, currentClinic);
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
    window.location = appBaseUrl;
  };

  const handleCancelLogout = () => {
    dispatch(triggerUserLogout(false));
  };

  return (
    <>
      <Head>
        <title>EasyPlan.pro</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <ThemeProvider theme={theme}>
        <>
          <CssBaseline />
          <ToastContainer />
          <PubNubProvider client={pubnub}>
            <>
              {logout && (
                <ConfirmationModal
                  title={textForKey('Logout')}
                  message={textForKey('logout message')}
                  onConfirm={handleUserLogout}
                  onClose={handleCancelLogout}
                  show={logout}
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
            </>
          </PubNubProvider>
        </>
      </ThemeProvider>
    </>
  );
};

export default wrapper.withRedux(App);
