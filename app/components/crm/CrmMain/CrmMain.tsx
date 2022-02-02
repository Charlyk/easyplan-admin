import React, { useContext, useEffect, useReducer } from 'react';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import IconFilter from '@material-ui/icons/FilterList';
import IconReminders from '@material-ui/icons/NotificationsActiveOutlined';
import sortBy from 'lodash/sortBy';
import upperFirst from 'lodash/upperFirst';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScrollDiv from 'app/components/common/InfiniteScrollDiv';
import NotificationsContext from 'app/context/notificationsContext';
import { Role } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import onRequestError from 'app/utils/onRequestError';
import onRequestFailed from 'app/utils/onRequestFailed';
import {
  requestChangeDealColumn,
  requestConfirmFirstContact,
} from 'middleware/api/crm';
import {
  currentClinicSelector,
  currentUserSelector,
  userClinicSelector,
} from 'redux/selectors/appDataSelector';
import {
  groupedDealsSelector,
  isFetchingDealsSelector,
  remindersCountSelector,
} from 'redux/selectors/crmBoardSelector';
import { openAppointmentModal } from 'redux/slices/createAppointmentModalSlice';
import { openCreateReminderModal } from 'redux/slices/CreateReminderModal.reducer';
import {
  dispatchFetchDealDetails,
  dispatchFetchGroupedDeals,
  dispatchUpdateDealState,
} from 'redux/slices/crmBoardSlice';
import { playPhoneCallRecord } from 'redux/slices/mainReduxSlice';
import { CrmDealListItemType, DealStateView, DealView } from 'types';
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
  setIsDeleting,
  setShowFilters,
  setShowReminders,
  setCurrentPage,
  setShowPageConnectModal,
} from './CrmMain.reducer';

const ConfirmationModal = dynamic(
  () => import('app/components/common/modals/ConfirmationModal'),
);
const LinkPatientModal = dynamic(() => import('../LinkPatientModal'));
const DealDetails = dynamic(() => import('../DealDetails'));
const CrmFilters = dynamic(() => import('./CrmFilters'));

const COLUMN_WIDTH = 350;
const itemsPerPage = 25;

const CrmMain = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const currentUser = useSelector(currentUserSelector);
  const currentClinic = useSelector(currentClinicSelector);
  const activeRemindersCount = useSelector(remindersCountSelector);
  const isFetchingDeals = useSelector(isFetchingDealsSelector);
  const columns = useSelector(groupedDealsSelector);
  const userClinic = useSelector(userClinicSelector);
  const [
    {
      linkModal,
      deleteModal,
      detailsModal,
      showFilters,
      showReminders,
      currentPage,
      showPageConnectModal,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    const { roleInClinic } = userClinic;
    const showConnectModal =
      currentClinic.facebookPages.length === 0 &&
      (roleInClinic === Role.admin || roleInClinic === Role.manager);
    localDispatch(setShowPageConnectModal(showConnectModal));
  }, []);

  useEffect(() => {
    if (currentPage === 0) {
      return;
    }
    dispatch(dispatchFetchGroupedDeals({ page: currentPage, itemsPerPage }));
  }, [currentPage]);

  const handleCloseLinkModal = () => {
    localDispatch(closeLinkModal());
  };

  const handleLinkPatient = (deal, confirm = false) => {
    localDispatch(openLinkModal({ deal, confirm }));
  };

  const handleDeleteDeal = (deal: CrmDealListItemType) => {
    localDispatch(openDeleteModal(deal));
  };

  const handleCloseDeleteModal = () => {
    localDispatch(closeDeleteModal());
  };

  const handleDealClick = (deal: CrmDealListItemType) => {
    dispatch(dispatchFetchDealDetails(deal.id));
    localDispatch(openDetailsModal(deal));
  };

  const handleCloseDetails = () => {
    localDispatch(closeDealDetails());
  };

  const handleOpenReminderModal = (deal: DealView) => {
    dispatch(openCreateReminderModal({ deal, searchType: 'Deal' }));
  };

  const handleDeleteConfirmed = async () => {
    const { deal } = deleteModal;
    if (deal == null) {
      return;
    }
    try {
      const column = columns
        .map((item) => item.state)
        .find((item) => item.type === 'ClosedNotRealized');
      if (column == null) {
        return;
      }
      localDispatch(setIsDeleting(true));
      await requestChangeDealColumn(column.id, deal.id);
      handleCloseDeleteModal();
    } catch (error) {
      onRequestFailed(error, toast);
    } finally {
      localDispatch(setIsDeleting(false));
    }
  };

  const handleColumnMoved = async (
    direction: 'Left' | 'Right',
    state: DealStateView,
  ) => {
    dispatch(
      dispatchUpdateDealState({
        stateId: state.id,
        body: { moveDirection: upperFirst(direction) },
      }),
    );
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

  const handleCloseConnectSocial = () => {
    localDispatch(setShowPageConnectModal(false));
  };

  const handleConnectSocial = async () => {
    handleCloseConnectSocial();
    await router.replace('/settings?menu=crmSettings');
  };

  const handleScrolledToEnd = () => {
    localDispatch(setCurrentPage(currentPage + 1));
  };

  const handleSubmitFilter = () => {
    localDispatch(setCurrentPage(0));
    handleCloseFilter();
  };

  const getMaxTotalItems = () => {
    const sortedTotal = sortBy(columns.map((group) => group.deals.total));
    return sortedTotal.reverse()[0];
  };

  const getMaxByLength = () => {
    const sortedTotal = sortBy(columns.map((group) => group.deals.data.length));
    return sortedTotal.reverse()[0];
  };

  return (
    <InfiniteScrollDiv
      showScrollHelper
      itemsCount={getMaxByLength()}
      totalItems={getMaxTotalItems()}
      isLoading={isFetchingDeals}
      className={styles.crmMain}
      columnWidth={COLUMN_WIDTH}
      columnsCount={columns.length}
      onScrollToEnd={handleScrolledToEnd}
    >
      <LinkPatientModal
        open={linkModal.open}
        confirm={linkModal.confirmContact}
        deal={linkModal.deal}
        onClose={handleCloseLinkModal}
        onLinked={handlePatientLinked}
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
        states={columns.map((item) => item.state)}
        onLink={handleLinkPatient}
        onClose={handleCloseDetails}
        onAddSchedule={handleAddSchedule}
        onAddReminder={handleOpenReminderModal}
        onPlayAudio={handlePlayAudio}
      />
      {showFilters && (
        <CrmFilters onSubmit={handleSubmitFilter} onClose={handleCloseFilter} />
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
      <div className={styles.columnsContainer}>
        {columns.map((column, index) => (
          <DealsColumn
            key={column.state.id}
            width={COLUMN_WIDTH}
            isFirst={index === 0}
            isLast={index === columns.length - 1}
            dealState={column.state}
            onAddSchedule={handleAddSchedule}
            onMove={handleColumnMoved}
            onDealClick={handleDealClick}
            onLinkPatient={handleLinkPatient}
            onDeleteDeal={handleDeleteDeal}
            onConfirmFirstContact={handleConfirmFirstContact}
          />
        ))}
      </div>
    </InfiniteScrollDiv>
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
