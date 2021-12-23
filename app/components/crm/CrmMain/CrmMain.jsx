import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import IconFilter from '@material-ui/icons/FilterList';
import IconReminders from '@material-ui/icons/NotificationsActiveOutlined';
import upperFirst from 'lodash/upperFirst';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import HorizontalScrollHelper from 'app/components/common/HorizontalScrollHelper';
import NotificationsContext from 'app/context/notificationsContext';
import { Role } from 'app/utils/constants';
import extractCookieByName from 'app/utils/extractCookieByName';
import { textForKey } from 'app/utils/localization';
import onRequestError from 'app/utils/onRequestError';
import setDocCookies from 'app/utils/setDocCookies';
import {
  requestChangeDealColumn,
  requestConfirmFirstContact,
  updateDealState,
} from 'middleware/api/crm';
import {
  currentClinicSelector,
  currentUserSelector,
  userClinicSelector,
} from 'redux/selectors/appDataSelector';
import {
  crmDealsStatesSelector,
  remindersCountSelector,
} from 'redux/selectors/crmBoardSelector';
import { updatedDealSelector } from 'redux/selectors/crmSelector';
import { openAppointmentModal } from 'redux/slices/createAppointmentModalSlice';
import { dispatchFetchDealStates } from 'redux/slices/crmBoardSlice';
import { playPhoneCallRecord } from 'redux/slices/mainReduxSlice';
import DealsColumn from '../DealsColumn';
import RemindersModal from '../RemindersModal';
import styles from './CrmMain.module.scss';
import reducer, {
  initialState,
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
  setShowPageConnectModal,
} from './CrmMain.reducer';

const ConfirmationModal = dynamic(() =>
  import('app/components/common/modals/ConfirmationModal'),
);
const LinkPatientModal = dynamic(() => import('../LinkPatientModal'));
const DealDetails = dynamic(() => import('../DealDetails'));
const AddReminderModal = dynamic(() => import('../AddReminderModal'));
const CrmFilters = dynamic(() => import('./CrmFilters'));

const COOKIES_KEY = 'crm_filter';
const COLUMN_WIDTH = 350;

const CrmMain = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const currentUser = useSelector(currentUserSelector);
  const currentClinic = useSelector(currentClinicSelector);
  const activeRemindersCount = useSelector(remindersCountSelector);
  const columns = useSelector(crmDealsStatesSelector);
  const remoteDeal = useSelector(updatedDealSelector);
  const columnsContainerRef = useRef(null);
  const userClinic = useSelector(userClinicSelector);
  const [
    {
      linkModal,
      deleteModal,
      updatedDeal,
      detailsModal,
      reminderModal,
      showFilters,
      queryParams,
      showReminders,
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
  }, []);

  useEffect(() => {
    if (remoteDeal == null) {
      return;
    }
    localDispatch(setUpdatedDeal(remoteDeal));
  }, [remoteDeal]);

  const updateColumns = () => {
    dispatch(dispatchFetchDealStates());
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
      const column = columns.find((item) => item.type === 'ClosedNotRealized');
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
    dispatch(openAppointmentModal({ open: true, patient: deal.patient }));
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
    dispatch(playPhoneCallRecord(call));
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
        states={columns}
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
      <DndProvider backend={HTML5Backend}>
        <div ref={columnsContainerRef} className={styles.columnsContainer}>
          {filteredColumns.map((dealState, index) => (
            <DealsColumn
              key={dealState.id}
              width={COLUMN_WIDTH}
              filterData={queryParams}
              isFirst={index === 0}
              isLast={index === columns.length - 1}
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
