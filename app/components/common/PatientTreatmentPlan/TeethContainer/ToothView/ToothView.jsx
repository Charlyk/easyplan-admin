import React, { useEffect, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './ToothView.module.scss';

const ToothView = ({ icon, toothId, direction, services }) => {
  const anchorEl = useRef(null);
  const infoAnchor = useRef(null);
  const [showInfo, setShowInfo] = useState(false);
  const [toothServices, setToothServices] = useState(services);

  useEffect(() => {
    setToothServices(
      services
        .filter((service) => service.teeth.includes(toothId))
        .map((item) => item.service),
    );
  }, [services]);

  const handleMouseEnter = () => {
    setShowInfo(true);
  };

  const handleMouseLeave = () => {
    setShowInfo(false);
  };

  const infoPopper =
    toothServices.length > 0 ? (
      <Popper
        className={styles.toothServicesPaperRoot}
        anchorEl={infoAnchor.current}
        open={showInfo}
        placement='right'
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper className={styles.servicesToothPaper}>
              <div className={styles.optionsWrapper}>
                {toothServices.map((item) => (
                  <div
                    key={`${item.id}-${item.planServiceId}`}
                    className={styles.optionRow}
                  >
                    <div
                      className={styles.serviceColorIndicator}
                      style={{ backgroundColor: item.color }}
                    />
                    <span className={styles.serviceName}>{item.name}</span>
                  </div>
                ))}
              </div>
            </Paper>
          </Fade>
        )}
      </Popper>
    ) : null;

  return (
    <div className={styles.toothView}>
      {direction === 'top' && (
        <span className={styles.toothText} ref={anchorEl}>
          {toothId}
        </span>
      )}
      <Box
        ref={infoAnchor}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={clsx(styles.toothIcon, direction === 'top' && styles.top)}
      >
        {icon}
        <div
          className={clsx(
            styles.toothServicesContainer,
            direction === 'top' && styles.top,
          )}
        >
          {toothServices.map((item, index) => (
            <div
              className={styles.serviceIndicator}
              key={`${item.id}-${item.toothId}-${index}`}
              style={{ backgroundColor: item.color }}
            />
          ))}
        </div>
      </Box>
      {direction === 'bottom' && (
        <span className={styles.toothText} ref={anchorEl}>
          {toothId}
        </span>
      )}
      {infoPopper}
    </div>
  );
};

export default ToothView;

ToothView.propTypes = {
  readOnly: PropTypes.bool,
  onServicesChange: PropTypes.func,
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      price: PropTypes.number,
      color: PropTypes.string,
      planServiceId: PropTypes.number,
    }),
  ),
  toothId: PropTypes.string,
  icon: PropTypes.element,
  direction: PropTypes.oneOf(['bottom', 'top']),
  selectedServices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      price: PropTypes.number,
      color: PropTypes.string,
      completed: PropTypes.bool,
      planServiceId: PropTypes.number,
    }),
  ),
  completedServices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      price: PropTypes.number,
      color: PropTypes.string,
      completed: PropTypes.bool,
      planServiceId: PropTypes.number,
    }),
  ),
};

ToothView.defaultProps = {
  direction: 'bottom',
  services: [],
  onServicesChange: () => null,
};
