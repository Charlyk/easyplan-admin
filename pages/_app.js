import React, { useEffect } from "react";
import { PubNubProvider } from "pubnub-react";
import dynamic from 'next/dynamic';
import PubNub from "pubnub";
import NextNprogress from 'nextjs-progressbar';
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { START_TIMER, STOP_TIMER } from "redux-timer-middleware";
import theme from '../app/styles/theme';
import {
  triggerUserLogout
} from "../redux/actions/actions";
import { imageModalSelector } from "../redux/selectors/imageModalSelector";
import { setImageModal } from "../redux/actions/imageModalActions";
import { textForKey } from "../app/utils/localization";
import { logoutSelector } from "../redux/selectors/rootSelector";
import { requestCheckIsAuthenticated, signOut } from "../middleware/api/auth";
import useWindowFocused from "../app/utils/hooks/useWindowFocused";
import { wrapper } from "../store";
import 'moment/locale/ro';
import 'react-h5-audio-player/src/styles.scss';
import "react-awesome-lightbox/build/style.css";
import '../app/utils/extensions';
import '../app/styles/base/base.scss';
import '../app/utils'
import paths from "../app/utils/paths";
import { APP_DATA_API, UnauthorizedPaths } from "../app/utils/constants";
import types from "../redux/types/types";
import { appBaseUrl } from "../eas.config";

const FullScreenImageModal = dynamic(() => import("../app/components/common/modals/FullScreenImageModal"));
const ConfirmationModal = dynamic(() => import("../app/components/common/modals/ConfirmationModal"));

const pubnub = new PubNub({
  publishKey: 'pub-c-feea66ec-303f-476d-87ec-0ed7f6379565',
  subscribeKey: 'sub-c-6cdb4ab0-32f2-11eb-8e02-129fdf4b0d84',
  uuid: PubNub.generateUUID(),
});

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isWindowFocused = useWindowFocused();
  const imageModal = useSelector(imageModalSelector);
  const logout = useSelector(logoutSelector);

  useEffect(() => {
    dispatch({
      type: START_TIMER,
      payload: {
        actionName: types.setUpdateHourIndicatorPosition,
        timerName: 'hourIndicatorTimer',
        timerInterval: 1000
      }
    });
    return () => {
      dispatch({
        type: STOP_TIMER,
        payload: {
          timerName: 'hourIndicatorTimer'
        }
      });
    }
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
    const { currentClinic } = pageProps.fallback[APP_DATA_API];
    if (currentClinic == null) {
      return;
    }

    updatePageTitle(currentClinic);
  }, [pageProps])

  useEffect(() => {
    if (isWindowFocused) {
      checkUserIsAuthenticated();
    }
  }, [isWindowFocused]);

  const setChatUserData = (currentUser, currentClinic) => {
    try {
      if (currentUser == null) {
        return;
      }
      window.Tawk_API.setAttributes({
        id: currentUser.id,
        clinicId: currentClinic?.id,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email
      });
      if (currentClinic != null) {
        window.Tawk_API.addTags([currentClinic.clinicName])
      }
    } catch (error) {
      console.error('Error setting user info', error);
    }
  }

  const checkUserIsAuthenticated = async () => {
    if (router.asPath.includes("integrations")) {
      // no need to check auth status on integrations page
      return;
    }
    try {
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
          await handleUserLogout()
        }
      }
    }
  }

  const updatePageTitle = (clinic) => {
    const pathName = paths[router.pathname] || '';
    const clinicName = clinic?.clinicName || 'EasyPlan.pro'
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
    window.location = appBaseUrl
  };

  const handleCancelLogout = () => {
    dispatch(triggerUserLogout(false));
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <>
          <CssBaseline/>
          <ToastContainer/>
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
              <NextNprogress
                color='#29D'
                startPosition={0.3}
                height='2'
              />
              <Component {...pageProps} />
            </>
          </PubNubProvider>
        </>
      </ThemeProvider>
    </>
  );
};

export default wrapper.withRedux(App);
