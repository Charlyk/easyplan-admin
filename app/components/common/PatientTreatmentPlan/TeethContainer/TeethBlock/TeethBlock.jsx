import React from 'react';
import PropTypes from 'prop-types';
import { Teeth } from 'app/utils/constants';
import ToothView from '../ToothView';
import styles from './TeethBlock.module.scss';

const TeethBlock = ({
  readOnly,
  toothServices,
  selectedServices,
  completedServices,
  position,
  onToothServiceChange,
}) => {
  return (
    <div className={styles[position]}>
      {Teeth.filter((it) => it.type === position).map((item) => (
        <ToothView
          key={item.toothId}
          readOnly={readOnly}
          onServicesChange={onToothServiceChange}
          icon={item.icon}
          services={toothServices}
          direction={position.includes('bottom') ? 'top' : 'bottom'}
          selectedServices={selectedServices}
          completedServices={completedServices.filter(
            (service) => service.toothId != null,
          )}
          toothId={item.toothId}
        />
      ))}
    </div>
  );
};

export default TeethBlock;

TeethBlock.propTypes = {
  readOnly: PropTypes.bool,
  position: PropTypes.oneOf([
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ]),
  toothServices: PropTypes.arrayOf(PropTypes.object),
  selectedServices: PropTypes.arrayOf(PropTypes.object),
  completedServices: PropTypes.arrayOf(PropTypes.object),
  onToothServiceChange: PropTypes.func,
};
