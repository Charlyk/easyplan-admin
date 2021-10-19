import React, { useEffect, useMemo, useReducer } from "react";
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';
import { toast } from "react-toastify";
import Fab from "@material-ui/core/Fab";
import Tooltip from '@material-ui/core/Tooltip';
import IconFilter from '@material-ui/icons/FilterList';
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllDealStates,
  requestChangeDealColumn,
  requestConfirmFirstContact,
  updateDealState
} from "../../../../middleware/api/crm";
import { setAppointmentModal } from "../../../../redux/actions/actions";
import { updatedDealSelector } from "../../../../redux/selectors/crmSelector";
import extractCookieByName from "../../../utils/extractCookieByName";
import setDocCookies from "../../../utils/setDocCookies";
import { textForKey } from "../../../utils/localization";
import onRequestError from "../../../utils/onRequestError";
import DealsColumn from "../DealsColumn";
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
} from './CrmMain.reducer';
import styles from './CrmMain.module.scss';

const ConfirmationModal = dynamic(() => import("../../common/modals/ConfirmationModal"));
const LinkPatientModal = dynamic(() => import("../LinkPatientModal"));
const DealDetails = dynamic(() => import('../DealDetails'));
const AddReminderModal = dynamic(() => import('../AddReminderModal'));
const CrmFilters = dynamic(() => import("./CrmFilters"));

const COOKIES_KEY = 'crm_filter';

const CrmMain = ({ states, currentUser, currentClinic }) => {
  const dispatch = useDispatch();
  const remoteDeal = useSelector(updatedDealSelector);
  const [{
    columns,
    linkModal,
    deleteModal,
    updatedDeal,
    detailsModal,
    reminderModal,
    showFilters,
    queryParams,
  }, localDispatch] = useReducer(reducer, initialState);

  const filteredColumns = useMemo(() => {
    const filterState = (queryParams.states ?? []).map(it => it.id);
    return columns.filter(item => (
      (filterState.length === 0 && item.visibleByDefault) ||
      filterState.includes(item.id)
    ));
  }, [columns, queryParams.states]);

  useEffect(() => {
    const queryParams = extractCookieByName(COOKIES_KEY);
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

  useEffect(() => {
    localDispatch(setColumns(states));
  }, [states]);

  const updateColumns = async () => {
    try {
      const response = await fetchAllDealStates();
      localDispatch(setColumns(response.data));
    } catch (error) {
      toast.error(error.message);
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
      const column = states.find(item => item.type === 'ClosedNotRealized')
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

  const handleCloseFilter = () => {
    localDispatch(setShowFilters(false));
  };

  const updateParams = (newParams) => {
    const stringQuery = JSON.stringify(newParams);
    const encoded = btoa(unescape(encodeURIComponent(stringQuery)))
    setDocCookies(COOKIES_KEY, encoded);
    localDispatch(setQueryParams(newParams));
  };

  const handleShortcutSelected = (shortcut) => {
    updateParams({ shortcut });
  };

  const handleFilterSubmit = (filterData) => {
    updateParams(filterData);
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
      />
      {showFilters && (
        <CrmFilters
          currentClinic={currentClinic}
          dealsStates={states}
          selectedParams={queryParams}
          onClose={handleCloseFilter}
          onSubmit={handleFilterSubmit}
          onShortcutSelected={handleShortcutSelected}
        />
      )}
      <div className={styles.buttonsContainer}>
        <Tooltip title={textForKey('Filter')} placement="left">
          <Fab
            className={styles.fab}
            aria-label="filter"
            onClick={handleOpenFilter}
          >
            <IconFilter/>
          </Fab>
        </Tooltip>
      </div>
      <div className={styles.columnsContainer}>
        {filteredColumns.map((dealState, index) => (
          <DealsColumn
            key={dealState.id}
            filterData={queryParams}
            isFirst={index === 0}
            isLast={index === (states.length - 1)}
            updatedDeal={updatedDeal}
            dealState={dealState}
            onUpdate={updateColumns}
            onMove={handleColumnMoved}
            onDealClick={handleDealClick}
            onLinkPatient={handleLinkPatient}
            onDeleteDeal={handleDeleteDeal}
            onConfirmFirstContact={handleConfirmFirstContact}
          />
        ))}
      </div>
    </div>
  )
};

export default CrmMain;

CrmMain.propTypes = {
  query: PropTypes.shape({
    shortcut: PropTypes.string,
  }),
  currentUser: PropTypes.any,
  currentClinic: PropTypes.any,
  states: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    color: PropTypes.string,
    orderId: PropTypes.number,
    deleteable: PropTypes.bool,
  })),
}
