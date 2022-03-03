import React from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../constants';
import SortedDealItem from '../SortedDealItem';
import UnsortedDealItem from '../UnsortedDealItem';
import styles from './DealItem.module.scss';

const DealItem = ({
  dealItem,
  currentClinic,
  onLinkPatient,
  onDeleteDeal,
  onConfirmFirstContact,
  onDealClick,
}) => {
  const isUnsorted = dealItem.state?.type === 'Unsorted';
  const [{ _ }, drag] = useDrag(() => ({
    type: isUnsorted
      ? ItemTypes.NONE
      : dealItem?.schedule == null
      ? ItemTypes.UNSCHEDULED
      : ItemTypes.SCHEDULED,
    item: dealItem,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} key={dealItem.id} className={styles.dealItem}>
      {dealItem.state?.type === 'Unsorted' ? (
        <UnsortedDealItem
          deal={dealItem}
          currentClinic={currentClinic}
          onDealClick={onDealClick}
          onLinkPatient={onLinkPatient}
          onDeleteDeal={onDeleteDeal}
          onConfirmFirstContact={onConfirmFirstContact}
        />
      ) : (
        <SortedDealItem deal={dealItem} onDealClick={onDealClick} />
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
  currentClinic: PropTypes.any,
  dealItem: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    lastUpdated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    messageSnippet: PropTypes.string,
    source: PropTypes.string,
    sourceDescription: PropTypes.string,
    movedToClinic: PropTypes.shape({
      id: PropTypes.number,
      clinicName: PropTypes.string,
    }),
    contact: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      phoneNumber: PropTypes.string,
      photoUrl: PropTypes.string,
    }),
    patient: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      phoneWithCode: PropTypes.string,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          title: PropTypes.string,
        }),
      ),
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
      created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      dateAndTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      canceledReason: PropTypes.string,
      doctor: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  }),
};
