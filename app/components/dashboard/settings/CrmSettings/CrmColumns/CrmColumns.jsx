import React, { useEffect, useState } from "react";
import { textForKey } from "../../../../../utils/localization";
import styles from './CrmColumns.module.scss'
import onRequestError from "../../../../../utils/onRequestError";
import { requestFetchAllDealStates, requestUpdateDealStateVisibility } from "../../../../../../middleware/api/crm";
import Typography from "@material-ui/core/Typography";
import SwitchButton from "../../../../common/SwitchButton";
import { Tooltip } from "@material-ui/core";

const CrmColumns = ({ currentUser, currentClinic }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchAllStates();
  }, [])

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
      onRequestError(error)
    }
  }

  return (
    <div className={styles.crmColumns}>
      <span className={styles.formTitle}>{textForKey('Columns')}</span>
      <div className={styles.dataContainer}>
        {items.map((state) => (
          <div className={styles.item}>
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
  )
};

export default CrmColumns;
