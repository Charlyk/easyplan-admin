import React from "react";
import PropTypes from 'prop-types';
import UnsortedDealItem from "../UnsortedDealItem";
import SortedDealItem from "../SortedDealItem";
import styles from './DealItem.module.scss';

const DealItem = ({ dealItem, onLinkPatient, onDeleteDeal, onConfirmFirstContact }) => {
  return (
    <div className={styles.dealItem}>
      {dealItem.state.type === 'Unsorted' ? (
        <UnsortedDealItem
          deal={dealItem}
          onLinkPatient={onLinkPatient}
          onDeleteDeal={onDeleteDeal}
          onConfirmFirstContact={onConfirmFirstContact}
        />
      ) : (
        <SortedDealItem deal={dealItem}/>
      )}
    </div>
  );
};

export default DealItem;

DealItem.propTypes = {
  dealItem: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.string,
    lastUpdated: PropTypes.string,
    messageSnippet: PropTypes.string,
    source: PropTypes.string,
    sourceDescription: PropTypes.string,
    contact: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      phoneNumber: PropTypes.string,
      photoUrl: PropTypes.string
    }),
    patient: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      phoneWithCode: PropTypes.string,
    }),
    state: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      color: PropTypes.string,
      orderId: PropTypes.number,
      deleteable: PropTypes.bool,
      type: PropTypes.string,
    }),
    assignedTo: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  }),
}
