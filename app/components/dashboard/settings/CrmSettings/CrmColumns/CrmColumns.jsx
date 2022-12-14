import React, { useEffect, useState } from 'react';
import { Tooltip } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useTranslate } from 'react-polyglot';
import SwitchButton from 'app/components/common/SwitchButton';
import onRequestError from 'app/utils/onRequestError';
import {
  requestFetchAllDealStates,
  requestUpdateDealStateVisibility,
} from 'middleware/api/crm';
import styles from './CrmColumns.module.scss';

const CrmColumns = () => {
  const textForKey = useTranslate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchAllStates();
  }, []);

  const fetchAllStates = async () => {
    try {
      const response = await requestFetchAllDealStates();
      setItems(response.data);
    } catch (error) {
      onRequestError(error);
    }
  };

  const handleVisibilityChange = (column) => async (visible) => {
    try {
      await requestUpdateDealStateVisibility({ columnId: column.id, visible });
      await fetchAllStates();
    } catch (error) {
      onRequestError(error);
    }
  };

  return (
    <div className={styles.crmColumns}>
      <span className={styles.formTitle}>{textForKey('columns')}</span>
      <div className={styles.dataContainer}>
        {items.map((state) => (
          <div key={state.id} className={styles.item}>
            <Typography className={styles.itemTitle}>{state.name}</Typography>
            <Tooltip title={textForKey('visible_by_default')}>
              <SwitchButton
                isChecked={state.visibleByDefault}
                onChange={handleVisibilityChange(state)}
              />
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrmColumns;
