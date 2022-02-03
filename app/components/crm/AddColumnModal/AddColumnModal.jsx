import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { textForKey } from 'app/utils/localization';
import EASModal from '../../common/modals/EASModal';
import styles from './AddColumnModal.module.scss';

const AddColumnModal = ({ open, onClose, onSave }) => {
  const [name, setName] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSaveColumn = () => {
    if (!name) {
      return;
    }
    onSave?.(name);
  };

  return (
    <EASModal
      open={open}
      title={textForKey('Add new column')}
      className={styles.addColumnModal}
      onPrimaryClick={handleSaveColumn}
      onBackdropClick={onClose}
      onClose={onClose}
    >
      <Box width='100%' display='flex' padding='16px'>
        <TextField
          label={textForKey('Column name')}
          className={styles.textField}
          onChange={handleNameChange}
          InputLabelProps={{
            classes: { focused: styles.fieldLabelFocus },
          }}
          InputProps={{
            className: styles.fieldInput,
          }}
        />
      </Box>
    </EASModal>
  );
};

export default AddColumnModal;
