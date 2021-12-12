import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import EASTextarea from 'app/components/common/EASTextarea';
import LoadingButton from 'app/components/common/LoadingButton';
import { textForKey } from 'app/utils/localization';
import styles from './AddNoteForm.module.scss';

const AddNoteForm = ({ isLoading, onSubmit }) => {
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (!isLoading) {
      setNoteText('');
    }
  }, [isLoading]);

  const handleSubmit = (event) => {
    event?.preventDefault();
    if (noteText.length === 0) {
      return;
    }
    onSubmit?.(noteText);
  };

  return (
    <form className={styles.addNoteForm} onSubmit={handleSubmit}>
      <EASTextarea
        containerClass={styles.field}
        value={noteText}
        rows={4}
        maxRows={4}
        placeholder={textForKey('Enter new note')}
        onChange={setNoteText}
      />
      <Box marginTop={0.5}>
        <LoadingButton
          isLoading={isLoading}
          disabled={isLoading || noteText.length === 0}
          className='positive-button'
          onClick={handleSubmit}
        >
          {textForKey('Add note')}
        </LoadingButton>
      </Box>
    </form>
  );
};

export default AddNoteForm;

AddNoteForm.propTypes = {
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
};
