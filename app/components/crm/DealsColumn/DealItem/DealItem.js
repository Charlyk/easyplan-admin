import React from "react";
import PropTypes from "prop-types";
import UnsortedDealItem from "../UnsortedDealItem";
import SortedDealItem from "../SortedDealItem";
import styles from './DealItem.module.scss';

const DealItem = ({ dealItem, color, onLinkPatient, onDeleteDeal, onConfirmFirstContact }) => {
  const isUnsorted = dealItem.state.type === 'Unsorted';
  return (
    <div className={styles.dealItem} style={{ backgroundColor: isUnsorted ? 'white' : `${color}0D`}}>
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
  color: PropTypes.string,
  onLinkPatient: PropTypes.func,
  onDeleteDeal: PropTypes.func,
  onConfirmFirstContact: PropTypes.func,
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
    service: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      price: PropTypes.number,
      currency: PropTypes.string,
    }),
    schedule: PropTypes.shape({
      id: PropTypes.number,
      created: PropTypes.string,
      dateAndTime: PropTypes.string,
      endTime: PropTypes.string,
      canceledReason: PropTypes.string,
      doctor: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  }),
}
