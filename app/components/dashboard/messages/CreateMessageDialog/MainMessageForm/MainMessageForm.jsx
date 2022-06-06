import React from 'react';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import { useTranslate } from 'react-polyglot';
import EASSelect from 'app/components/common/EASSelect';
import EASTextarea from 'app/components/common/EASTextarea';
import EASTextField from 'app/components/common/EASTextField';
import {
  getRealMessageLength,
  languages,
} from '../CreateMessageDialog.constants';
import styles from './MainMessageForm.module.scss';

const MainMessageForm = ({
  messageTitle,
  language,
  message,
  isLengthExceeded,
  currentClinic,
  maxLength,
  hourToSend,
  availableHours,
  availableTags,
  hideHour,
  onMessageChange,
  onMessageTitleChange,
  onLanguageChange,
  onMessageHourChange,
  onTagClick,
}) => {
  const textForKey = useTranslate();

  const getMessageLength = (language) => {
    return getRealMessageLength(language, message, currentClinic);
  };

  const getMappedHours = (hours) => {
    return hours.map((item) => ({
      id: item,
      name: item,
    }));
  };

  return (
    <div className={styles.formContainer}>
      <EASTextField
        containerClass={styles.simpleField}
        fieldLabel={textForKey('message title')}
        value={messageTitle}
        helperText={textForKey('messagetitledesc')}
        onChange={onMessageTitleChange}
      />

      <EASSelect
        rootClass={styles.simpleField}
        label={textForKey('message language')}
        labelId='language-select'
        value={language}
        onChange={onLanguageChange}
        options={languages}
      />

      <EASTextarea
        containerClass={styles.simpleField}
        error={isLengthExceeded}
        value={message[language]}
        fieldLabel={textForKey('message text')}
        onChange={onMessageChange}
        helperText={
          <span className={styles.helperText}>
            <span className={styles.descriptionHelper}>
              {textForKey('languagedesc')}
            </span>
            <span
              className={clsx(styles.messageLength, {
                [styles.exceeded]: isLengthExceeded,
              })}
            >
              {getMessageLength(language)}/{maxLength}
            </span>
          </span>
        }
      />

      <div className={styles.tagsWrapper}>
        {availableTags.map((tag) => (
          <Box
            key={tag.id}
            className={styles['tag-label']}
            onClick={onTagClick(tag)}
          >
            #{textForKey(tag.label)}
          </Box>
        ))}
      </div>

      {!hideHour && (
        <EASSelect
          rootClass={styles.simpleField}
          label={textForKey('send notification at')}
          options={getMappedHours(availableHours)}
          onChange={onMessageHourChange}
          value={hourToSend}
        />
      )}
    </div>
  );
};

export default MainMessageForm;
