import React, { useEffect } from "react";
import { PubNubProvider } from "pubnub-react";
import dynamic from 'next/dynamic';
import PubNub from "pubnub";
import NextNprogress from 'nextjs-progressbar';
import Head from 'next/head';
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from '../app/styles/theme';
import {
  patientNoteModalSelector,
  patientXRayModalSelector,
} from "../redux/selectors/modalsSelector";
import {
  setPatientNoteModal,
  setPatientXRayModal,
  triggerUserLogout
} from "../redux/actions/actions";
import { imageModalSelector } from "../redux/selectors/imageModalSelector";
import { setImageModal } from "../redux/actions/imageModalActions";
import { textForKey } from "../app/utils/localization";
import { logoutSelector } from "../redux/selectors/rootSelector";
import { signOut } from "../middleware/api/auth";
import useWindowFocused from "../app/utils/hooks/useWindowFocused";
import { wrapper } from "../store";
import 'moment/locale/ro';
import '../app/utils/extensions';
import '../app/styles/base/base.scss';
import '../app/utils'
import paths from "../app/utils/paths";
import { APP_DATA_API } from "../app/utils/constants";

const AddNote = dynamic(() => import("../app/components/common/modals/AddNote"));
const AddXRay = dynamic(() => import("../app/components/dashboard/patients/AddXRay"));
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
  const patientXRayModal = useSelector(patientXRayModalSelector);
  const patientNoteModal = useSelector(patientNoteModalSelector);
  const imageModal = useSelector(imageModalSelector);
  const logout = useSelector(logoutSelector);

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
    if (isWindowFocused && router.isReady) {
      router.replace(router.asPath);
    }
  }, [isWindowFocused]);

  const updatePageTitle = (clinic) => {
    const pathName = paths[router.pathname] || '';
    const clinicName = clinic?.clinicName || 'EasyPlan.pro'
    if (!pathName) {
      document.title = clinicName;
    } else {
      document.title = `${clinicName} - ${pathName}`;
    }
  };

  const handleClosePatientXRayModal = () => {
    dispatch(setPatientXRayModal({ open: false, patientId: null }));
  };

  const handleClosePatientNoteModal = () => {
    dispatch(setPatientNoteModal({ open: false }));
  };

  const handleCloseImageModal = () => {
    dispatch(setImageModal({ open: false }));
  };

  const handleUserLogout = async () => {
    await signOut();
    router.reload()
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
              {patientNoteModal.open && (
                <AddNote
                  {...patientNoteModal}
                  onClose={handleClosePatientNoteModal}
                />
              )}
              {patientXRayModal.open && (
                <AddXRay
                  {...patientXRayModal}
                  onClose={handleClosePatientXRayModal}
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
