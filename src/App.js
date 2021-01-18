import React, { useEffect, useState } from 'react';

import moment from 'moment';
import { usePubNub } from 'pubnub-react';
import { Modal, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import AddNote from './components/AddNote';
import AddXRay from './components/AddXRay';
import ConfirmationModal from './components/ConfirmationModal';
import CreateClinicModal from './components/CreateClinicModal';
import FullScreenImageModal from './components/FullScreenImageModal';
import RegisterPaymentModal from './components/RegisterPaymentModal';
import DoctorsMain from './doctors/DoctorsMain';
import AcceptInvitation from './pages/General/AcceptInvitation';
import ResetPasswordForm from './pages/General/ResetPasswordForm';
import Login from './pages/Login';
import Main from './pages/Main';
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
import { setImageModal } from './redux/actions/imageModalActions';
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
import { fetchClinicData, updateLink } from './utils/helperFuncs';
import { getAppLanguage, textForKey } from './utils/localization';
import { handleRemoteMessage } from './utils/pubnubUtils';
import authManager from './utils/settings/authManager';
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';
import 'react-phone-number-input/style.css';
import 'react-phone-input-2/lib/style.css';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'moment/locale/ro';
import 'moment/locale/en-gb';
import 'moment/locale/ru';
import sessionManager from './utils/settings/sessionManager';

function App() {
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
  const imageModal = useSelector(imageModalSelector);
  const [redirectUser, setRedirectUser] = useState(false);
  const selectedClinic = currentUser?.clinics?.find(
    item => item.clinicId === sessionManager.getSelectedClinicId(),
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
    } else {
      title.innerText = `EasyPlan`;
    }
  };

  const redirectToHome = () => {
    setRedirectUser(true);
    setTimeout(() => setRedirectUser(false), 500);
  };

  const changeCurrentClinic = async clinicId => {
    setAppIsLoading(true);
    const response = await authAPI.changeClinic(clinicId);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      console.log(clinicId);
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

  const handleClinicCreated = data => {
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
    dispatch(setPaymentModal({ open: false, invoice: null }));
  };

  const handleCloseImageModal = () => {
    dispatch(setImageModal({ open: false }));
  };

  return (
    <Router basename='/'>
      {redirectUser && <Redirect to={updateLink('/')} />}
      <React.Fragment>
        <div id='fb-root' />
        <ToastContainer />
        <RegisterPaymentModal
          {...paymentModal}
          onClose={handleClosePaymentModal}
        />
        <AddXRay {...patientXRayModal} onClose={handleClosePatientXRayModal} />
        <AddNote {...patientNoteModal} onClose={handleClosePatientNoteModal} />
        <FullScreenImageModal {...imageModal} onClose={handleCloseImageModal} />
        <ConfirmationModal
          title={textForKey('Logout')}
          message={textForKey('logout message')}
          onConfirm={handleUserLogout}
          onClose={handleCancelLogout}
          show={logout}
        />
        <CreateClinicModal
          onClose={createClinic?.canClose ? handleCloseCreateClinic : null}
          open={createClinic?.open}
          onCreate={handleClinicCreated}
        />
        <Modal
          centered
          className='loading-modal'
          show={isAppLoading}
          onHide={() => null}
        >
          <Modal.Body>
            <Spinner animation='border' />
            {textForKey('App initialization')}...
          </Modal.Body>
        </Modal>
        <Switch>
          <Route
            path='/clinic-invitation/:isNew?/:token'
            exact
            component={AcceptInvitation}
          />
          <Route
            path='/update-current-password/:token'
            exact
            component={ResetPasswordForm}
          />
          <Route path='/login' exact component={Login} />
          <Route
            path='/'
            component={
              selectedClinic?.roleInClinic === 'DOCTOR' ? DoctorsMain : Main
            }
          />
        </Switch>
      </React.Fragment>
    </Router>
  );
}

export default App;
