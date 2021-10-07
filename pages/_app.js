import React, { useEffect, useMemo, useState } from "react";
import { PubNubProvider } from "pubnub-react";
import dynamic from 'next/dynamic';
import PubNub from "pubnub";
import NextNprogress from 'nextjs-progressbar';
import Head from 'next/head';
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

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
import { textForKey } from "../utils/localization";
import { logoutSelector } from "../redux/selectors/rootSelector";
import { signOut } from "../middleware/api/auth";
import { fetchAppData } from "../middleware/api/initialization";
import { UnauthorizedPaths } from "../app/utils/constants";
import { wrapper } from "../store";
import paths from "../utils/paths";
import 'moment/locale/ro';
import '../app/utils/extensions';
import '../app/styles/base/base.scss';
import '../utils'

const AddNote = dynamic(() => import("../app/components/common/modals/AddNote"));
const AddXRay = dynamic(() => import("../app/components/dashboard/patients/AddXRay"));
const FullScreenImageModal = dynamic(() => import("../app/components/common/modals/FullScreenImageModal"));
const ConfirmationModal = dynamic(() => import("../app/components/common/modals/ConfirmationModal"));

const pubnub = new PubNub({
  publishKey: 'pub-c-feea66ec-303f-476d-87ec-0ed7f6379565',
  subscribeKey: 'sub-c-6cdb4ab0-32f2-11eb-8e02-129fdf4b0d84',
  uuid: PubNub.generateUUID(),
});

export default wrapper.withRedux(
  ({ Component, pageProps }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const patientXRayModal = useSelector(patientXRayModalSelector);
    const patientNoteModal = useSelector(patientNoteModalSelector);
    const imageModal = useSelector(imageModalSelector);
    const logout = useSelector(logoutSelector);
    const [{ currentClinic }, setState] = useState({ currentClinic: null, currentUser: null });

    useEffect(() => {
      if (UnauthorizedPaths.includes(router.pathname)) {
        return;
      }
      console.log(pageProps);
      fetchInitializationData();
    }, []);

    const fetchInitializationData = async () => {
      try {
        const appData = await fetchAppData();
        setState(appData.data);
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
);
