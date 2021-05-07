import React from "react";

import PropTypes from 'prop-types';
import TeethBlock from "./TeethBlock";
import styles from "./TeethContainer.module.scss";

const TeethContainer = (
  {
    readOnly,
    toothServices,
    selectedServices,
    completedServices,
    onServicesChange,
  }
) => {
  return (
    <div className={styles.teethContainer}>
      <TeethBlock
        readOnly={readOnly}
        toothServices={toothServices}
        selectedServices={selectedServices}
        completedServices={completedServices}
        position='top-left'
        onToothServiceChange={onServicesChange}
      />
      <TeethBlock
        readOnly={readOnly}
        toothServices={toothServices}
        selectedServices={selectedServices}
        completedServices={completedServices}
        position='top-right'
        onToothServiceChange={onServicesChange}
      />
      <TeethBlock
        readOnly={readOnly}
        toothServices={toothServices}
        selectedServices={selectedServices}
        completedServices={completedServices}
        position='bottom-left'
        onToothServiceChange={onServicesChange}
      />
      <TeethBlock
        readOnly={readOnly}
        toothServices={toothServices}
        selectedServices={selectedServices}
        completedServices={completedServices}
        position='bottom-right'
        onToothServiceChange={onServicesChange}
      />
    </div>
  )
}

export default TeethContainer;

TeethContainer.propTypes = {
  readOnly: PropTypes.bool,
  toothServices: PropTypes.arrayOf(PropTypes.object),
  selectedServices: PropTypes.arrayOf(PropTypes.object),
  completedServices: PropTypes.arrayOf(PropTypes.object),
  onServicesChange: PropTypes.func,
}
