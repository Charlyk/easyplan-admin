import React, { useEffect, useRef, useState } from 'react';

import { Fade, Paper, Popper, ClickAwayListener } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

const ToothView = ({
  icon,
  toothId,
  direction,
  services,
  onServicesChange,
}) => {
  const anchorEl = useRef(null);
  const infoAnchor = useRef(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [toothServices, setToothServices] = useState(
    services.map(item => ({ ...item, selected: false })),
  );

  useEffect(() => {
    setToothServices(services.map(item => ({ ...item, selected: false })));
  }, [services]);

  const handleServiceSelected = (service, selected) => {
    const newServices = toothServices.map(item => {
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
      services: newServices.filter(item => item.selected),
    });
  };

  const handleOpenServicesPopper = () => {
    if (services.length === 0) {
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
      className='tooth-popper-root'
      anchorEl={anchorEl.current}
      open={showServices}
      placement='bottom'
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className='tooth-paper'>
            <ClickAwayListener onClickAway={handleCloseServicesPopper}>
              <div className='options-wrapper'>
                {toothServices.map(service => (
                  <Form.Group
                    key={service.id}
                    controlId={`tooth-${service.id}`}
                  >
                    <Form.Check
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

  const infoPopper =
    toothServices.filter(item => item.selected).length > 0 ? (
      <Popper
        className='tooth-services-paper-root'
        anchorEl={infoAnchor.current}
        open={showInfo}
        placement='right'
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper className='services-tooth-paper'>
              <div className='options-wrapper'>
                {toothServices
                  .filter(item => item.selected)
                  .map(item => (
                    <div key={item.id} className='option-row'>
                      <div
                        className='service-color-indicator'
                        style={{ backgroundColor: item.color }}
                      />
                      <span className='service-name'>{item.name}</span>
                    </div>
                  ))}
              </div>
            </Paper>
          </Fade>
        )}
      </Popper>
    ) : null;

  return (
    <div className='tooth-view'>
      {direction === 'top' && (
        <span className='tooth-text' ref={anchorEl}>
          {toothId}
        </span>
      )}
      <div
        role='button'
        tabIndex={0}
        ref={infoAnchor}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={clsx('tooth-icon', direction === 'top' && 'top')}
        onClick={handleOpenServicesPopper}
      >
        {icon}
        <div
          className={clsx(
            'tooth-services-container',
            direction === 'top' && 'top',
          )}
        >
          {toothServices
            .filter(item => item.selected)
            .map(item => (
              <div
                className='service-indicator'
                key={item.id}
                style={{ backgroundColor: item.color }}
              />
            ))}
        </div>
      </div>
      {direction === 'bottom' && (
        <span className='tooth-text' ref={anchorEl}>
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
  onServicesChange: PropTypes.func,
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      price: PropTypes.number,
      color: PropTypes.string,
    }),
  ),
  toothId: PropTypes.string,
  icon: PropTypes.element,
  direction: PropTypes.oneOf(['bottom', 'top']),
};

ToothView.defaultProps = {
  direction: 'bottom',
  services: [],
  onServicesChange: () => null,
};
