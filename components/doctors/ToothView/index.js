import React, { useEffect, useRef, useState } from 'react';

import { Fade, Paper, Popper, ClickAwayListener } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import styles from '../../../styles/ToothView.module.scss';

const ToothView = ({
                     readOnly,
                     icon,
                     toothId,
                     direction,
                     services,
                     selectedServices,
                     completedServices,
                     onServicesChange,
                   }) => {
  const anchorEl = useRef(null);
  const infoAnchor = useRef(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [toothServices, setToothServices] = useState(services);

  useEffect(() => {
    setToothServices(
      services.map((service) => {
        const selectedService = selectedServices
          .filter((item) => !item.completed)
          .find((item) => item.id === service.id && item.toothId === toothId);
        return {
          ...service,
          toothId: toothId,
          selected: selectedService != null,
          canRemove: selectedService?.canRemove,
        };
      }),
    );
  }, [services, selectedServices]);

  const handleServiceSelected = (service, selected) => {
    const newServices = toothServices.map((item) => {
      if (item.id !== service.id) {
        return item;
      }

      return {
        ...item,
        selected: selected,
      };
    });

    setToothServices(newServices);
    onServicesChange({
      toothId,
      services: newServices.filter((item) => item.selected),
    });
  };

  const handleOpenServicesPopper = () => {
    if (services.length === 0 || readOnly) {
      return;
    }
    setShowServices(true);
  };

  const handleCloseServicesPopper = () => {
    setShowServices(false);
  };

  const handleMouseEnter = () => {
    setShowInfo(true);
  };

  const handleMouseLeave = () => {
    setShowInfo(false);
  };

  const servicesPopper = (
    <Popper
      className={styles['tooth-popper-root']}
      anchorEl={anchorEl.current}
      open={showServices}
      placement='bottom'
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={styles['tooth-paper']}>
            <ClickAwayListener onClickAway={handleCloseServicesPopper}>
              <div className={styles['options-wrapper']}>
                {toothServices.map((service) => (
                  <Form.Group
                    key={service.id}
                    controlId={`tooth-${service.id}`}
                  >
                    <Form.Check
                      disabled={service.canRemove === false}
                      onChange={() =>
                        handleServiceSelected(service, !service.selected)
                      }
                      type='checkbox'
                      checked={service.selected}
                      label={service.name}
                    />
                  </Form.Group>
                ))}
              </div>
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );

  const pendingServices = readOnly
    ? selectedServices.filter((item) =>
      item.toothId === toothId && !item.completed
    )
    : []

  const infoServices = [
    ...toothServices.filter((item) => item.selected),
    ...completedServices.filter((item) => item.toothId === toothId),
    ...pendingServices,
  ];

  const infoPopper =
    infoServices.length > 0 ? (
      <Popper
        className={styles['tooth-services-paper-root']}
        anchorEl={infoAnchor.current}
        open={showInfo}
        placement='right'
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper className={styles['services-tooth-paper']}>
              <div className={styles['options-wrapper']}>
                {infoServices.map((item) => (
                  <div
                    key={`${item.id}-${item.historyId}`}
                    className={styles['option-row']}
                  >
                    <div
                      className={styles['service-color-indicator']}
                      style={{ backgroundColor: item.color }}
                    />
                    <span className={styles['service-name']}>{item.name}</span>
                  </div>
                ))}
              </div>
            </Paper>
          </Fade>
        )}
      </Popper>
    ) : null;

  return (
    <div className={styles['tooth-view']}>
      {direction === 'top' && (
        <span className={styles['tooth-text']} ref={anchorEl}>
          {toothId}
        </span>
      )}
      <div
        role='button'
        tabIndex={0}
        ref={infoAnchor}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={clsx(styles['tooth-icon'], direction === 'top' && styles.top)}
        onClick={handleOpenServicesPopper}
      >
        {icon}
        <div
          className={clsx(
            styles['tooth-services-container'],
            direction === 'top' && styles.top,
          )}
        >
          {infoServices.map((item, index) => (
            <div
              className={styles['service-indicator']}
              key={`${item.id}-${item.toothId}-${index}`}
              style={{ backgroundColor: item.color }}
            />
          ))}
        </div>
      </div>
      {direction === 'bottom' && (
        <span className={styles['tooth-text']} ref={anchorEl}>
          {toothId}
        </span>
      )}
      {servicesPopper}
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
    }),
  ),
  completedServices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      price: PropTypes.number,
      color: PropTypes.string,
      completed: PropTypes.bool,
    }),
  ),
};

ToothView.defaultProps = {
  direction: 'bottom',
  services: [],
  onServicesChange: () => null,
};
