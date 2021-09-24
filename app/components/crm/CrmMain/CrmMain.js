import React, { useEffect, useReducer } from "react";
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';
import { toast } from "react-toastify";

import { fetchAllDealStates, updateDealState } from "../../../../middleware/api/crm";
import { textForKey } from "../../../../utils/localization";
import DealsColumn from "../DealsColumn";
import reducer, {
  initialState,
  setColumns,
  openLinkModal,
  closeLinkModal,
  openDeleteModal,
  closeDeleteModal,
  setUpdatedDeal,
} from './CrmMain.reducer';
import styles from './CrmMain.module.scss';

const ConfirmationModal = dynamic(() => import("../../common/modals/ConfirmationModal"));
const LinkPatientModal = dynamic(() => import("../LinkPatientModal"));

const CrmMain = ({ states }) => {
  const [{
    columns,
    linkModal,
    deleteModal,
    updatedDeal
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

  const handleLinkPatient = (deal) => {
    localDispatch(openLinkModal(deal));
  };

  const handleDeleteDeal = (deal) => {
    localDispatch(openDeleteModal(deal));
  };

  const handleCloseDeleteModal = () => {
    localDispatch(closeDeleteModal());
  };

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

  const handlePatientLinked = (updatedDeal) => {
    localDispatch(setUpdatedDeal(updatedDeal));
    console.log(updatedDeal);
  }

  return (
    <div className={styles.crmMain}>
      <LinkPatientModal
        open={linkModal.open}
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
            onLinkPatient={handleLinkPatient}
            onDeleteDeal={handleDeleteDeal}
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
