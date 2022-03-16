import React from 'react';
import PropTypes from 'prop-types';
import TeethBlock from './TeethBlock';
import styles from './TeethContainer.module.scss';

const TeethContainer = ({ readOnly, toothServices }) => {
  return (
    <div className={styles.teethContainer}>
      <div className={styles.teethColumn}>
        <TeethBlock
          readOnly={readOnly}
          toothServices={toothServices}
          position='top-left'
        />
        <TeethBlock
          readOnly={readOnly}
          toothServices={toothServices}
          position='bottom-left'
        />
      </div>
      <div className={styles.teethColumn}>
        <TeethBlock
          readOnly={readOnly}
          toothServices={toothServices}
          position='top-right'
        />
        <TeethBlock
          readOnly={readOnly}
          toothServices={toothServices}
          position='bottom-right'
        />
      </div>
    </div>
  );
};

export default TeethContainer;

TeethContainer.propTypes = {
  readOnly: PropTypes.bool,
  toothServices: PropTypes.arrayOf(PropTypes.object),
};
