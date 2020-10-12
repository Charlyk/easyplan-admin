import React from 'react';

import PropTypes from 'prop-types';

import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import './styles.scss';

const FinalizeTreatmentModal = ({
  open,
  services,
  totalPrice,
  onClose,
  onSave,
}) => {
  return (
    <EasyPlanModal
      open={open}
      onClose={onClose}
      onPositiveClick={onSave}
      positiveBtnText={textForKey('Finalize')}
      title={textForKey('Finalize treatment')}
    >
      <div className='finalize-treatment-content'>
        <span className='modal-subtitle'>{textForKey('Services')}</span>
        {services.map(item => (
          <div key={item.id} className='final-service-item'>
            <span className='service-name'>
              {item.name} {item.toothId}
            </span>
            <span className='service-price'>{item.price} MDL</span>
          </div>
        ))}
        <div className='totals-text-wrapper'>
          {textForKey('Total')}: {totalPrice} MDL
        </div>
      </div>
    </EasyPlanModal>
  );
};

export default FinalizeTreatmentModal;

FinalizeTreatmentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  totalPrice: PropTypes.number,
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      price: PropTypes.number,
      color: PropTypes.string,
    }),
  ),
};

FinalizeTreatmentModal.defaultProps = {
  onClose: () => null,
  onSave: () => null,
  services: [],
};
