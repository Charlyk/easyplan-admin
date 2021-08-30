import React from "react";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import IconEdit from "../../icons/iconEdit";
import { columnWidth } from "../constants";
import styles from './DealColumnsHeader.module.scss';

const DealColumnsHeader = ({ states, onEdit }) => {
  const handleEditColumn = (dealState) => {
    onEdit?.(dealState);
  }

  return (
    <div className={styles.columnsHeaders}>
      <div className={styles.headersContainer} style={{ width: states.length * columnWidth }}>
        {states.map(dealState => (
          <div className={styles.columnHead}>
            <Typography className={styles.titleLabel}>
              {dealState.name}
            </Typography>
            <div
              className={styles.colorIndicator}
              style={{ backgroundColor: dealState.color }}
            />
            <div className={styles.editBtnContainer}>
              <IconButton onPointerUp={() => handleEditColumn(dealState)}>
                <IconEdit/>
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealColumnsHeader;

DealColumnsHeader.propTypes = {
  states: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    color: PropTypes.string,
    orderId: PropTypes.number,
    deleteable: PropTypes.bool,
  })),
  onEdit: PropTypes.func,
};
