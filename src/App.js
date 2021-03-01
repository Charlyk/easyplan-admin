import React, { useEffect, useState } from 'react';

import moment from 'moment-timezone';
import { usePubNub } from 'pubnub-react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

import AddNote from './components/AddNote';
import AddPaymentModal from './components/AddPaymentModal';
import AddXRay from './components/AddXRay';
import CheckoutModal from './components/CheckoutModal';
import ConfirmationModal from './components/ConfirmationModal';
import CreateClinicModal from './components/CreateClinicModal';
import ExchangeRates from './components/ExchangeRates';
import FullScreenImageModal from './components/FullScreenImageModal';
import {
  setCreateClinic,
  setCurrentUser,
  setPatientNoteModal,
  setPatientXRayModal,
  setPaymentModal,
  setUpdateCurrentUser,
  toggleForceLogoutUser,
  triggerUserLogout,
} from './redux/actions/actions';
import { setAddPaymentModal } from './redux/actions/addPaymentModalActions';
import { setIsExchangeRatesModalOpen } from './redux/actions/exchangeRatesActions';
import { setImageModal } from './redux/actions/imageModalActions';
import { addPaymentModalSelector } from './redux/selectors/addPaymentModalSelector';
import { isExchangeRateModalOpenSelector } from './redux/selectors/exchangeRatesModalSelector';
import { imageModalSelector } from './redux/selectors/imageModalSelector';
import {
  createClinicSelector,
  patientNoteModalSelector,
  patientXRayModalSelector,
  paymentModalSelector,
} from './redux/selectors/modalsSelector';
import {
  forceLogoutSelector,
  logoutSelector,
  newClinicIdSelector,
  updateCurrentUserSelector,
  userSelector,
} from './redux/selectors/rootSelector';
import authAPI from './utils/api/authAPI';
import { fetchClinicData } from './utils/helperFuncs';
import { getAppLanguage, textForKey } from './utils/localization';
import { handleRemoteMessage } from './utils/pubnubUtils';
import authManager from './utils/settings/authManager';
import 'moment/locale/ro';
import 'moment/locale/en-gb';
import 'moment/locale/ru';
import sessionManager from './utils/settings/sessionManager';
import { CircularProgress } from "@material-ui/core";

