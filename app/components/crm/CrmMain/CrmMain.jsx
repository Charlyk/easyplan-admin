import React, { useEffect, useReducer } from "react";
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';
import { toast } from "react-toastify";

import { fetchAllDealStates, requestConfirmFirstContact, updateDealState } from "../../../../middleware/api/crm";
import { textForKey } from "../../../utils/localization";
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
} from './CrmMain.reducer';
import styles from './CrmMain.module.scss';
import onRequestError from "../../../utils/onRequestError";

const ConfirmationModal = dynamic(() => import("../../common/modals/ConfirmationModal"));
const LinkPatientModal = dynamic(() => import("../LinkPatientModal"));
const DealDetails = dynamic(() => import('../DealDetails'));

const CrmMain = ({ states }) => {
  const [{
    columns,
    linkModal,
    deleteModal,
    updatedDeal,
    detailsModal,
  }, localDispatch] = useReducer(reducer, initialState);

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
  }

  const handleCloseDetails = () => {
    localDispatch(closeDealDetails());
  }

  const handleDeleteConfirmed = () => {
    handleCloseDeleteModal();
  }

  const handleColumnMoved = async (direction, state) => {
    try {
      await updateDealState({ moveDirection: upperFirst(direction) }, state.id);
      await updateColumns();
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handlePatientLinked = async (updatedDeal, confirmContact) => {
    localDispatch(setUpdatedDeal(updatedDeal));
    if (confirmContact) {
      await handleConfirmFirstContact(updatedDeal);
    }
  }

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
  }

  return (
    <div className={styles.crmMain}>
      <LinkPatientModal
        open={linkModal.open}
        confirm={linkModal.confirmContact}
        deal={linkModal.deal}
        onClose={handleCloseLinkModal}
        onLinked={handlePatientLinked}
      />
      <ConfirmationModal
        show={deleteModal.open}
        title={textForKey('delete_deal_title')}
        message={textForKey('delete_deal_message')}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirmed}
      />
      <DealDetails
        open={detailsModal.open}
        deal={detailsModal.deal}
        states={states}
        onClose={handleCloseDetails}
      />
      <div className={styles.columnsContainer}>
        {columns.map((dealState, index) => (
          <DealsColumn
            key={dealState.id}
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
  states: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    color: PropTypes.string,
    orderId: PropTypes.number,
    deleteable: PropTypes.bool,
  })),
}
