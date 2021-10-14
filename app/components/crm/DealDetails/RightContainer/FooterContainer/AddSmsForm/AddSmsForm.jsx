import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import Box from "@material-ui/core/Box";
import { charactersRegex } from "../../../../../dashboard/messages/CreateMessageDialog/CreateMessageDialog.constants";
import { textForKey } from "../../../../../../utils/localization";
import LoadingButton from "../../../../../common/LoadingButton";
import EASTextarea from "../../../../../common/EASTextarea";
import styles from './AddSmsForm.module.scss';

const AddSmsForm = ({ isLoading, onSubmit }) => {
  const [messageText, setMessageText] = useState('');
  const [maxLength, setMaxLength] = useState(160);
  const isLengthExceeded = messageText.length > maxLength;

  useEffect(() => {
    let maxLength = 160;
    if (charactersRegex.test(messageText)) {
      maxLength = 70;
    }
    setMaxLength(maxLength);
  }, [messageText]);

  useEffect(() => {
    if (!isLoading) {
      setMessageText('');
    }
  }, [isLoading]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (messageText.length === 0) {
      return;
    }
    onSubmit?.(messageText);
  }

  return (
    <form className={styles.addNoteForm} onSubmit={handleSubmit}>
      <EASTextarea
        containerClass={styles.field}
        value={messageText}
        error={isLengthExceeded}
        rows={4}
        maxRows={4}
        placeholder={textForKey('Enter new message')}
        onChange={setMessageText}
      />
      <Box marginTop={.5}>
        <LoadingButton
          isLoading={isLoading}
          disabled={isLoading || messageText.length === 0 || isLengthExceeded}
          className="positive-button"
          onClick={handleSubmit}
        >
          {textForKey('Send message')}
        </LoadingButton>
      </Box>
    </form>
  )
};

export default AddSmsForm;

AddSmsForm.propTypes = {
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
};
