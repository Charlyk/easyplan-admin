import React, { useMemo } from "react";
import Typography from "@material-ui/core/Typography";

import { textForKey } from "../../../../../../utils/localization";
import styles from "./Header.module.scss";

const Header = ({ deal, states }) => {
  const headerTitle = useMemo(() => {
    if (deal == null) return '';
    const mainTitle = `${textForKey('Deal')}: #${deal.id}`;
    if (deal.service == null) {
      return mainTitle;
    }
    return deal.service.name;
  }, [deal]);

  const passedStates = useMemo(() => {
    if (deal == null) {
      return [];
    }
    const isFailed = deal.state.type === 'Failed'
    return states.filter(state =>
      state.orderId <= deal?.state.orderId &&
      (!isFailed || state.type !== 'Completed')
    );
  }, [states, deal?.state]);

  return (
    <div className={styles.header}>
      <Typography className={styles.titleLabel}>
        {headerTitle}
      </Typography>
      <div className={styles.subtitleContainer}>
        <Typography className={styles.dealId}>
          #{deal?.id}
        </Typography>
        {deal?.assignedTo != null && (
          <Typography className={styles.responsibleName}>
            {deal?.assignedTo.firstName} {deal?.assignedTo.lastName}
          </Typography>
        )}
      </div>
      <div className={styles.statusContainer}>
        <Typography className={styles.statusName}>
          {deal?.state.name}
        </Typography>
        <div className={styles.progressContainer}>
          {passedStates.map(item => (
            <div
              className={styles.statusIndicator}
              style={{
                backgroundColor: item.color,
                width: `calc(100% / ${states.length - 1})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
};

export default Header;
