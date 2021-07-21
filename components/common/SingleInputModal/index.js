import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

import EasyPlanModal from '../../../app/components/common/EasyPlanModal';
import '../../../styles/SingleInputModal.module.scss';

const SingleInputModal = ({ open, title, label, onSubmit, onClose }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!open) {
      setValue('');
    }
  }, [open]);

  const handleFieldChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(value);
  };

  return (
    <EasyPlanModal
      title={title}
      open={open}
      onClose={onClose}
      size='sm'
      className='single-input-modal'
      onPositiveClick={handleSubmit}
    >
      <Form.Group>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          onChange={handleFieldChange}
          value={value}
          as='textarea'
          aria-label={label}
        />
      </Form.Group>
    </EasyPlanModal>
  );
};

SingleInputModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  label: PropTypes.string,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
};

SingleInputModal.defaultProps = {
  title: '',
  label: '',
  onSubmit: () => null,
  onClose: () => null,
};

export default SingleInputModal;
