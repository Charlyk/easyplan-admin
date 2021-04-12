import React, { useEffect, useMemo, useState } from "react";
import { PubNubProvider } from "pubnub-react";
import { wrapper } from "../store";
import PubNub from "pubnub";
import NextNprogress from 'nextjs-progressbar';
import Head from 'next/head';
import paths from "../utils/paths";
import { useRouter } from "next/router";
import AddXRay from "../components/patients/AddXRay";
import { useDispatch, useSelector } from "react-redux";
import {
  createClinicSelector,
  patientNoteModalSelector,
  patientXRayModalSelector,
} from "../redux/selectors/modalsSelector";
import {
  setCreateClinic,
  setPatientNoteModal,
  setPatientXRayModal,
  triggerUserLogout
} from "../redux/actions/actions";
import AddNote from "../components/patients/AddNote";
import FullScreenImageModal from "../components/common/FullScreenImageModal";
import { imageModalSelector } from "../redux/selectors/imageModalSelector";
import { setImageModal } from "../redux/actions/imageModalActions";
import CreateClinicModal from "../components/clinic/CreateClinicModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { textForKey } from "../utils/localization";
import { logoutSelector } from "../redux/selectors/rootSelector";
import { ToastContainer } from "react-toastify";
import { signOut } from "../middleware/api/auth";
import { fetchAppData } from "../middleware/api/initialization";
import 'moment/locale/ro';
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-input-2/lib/style.css';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/index.scss'
import { UnauthorizedPaths } from "../utils/constants";

const pubnub = new PubNub({
  publishKey: 'pub-c-feea66ec-303f-476d-87ec-0ed7f6379565',
  subscribeKey: 'sub-c-6cdb4ab0-32f2-11eb-8e02-129fdf4b0d84',
  uuid: PubNub.generateUUID(),
});

function NextApp({ Component, pageProps }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const patientXRayModal = useSelector(patientXRayModalSelector);
  const patientNoteModal = useSelector(patientNoteModalSelector);
  const imageModal = useSelector(imageModalSelector);
  const createClinic = useSelector(createClinicSelector);
  const logout = useSelector(logoutSelector);
  const [{ currentClinic }, setState] = useState({ currentClinic: null, currentUser: null });

  useEffect(() => {
    if (UnauthorizedPaths.includes(router.pathname)) {
      return;
    }
    fetchInitializationData();
  }, []);

  const fetchInitializationData = async () => {
    try {
      const appData = await fetchAppData();
      setState(appData);
    } catch (error) {
      // ignore this error
    }
  }

  const getPageTitle = () => {
    return paths[router.pathname] || '';
  };

  const clinicName = useMemo(() => {
    return currentClinic?.clinicName || 'EasyPlan'
  }, [currentClinic]);

  const handleClosePatientXRayModal = () => {
    dispatch(setPatientXRayModal({ open: false, patientId: null }));
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
    await signOut();
    router.reload()
  };

  const handleCancelLogout = () => {
    dispatch(triggerUserLogout(false));
  };

  return (
    <>
      <Head>
        <title>
          {
            currentClinic
            ? `${clinicName} - ${getPageTitle()}`
            : `EasyPlan.pro - ${getPageTitle()}`
          }
        </title>
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
  );
}

export default wrapper.withRedux(NextApp)
