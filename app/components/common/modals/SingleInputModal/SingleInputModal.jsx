import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from "@material-ui/core/Box";
import EASTextField from "../../EASTextField";
import EASModal from "../EASModal";
import styles from './SingleInputModal.module.scss';

const SingleInputModal = ({ open, title, label, onSubmit, onClose }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!open) {
      setValue('');
    }
  }, [open]);

  const handleFieldChange = (newValue) => {
    setValue(newValue);
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
        <EASTextField
          type="text"
          fieldLabel={label}
          value={value}
          onChange={handleFieldChange}
        />
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
