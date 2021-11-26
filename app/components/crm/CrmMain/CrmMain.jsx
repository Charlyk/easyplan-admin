import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import IconFilter from '@material-ui/icons/FilterList';
import IconReminders from '@material-ui/icons/NotificationsActiveOutlined';
import orderBy from 'lodash/orderBy';
import upperFirst from 'lodash/upperFirst';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AudioPlayer from 'react-h5-audio-player';
import { useDispatch, useSelector } from 'react-redux';
import HorizontalScrollHelper from 'app/components/common/HorizontalScrollHelper';
import IconClose from 'app/components/icons/iconClose';
import NotificationsContext from 'app/context/notificationsContext';
import { Role } from 'app/utils/constants';
import extractCookieByName from 'app/utils/extractCookieByName';
import { textForKey } from 'app/utils/localization';
import setDocCookies from 'app/utils/setDocCookies';
import {
  fetchAllDealStates,
  requestChangeDealColumn,
  requestConfirmFirstContact,
  requestFetchRemindersCount,
  updateDealState,
} from 'middleware/api/crm';
import { setAppointmentModal } from 'redux/actions/actions';
import {
  newReminderSelector,
  updatedDealSelector,
  updatedReminderSelector,
} from 'redux/selectors/crmSelector';
import onRequestError from 'app/utils/onRequestError';
import DealsColumn from '../DealsColumn';
import RemindersModal from '../RemindersModal';
import styles from './CrmMain.module.scss';
import reducer, {
  initialState,
  setColumns,
  openLinkModal,
  closeLinkModal,
  openDeleteModal,
  closeDeleteModal,
  setUpdatedDeal,
  openDetailsModal,
  closeDealDetails,
  openReminderModal,
  closeReminderModal,
  setIsDeleting,
  setShowFilters,
  setQueryParams,
  setShowReminders,
  setCallToPlay,
  setShowPageConnectModal,
  setActiveRemindersCount,
} from './CrmMain.reducer';

const ConfirmationModal = dynamic(() =>
  import('../../common/modals/ConfirmationModal'),
);
const LinkPatientModal = dynamic(() => import('../LinkPatientModal'));
const DealDetails = dynamic(() => import('../DealDetails'));
const AddReminderModal = dynamic(() => import('../AddReminderModal'));
const CrmFilters = dynamic(() => import('./CrmFilters'));

const COOKIES_KEY = 'crm_filter';
const COLUMN_WIDTH = 350;

