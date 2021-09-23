import React from "react";
import UnsortedDealItem from "../UnsortedDealItem";
import styles from './DealItem.module.scss';

const DealItem = ({ dealItem, onLinkPatient, onDeleteDeal }) => {
  return (
    <div className={styles.dealItem}>
      <UnsortedDealItem
        deal={dealItem}
        onLinkPatient={onLinkPatient}
        onDeleteDeal={onDeleteDeal}
      />
    </div>
  );
};

export default DealItem;
