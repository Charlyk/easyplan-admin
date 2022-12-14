import React, { useMemo } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { textForKey } from 'app/utils/localization';
import styles from './Header.module.scss';

const Header = ({ deal, states }) => {
  const hasTags = deal?.patient?.tags.length > 0;

  const headerTitle = useMemo(() => {
    if (deal == null) return '';
    const mainTitle = `${textForKey('Deal')}: #${deal.id}`;
    if (deal.service == null) {
      return mainTitle;
    }
    return deal.service.name;
  }, [deal]);

  const doctorName = useMemo(() => {
    if (deal?.schedule == null) {
      return '';
    }
    const { doctor } = deal.schedule;
    return `${doctor.firstName} ${doctor.lastName}`;
  }, [deal?.schedule]);

  const passedStates = useMemo(() => {
    if (deal == null) {
      return [];
    }
    const isFailed = deal.state.type === 'Failed';
    return states.filter(
      (state) =>
        state.orderId <= deal?.state.orderId &&
        (!isFailed || state.type !== 'Completed'),
    );
  }, [states, deal?.state]);

  return (
    <div className={styles.header}>
      <Typography className={styles.titleLabel}>{headerTitle}</Typography>
      <div className={styles.subtitleContainer}>
        <Typography className={styles.dealId}>#{deal?.id}</Typography>
        {deal?.assignedTo != null && (
          <Typography className={styles.responsibleName}>
            {textForKey('Responsible')}: {deal?.assignedTo.firstName}{' '}
            {deal?.assignedTo.lastName}
          </Typography>
        )}
        {deal?.service != null && (
          <Typography className={styles.responsibleName}>
            {textForKey('Service')}: {deal.service.name}
          </Typography>
        )}
        {deal?.source != null && (
          <Typography className={styles.responsibleName}>
            {textForKey('Source')}: {textForKey(deal.source)}
          </Typography>
        )}

        {deal?.sourceDescription && (
          <Typography className={styles.responsibleName}>
            {textForKey(deal.sourceDescription)}
          </Typography>
        )}

        {doctorName && (
          <Typography className={styles.responsibleName}>
            {textForKey('Doctor')}: {doctorName}
          </Typography>
        )}
        {hasTags &&
          deal.patient.tags.map((tag) => (
            <Typography key={tag.id} className={styles.responsibleName}>
              {tag.title}
            </Typography>
          ))}
      </div>
      <div className={styles.statusContainer}>
        <Typography className={styles.statusName}>
          {deal?.state.name}
        </Typography>
        <div className={styles.progressContainer}>
          {passedStates.map((item) => (
            <Tooltip title={item.name} key={item.type}>
              <div
                className={styles.statusIndicator}
                style={{
                  backgroundColor: item.color,
                  width: `calc(100% / ${states.length - 1})`,
                }}
              />
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;

Header.propTypes = {
  states: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      deleteable: PropTypes.bool,
      id: PropTypes.number,
      name: PropTypes.string,
      orderId: PropTypes.number,
      type: PropTypes.string,
    }),
  ),
  deal: PropTypes.any,
};
