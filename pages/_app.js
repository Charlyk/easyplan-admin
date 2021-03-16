import React, { useEffect, useMemo } from "react";
import { PubNubProvider } from "pubnub-react";
import { wrapper } from "../store";
import authManager from "../utils/settings/authManager";
import PubNub from "pubnub";
import NextNprogress from 'nextjs-progressbar';
import axios from "axios";
import { baseAppUrl } from "../eas.config";
import { handleRequestError } from "../utils/helperFuncs";
import App from "next/app";
import { parseCookies } from "../api/utils";
import Head from 'next/head';
import paths from "../utils/paths";
import { useRouter } from "next/router";
import AddXRay from "../components/patients/AddXRay";
import { useDispatch, useSelector } from "react-redux";
import {
  createClinicSelector,
  patientNoteModalSelector,
  patientXRayModalSelector,
  paymentModalSelector
} from "../redux/selectors/modalsSelector";
import {
  setCreateClinic,
  setPatientNoteModal,
  setPatientXRayModal,
  setPaymentModal,
  triggerUserLogout
} from "../redux/actions/actions";
import CheckoutModal from "../components/invoices/CheckoutModal";
import AddNote from "../src/components/AddNote";
import FullScreenImageModal from "../src/components/FullScreenImageModal";
import { imageModalSelector } from "../redux/selectors/imageModalSelector";
import { setImageModal } from "../redux/actions/imageModalActions";
import CreateClinicModal from "../components/clinic/CreateClinicModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { textForKey } from "../utils/localization";
import { logoutSelector } from "../redux/selectors/rootSelector";
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-input-2/lib/style.css';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/index.scss'
import { ToastContainer } from "react-toastify";

const pubnub = new PubNub({
  publishKey: 'pub-c-feea66ec-303f-476d-87ec-0ed7f6379565',
  subscribeKey: 'sub-c-6cdb4ab0-32f2-11eb-8e02-129fdf4b0d84',
  uuid: authManager.getUserId() || PubNub.generateUUID(),
});

function NextApp({ Component, pageProps }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const patientXRayModal = useSelector(patientXRayModalSelector);
  const paymentModal = useSelector(paymentModalSelector);
  const patientNoteModal = useSelector(patientNoteModalSelector);
  const imageModal = useSelector(imageModalSelector);
  const createClinic = useSelector(createClinicSelector);
  const logout = useSelector(logoutSelector);
  const { currentClinic, currentUser } = pageProps;

  useEffect(() => {
    console.log('pageProps', pageProps);
  }, []);

  const getPageTitle = () => {
    return paths[router.pathname] || '';
  };

  const clinicName = useMemo(() => {
    return currentClinic?.clinicName || 'EasyPlan'
  }, [currentClinic]);

  const handleClosePatientXRayModal = () => {
    dispatch(setPatientXRayModal({ open: false, patientId: null }));
  };

  const handleClosePaymentModal = () => {
    dispatch(
      setPaymentModal({
        open: false,
        invoice: null,
        isNew: false,
        openPatientDetailsOnClose: false,
      }),
    );
  };

  const handleClosePatientNoteModal = () => {
    dispatch(setPatientNoteModal({ open: false }));
  };

  const handleCloseImageModal = () => {
    dispatch(setImageModal({ open: false }));
  };

  const handleCloseCreateClinic = () => {
    dispatch(setCreateClinic({ open: false, canClose: false }));
  };

  const handleClinicCreated = async () => {
    await router.replace(router.asPath);
    handleCloseCreateClinic();
  };

  const handleUserLogout = async () => {
    await axios.delete(`${baseAppUrl}/api/auth/logout`);
    router.reload()
  };

  const handleCancelLogout = () => {
    dispatch(triggerUserLogout(false));
  };

  return (
    <>
      <Head>
        <title>{currentClinic ? `${clinicName} - ${getPageTitle()}` : 'EasyPlan.pro'}</title>
      </Head>
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
          {createClinic?.open && (
            <CreateClinicModal
              onClose={createClinic?.canClose ? handleCloseCreateClinic : null}
              open={createClinic?.open}
              onCreate={handleClinicCreated}
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
          {paymentModal.open && (
            <CheckoutModal
              {...paymentModal}
              currentClinic={currentClinic}
              onClose={handleClosePaymentModal}
            />
          )}
          {patientXRayModal.open && (
            <AddXRay
              {...patientXRayModal}
              onClose={handleClosePatientXRayModal}
            />
          )}
          <NextNprogress
            color="#29D"
            startPosition={0.3}
            height="3"
          />
          <Component {...pageProps} />
        </>
      </PubNubProvider>
    </>
  );
}

NextApp.getInitialProps = async (appContext) => {
  const { req, res } = appContext.ctx;
  const appProps = await App.getInitialProps(appContext);
  try {
    const { auth_token } = parseCookies(req);
    if (auth_token == null) {
      await handleRequestError({ response: { status: 401, statusText: '' } }, req, res)
      return appProps;
    }
    const { data: currentUser } = await axios.get(`${baseAppUrl}/api/auth/me`, {
      headers: req.headers
    });
    console.log(currentUser);
    const { data: currentClinic } = await axios.get(`${baseAppUrl}/api/clinic/details`, {
      headers: req.headers
    });
    return {
      ...appProps,
      pageProps: {
        ...appProps.pageProps,
        currentUser,
        currentClinic,
      }
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return appProps;
  }
}

export default wrapper.withRedux(NextApp)
