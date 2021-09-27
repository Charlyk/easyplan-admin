import React from "react";
import Header from "./Header";
import styles from './LeftContainer.module.scss';
import PatientInfo from "./PatientInfo";

const LeftContainer = ({ deal, states }) => {
  return (
    <div className={styles.leftContainer}>
      <Header deal={deal} states={states} />
      <PatientInfo deal={deal} />
    </div>
  )
};

export default LeftContainer;