function App({ children }) {
  moment.locale(getAppLanguage());
  const pubnub = usePubNub();
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector);
  const newClinicId = useSelector(newClinicIdSelector);
  const updateCurrentUser = useSelector(updateCurrentUserSelector);
  const createClinic = useSelector(createClinicSelector);
  const logout = useSelector(logoutSelector);
  const forceLogoutUser = useSelector(forceLogoutSelector);
  const paymentModal = useSelector(paymentModalSelector);
  const patientNoteModal = useSelector(patientNoteModalSelector);
  const patientXRayModal = useSelector(patientXRayModalSelector);
  const addPaymentModal = useSelector(addPaymentModalSelector);
  const isExchangeRatesModalOpen = useSelector(isExchangeRateModalOpenSelector);
  const imageModal = useSelector(imageModalSelector);
  const [redirectUser, setRedirectUser] = useState(false);
  const selectedClinic = currentUser?.clinics?.find(
    (item) => item.clinicId === sessionManager.getSelectedClinicId(),
  );
  const [isAppLoading, setAppIsLoading] = useState(false);

  useEffect(() => {
    if (selectedClinic != null) {
      updateSiteTitle(selectedClinic.clinicName);
      pubnub.subscribe({
        channels: [`${selectedClinic.clinicId}-clinic-pubnub-channel`],
      });
      pubnub.addListener({ message: handlePubnubMessageReceived });
      return () => {
        pubnub.unsubscribe({
          channels: [`${selectedClinic.clinicId}-clinic-pubnub-channel`],
        });
      };
    }
  }, [selectedClinic]);

  useEffect(() => {
    if (currentUser == null || updateCurrentUser) {
      dispatch(setUpdateCurrentUser(false));
      fetchUser();
    } else if (currentUser.clinics.length === 0) {
      dispatch(setCreateClinic({ open: true, canClose: false }));
    } else {
      dispatch(setCreateClinic({ open: false, canClose: true }));
      updateSelectedClinic();
      dispatch(fetchClinicData());
    }
  }, [currentUser, updateCurrentUser]);

  useEffect(() => {
    if (newClinicId != null) {
      changeCurrentClinic(newClinicId);
    }
  }, [newClinicId]);

  useEffect(() => {
    if (forceLogoutUser) {
      handleUserLogout();
    }
  }, [forceLogoutUser]);

  const handlePubnubMessageReceived = ({ message }) => {
    dispatch(handleRemoteMessage(message));
  };

  const updateSelectedClinic = () => {
    sessionManager.setSelectedClinicId(
      selectedClinic?.clinicId || currentUser?.clinics[0].clinicId || -1,
    );
  };

  const updateSiteTitle = (clinicName = '') => {
    const title = document.getElementById('site-title');
    if (title != null && clinicName.length > 0) {
      title.innerText = `EasyPlan - ${clinicName}`;
    } else if (title != null) {
      title.innerText = `EasyPlan`;
    }
  };

  const redirectToHome = () => {
    setRedirectUser(true);
    setTimeout(() => setRedirectUser(false), 500);
  };

  const changeCurrentClinic = async (clinicId) => {
    setAppIsLoading(true);
    const response = await authAPI.changeClinic(clinicId);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      sessionManager.setSelectedClinicId(clinicId);
      dispatch(setCurrentUser(response.data));
      redirectToHome();
    }
    setAppIsLoading(false);
  };

  const fetchUser = async () => {
    if (!authManager.isLoggedIn()) {
      return;
    }
    setAppIsLoading(true);
    const response = await authAPI.me();
    if (response.isError) {
      toast.error(textForKey(response.message));
      authManager.logOut();
      setRedirectUser(true);
    } else {
      const { data: user } = response;
      if (user != null) {
        dispatch(setCurrentUser(user));
        await dispatch(fetchClinicData());
      } else {
        authManager.logOut();
        setRedirectUser(true);
      }
    }
    setAppIsLoading(false);
  };

  const handleCloseCreateClinic = () => {
    dispatch(setCreateClinic({ open: false, canClose: false }));
  };

  const handleClinicCreated = (data) => {
    handleCloseCreateClinic();
    dispatch(setCurrentUser(data));
    dispatch(fetchClinicData());
  };

  const handleUserLogout = () => {
    authManager.logOut();
    sessionManager.removeSelectedClinicId();
    updateSiteTitle();
    dispatch(setCurrentUser(null));
    handleCancelLogout();
    dispatch(toggleForceLogoutUser(false));
  };

  const handleCancelLogout = () => {
    dispatch(triggerUserLogout(false));
  };

  const handleClosePatientNoteModal = () => {
    dispatch(setPatientNoteModal({ open: false }));
  };

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

  const handleCloseImageModal = () => {
    dispatch(setImageModal({ open: false }));
  };

  const handleCloseAddPaymentModal = () => {
    dispatch(setAddPaymentModal({ open: false }));
  };

  const handleCloseExchangeRateModal = () => {
    dispatch(setIsExchangeRatesModalOpen(false));
  };

  return (
    <React.Fragment>
      {paymentModal.open && authManager.isLoggedIn() && (
        <CheckoutModal {...paymentModal} onClose={handleClosePaymentModal}/>
      )}
      <ToastContainer/>
      {isExchangeRatesModalOpen && authManager.isLoggedIn() && (
        <ExchangeRates
          open={isExchangeRatesModalOpen}
          onClose={handleCloseExchangeRateModal}
        />
      )}
      {patientXRayModal.open && authManager.isLoggedIn() && (
        <AddXRay
          {...patientXRayModal}
          onClose={handleClosePatientXRayModal}
        />
      )}
      {patientNoteModal.open && authManager.isLoggedIn() && (
        <AddNote
          {...patientNoteModal}
          onClose={handleClosePatientNoteModal}
        />
      )}
      {imageModal.open && authManager.isLoggedIn() && (
        <FullScreenImageModal
          {...imageModal}
          onClose={handleCloseImageModal}
        />
      )}
      {addPaymentModal.open && authManager.isLoggedIn() && (
        <AddPaymentModal
          {...addPaymentModal}
          onClose={handleCloseAddPaymentModal}
        />
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
      {createClinic?.open && authManager.isLoggedIn() && (
        <CreateClinicModal
          onClose={createClinic?.canClose ? handleCloseCreateClinic : null}
          open={createClinic?.open}
          onCreate={handleClinicCreated}
        />
      )}
      {isAppLoading && (
        <Modal
          centered
          className='loading-modal'
          show={isAppLoading}
          onHide={() => null}
        >
          <Modal.Body>
            <CircularProgress classes={{ root: 'circular-progress-bar' }}/>
            {textForKey('App initialization')}...
          </Modal.Body>
        </Modal>
      )}
      {children}
    </React.Fragment>
  );
}

export default App;