const CrmMain = ({ states, currentUser, currentClinic }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const remoteReminder = useSelector(newReminderSelector);
  const updateReminder = useSelector(updatedReminderSelector);
  const remoteDeal = useSelector(updatedDealSelector);
  const columnsContainerRef = useRef(null);
  const userClinic = currentUser.clinics.find(
    (item) => item.clinicId === currentClinic.id,
  );
  const [
    {
      columns,
      linkModal,
      deleteModal,
      updatedDeal,
      detailsModal,
      reminderModal,
      showFilters,
      queryParams,
      activeRemindersCount,
      showReminders,
      callToPlay,
      showPageConnectModal,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  const filteredColumns = useMemo(() => {
    const filterState = (queryParams.states ?? []).map((it) => it.id);
    return columns.filter(
      (item) =>
        (filterState.length === 0 && item.visibleByDefault) ||
        filterState.includes(item.id),
    );
  }, [columns, queryParams.states]);

  useEffect(() => {
    const queryParams = extractCookieByName(COOKIES_KEY);
    const { roleInClinic } = userClinic;
    const showConnectModal =
      currentClinic.facebookPages.length === 0 &&
      (roleInClinic === Role.admin || roleInClinic === Role.manager);
    localDispatch(setShowPageConnectModal(showConnectModal));
    if (!queryParams) {
      return;
    }
    const params = JSON.parse(atob(queryParams));
    localDispatch(setQueryParams(params));
    fetchRemindersCount();
  }, []);

  useEffect(() => {
    fetchRemindersCount();
  }, [remoteReminder, updateReminder]);

  useEffect(() => {
    if (remoteDeal == null) {
      return;
    }
    localDispatch(setUpdatedDeal(remoteDeal));
  }, [remoteDeal]);

  useEffect(() => {
    localDispatch(setColumns(states));
  }, [states]);

  const fetchRemindersCount = async () => {
    try {
      const response = await requestFetchRemindersCount();
      localDispatch(setActiveRemindersCount(response.data));
    } catch (error) {
      onRequestError(error);
    }
  };

  const updateColumns = async (newState) => {
    try {
      const response = await fetchAllDealStates();
      localDispatch(setColumns(orderBy(response.data, ['orderId'], ['asc'])));

      if (queryParams.states && newState != null) {
        updateParams({
          ...queryParams,
          states: orderBy(
            [...queryParams.states, newState],
            ['orderId'],
            ['asc'],
          ),
        });
      }
    } catch (error) {
      onRequestError(error);
    }
  };

  const handleCloseLinkModal = () => {
    localDispatch(closeLinkModal());
  };

  const handleLinkPatient = (deal, confirm = false) => {
    localDispatch(openLinkModal({ deal, confirm }));
  };

  const handleDeleteDeal = (deal) => {
    localDispatch(openDeleteModal(deal));
  };

  const handleCloseDeleteModal = () => {
    localDispatch(closeDeleteModal());
  };

  const handleDealClick = (deal) => {
    localDispatch(openDetailsModal(deal));
  };

  const handleCloseDetails = () => {
    localDispatch(closeDealDetails());
  };

  const handleOpenReminderModal = (deal) => {
    localDispatch(openReminderModal(deal));
  };

  const handleCloseReminderModal = () => {
    localDispatch(closeReminderModal());
  };

  const handleDeleteConfirmed = async () => {
    const { deal } = deleteModal;
    if (deal == null) {
      return;
    }
    try {
      const column = states.find((item) => item.type === 'ClosedNotRealized');
      if (column == null) {
        return;
      }
      localDispatch(setIsDeleting(true));
      await requestChangeDealColumn(column.id, deal.id);
      handleCloseDeleteModal();
    } catch (error) {
      onRequestError(error);
    } finally {
      localDispatch(setIsDeleting(false));
    }
  };

  const handleColumnMoved = async (direction, state) => {
    try {
      await updateDealState({ moveDirection: upperFirst(direction) }, state.id);
      await updateColumns();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePatientLinked = async (updatedDeal, confirmContact) => {
    localDispatch(setUpdatedDeal(updatedDeal));
    if (confirmContact) {
      await handleConfirmFirstContact(updatedDeal);
    }
  };

  const handleConfirmFirstContact = async (deal) => {
    try {
      if (deal.patient == null) {
        handleLinkPatient(deal, true);
        return;
      }
      const response = await requestConfirmFirstContact(deal.id);
      localDispatch(setUpdatedDeal(response.data));
    } catch (error) {
      onRequestError(error);
    }
  };

  const handleAddSchedule = (deal) => {
    if (deal.patient == null) {
      return;
    }
    dispatch(
      setAppointmentModal({
        open: true,
        patient: deal.patient,
      }),
    );
  };

  const handleOpenFilter = () => {
    localDispatch(setShowFilters(true));
  };

  const handleOpenReminders = () => {
    localDispatch(setShowReminders(true));
  };

  const handleCloseFilter = () => {
    localDispatch(setShowFilters(false));
  };

  const handleCloseReminders = () => {
    localDispatch(setShowReminders(false));
  };

  const handlePlayAudio = (call) => {
    if (call?.fileUrl == null) {
      return;
    }
    const createdDate = moment(call.created);
    const year = createdDate.format('YYYY');
    const month = createdDate.format('MM');
    const date = createdDate.format('DD');
    const recordUrl = call.callId
      ? `https://sip6215.iphost.md/amocrm/router.php?route=record/get&call_id=${call.callId}`
      : `https://sip6215.iphost.md/monitor/${year}/${month}/${date}/${call.fileUrl.replace(
          ' ',
          '+',
        )}`;
    localDispatch(
      setCallToPlay({
        ...call,
        fullUrl: recordUrl,
      }),
    );
  };

  const handleClosePlayer = () => {
    localDispatch(setCallToPlay(null));
  };

  const updateParams = (newParams) => {
    const stringQuery = JSON.stringify(newParams);
    const encoded = btoa(unescape(encodeURIComponent(stringQuery)));
    setDocCookies(COOKIES_KEY, encoded);
    localDispatch(setQueryParams(newParams));
  };

  const handleShortcutSelected = (shortcut) => {
    updateParams({ ...queryParams, shortcut });
  };

  const handleFilterSubmit = (filterData) => {
    updateParams(filterData);
  };

  const handlePlayerError = () => {
    toast.error('Play error', { toastId: 'play-error' });
  };

  const handleScrollUpdate = (scrollOffset) => {
    columnsContainerRef.current.scrollLeft = scrollOffset;
  };

  const handleCloseConnectSocial = () => {
    localDispatch(setShowPageConnectModal(false));
  };

  const handleConnectSocial = async () => {
    handleCloseConnectSocial();
    await router.replace('/settings?menu=crmSettings');
  };

  return (
    <div className={styles.crmMain}>
      <LinkPatientModal
        open={linkModal.open}
        confirm={linkModal.confirmContact}
        deal={linkModal.deal}
        onClose={handleCloseLinkModal}
        onLinked={handlePatientLinked}
      />
      <AddReminderModal
        {...reminderModal}
        currentClinic={currentClinic}
        onClose={handleCloseReminderModal}
      />
      <ConfirmationModal
        show={deleteModal.open}
        isLoading={deleteModal.isLoading}
        title={textForKey('delete_deal_title')}
        message={textForKey('delete_deal_message')}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirmed}
      />
      <ConfirmationModal
        show={showPageConnectModal}
        title={textForKey('connect_social_networks')}
        message={textForKey('connect_social_message')}
        primaryBtnText={textForKey('Connect')}
        onClose={handleCloseConnectSocial}
        onConfirm={handleConnectSocial}
      />
      <RemindersModal
        open={showReminders}
        onAddReminder={handleOpenReminderModal}
        onClose={handleCloseReminders}
      />
      <DealDetails
        open={detailsModal.open}
        deal={detailsModal.deal}
        currentUser={currentUser}
        currentClinic={currentClinic}
        states={states}
        onLink={handleLinkPatient}
        onClose={handleCloseDetails}
        onAddSchedule={handleAddSchedule}
        onAddReminder={handleOpenReminderModal}
        onPlayAudio={handlePlayAudio}
      />
      {showFilters && (
        <CrmFilters
          currentClinic={currentClinic}
          dealsStates={columns}
          selectedParams={queryParams}
          onClose={handleCloseFilter}
          onSubmit={handleFilterSubmit}
          onShortcutSelected={handleShortcutSelected}
        />
      )}
      <div className={styles.buttonsContainer}>
        <Zoom
          unmountOnExit
          in={!detailsModal.open && !showReminders}
          timeout={300}
        >
          <Tooltip title={textForKey('crm_reminders')} placement='left'>
            <Fab
              size='medium'
              aria-label='filter'
              className={styles.remindersFab}
              onClick={handleOpenReminders}
            >
              <div className={styles.activeIndicator}>
                <Typography className={styles.counter}>
                  {activeRemindersCount}
                </Typography>
              </div>
              <IconReminders />
            </Fab>
          </Tooltip>
        </Zoom>
        <Zoom
          unmountOnExit
          in={!detailsModal.open && !showReminders}
          timeout={300}
        >
          <Tooltip title={textForKey('Filter')} placement='left'>
            <Fab
              className={styles.fab}
              size='medium'
              aria-label='filter'
              onClick={handleOpenFilter}
            >
              <IconFilter />
            </Fab>
          </Tooltip>
        </Zoom>
      </div>
      {callToPlay != null && (
        <div className={styles.playerContainer}>
          <IconButton className={styles.closeIcon} onClick={handleClosePlayer}>
            <IconClose />
          </IconButton>
          <AudioPlayer
            autoPlay
            src={callToPlay.fullUrl}
            className={styles.player}
            onError={handlePlayerError}
            showJumpControls={false}
            showSkipControls={false}
            onPlayError={handlePlayerError}
          />
        </div>
      )}
      <DndProvider backend={HTML5Backend}>
        <div ref={columnsContainerRef} className={styles.columnsContainer}>
          {filteredColumns.map((dealState, index) => (
            <DealsColumn
              key={dealState.id}
              width={COLUMN_WIDTH}
              filterData={queryParams}
              isFirst={index === 0}
              isLast={index === states.length - 1}
              updatedDeal={updatedDeal}
              currentClinic={currentClinic}
              dealState={dealState}
              onAddSchedule={handleAddSchedule}
              onUpdate={updateColumns}
              onMove={handleColumnMoved}
              onDealClick={handleDealClick}
              onLinkPatient={handleLinkPatient}
              onDeleteDeal={handleDeleteDeal}
              onConfirmFirstContact={handleConfirmFirstContact}
            />
          ))}
        </div>
      </DndProvider>
      <HorizontalScrollHelper
        columnsCount={filteredColumns.length}
        columnWidth={COLUMN_WIDTH}
        parentEl={columnsContainerRef.current}
        columnSpacing={8} // margin between columns
        onScrollUpdate={handleScrollUpdate}
        position={{
          bottom: '1rem',
          right: '5rem',
        }}
      />
    </div>
  );
};

export default CrmMain;

CrmMain.propTypes = {
  query: PropTypes.shape({
    shortcut: PropTypes.string,
  }),
  currentUser: PropTypes.any,
  currentClinic: PropTypes.any,
  states: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      color: PropTypes.string,
      orderId: PropTypes.number,
      deleteable: PropTypes.bool,
    }),
  ),
};
