import React from "react";
import UnsortedDealItem from "../UnsortedDealItem";
import styles from './DealItem.module.scss';

const DealItem = ({ dealItem }) => {
  return (
    <div className={styles.dealItem}>
      <UnsortedDealItem deal={dealItem}/>
    </div>
  );
};

export default DealItem;
