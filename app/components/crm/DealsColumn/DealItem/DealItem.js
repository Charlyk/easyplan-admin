import React from "react";
import UnsortedDealItem from "../UnsortedDealItem";
import styles from './DealItem.module.scss';

const DealItem = ({ dealItem, onLinkPatient, onDeleteDeal, onConfirmFirstContact }) => {
  return (
    <div className={styles.dealItem}>
      <UnsortedDealItem
        deal={dealItem}
        onLinkPatient={onLinkPatient}
        onDeleteDeal={onDeleteDeal}
        onConfirmFirstContact={onConfirmFirstContact}
      />
    </div>
  );
};

export default DealItem;
