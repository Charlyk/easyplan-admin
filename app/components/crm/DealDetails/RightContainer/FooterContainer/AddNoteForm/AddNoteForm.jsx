import React, { useState } from "react";
import PropTypes from 'prop-types';
import Box from "@material-ui/core/Box";
import { textForKey } from "../../../../../../utils/localization";
import LoadingButton from "../../../../../common/LoadingButton";
import EASTextarea from "../../../../../common/EASTextarea";
import styles from './AddNoteForm.module.scss';

const AddNoteForm = ({ isLoading, onSubmit }) => {
  const [noteText, setNoteText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (noteText.length === 0) {
      return;
    }
    onSubmit?.(noteText)
  }

  const handleTextChange = (newText) => {
    setNoteText(newText);
  }

  return (
    <form className={styles.addNoteForm} onSubmit={handleSubmit}>
      <EASTextarea
        containerClass={styles.field}
        value={noteText}
        rows={4}
        maxRows={4}
        placeholder={textForKey('Enter new note')}
        onChange={handleTextChange}
      />
      <Box marginTop={.5}>
        <LoadingButton
          isLoading={isLoading}
          disabled={isLoading || noteText.length === 0}
          className="positive-button"
          onPointerUp={handleSubmit}
        >
          {textForKey('Add note')}
        </LoadingButton>
      </Box>
    </form>
  )
};

export default AddNoteForm;

AddNoteForm.propTypes = {
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
};
