import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';
import { toast } from "react-toastify";

import { fetchAllDealStates, updateDealState } from "../../../../middleware/api/crm";
import DealsColumn from "../DealsColumn";
import styles from './CrmMain.module.scss';

const CrmMain = ({ states }) => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns(states);
  }, [states]);

  const updateColumns = async () => {
    try {
      const response = await fetchAllDealStates();
      setColumns(response.data)
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleColumnMoved = async (direction, state) => {
    try {
      await updateDealState({ moveDirection: upperFirst(direction) }, state.id);
      await updateColumns();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className={styles.crmMain}>
      <div className={styles.columnsContainer}>
        {columns.map((dealState, index) => (
          <DealsColumn
            key={dealState.id}
            isFirst={index === 0}
            isLast={index === (states.length - 1)}
            dealState={dealState}
            onUpdate={updateColumns}
            onMove={handleColumnMoved}
          />
        ))}
      </div>
    </div>
  )
};

export default CrmMain;

CrmMain.propTypes = {
  states: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    color: PropTypes.string,
    orderId: PropTypes.number,
    deleteable: PropTypes.bool,
  })),
}
