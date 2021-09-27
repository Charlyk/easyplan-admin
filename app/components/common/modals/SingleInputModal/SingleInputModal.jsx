import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from "@material-ui/core/Box";
import Form from 'react-bootstrap/Form';
import EASModal from "../EASModal";
import styles from './SingleInputModal.module.scss';

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
    <EASModal
      size='sm'
      open={open}
      title={title}
      onClose={onClose}
      className={styles['single-input-modal']}
      onPrimaryClick={handleSubmit}
    >
      <Box padding='16px'>
        <Form.Group>
          <Form.Label>{label}</Form.Label>
          <Form.Control
            onChange={handleFieldChange}
            value={value}
            as='textarea'
            aria-label={label}
          />
        </Form.Group>
      </Box>
    </EASModal>
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
