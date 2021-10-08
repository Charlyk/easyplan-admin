import React from "react";
import clsx from "clsx";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { textForKey } from "../../../../../utils/localization";
import EASTextField from "../../../../common/EASTextField";
import EASSelect from "../../../../common/EASSelect";
import EASTextarea from "../../../../common/EASTextarea";
import {
  getRealMessageLength,
  languages,
} from "../CreateMessageDialog.constants";
import styles from "./MainMessageForm.module.scss";

const MainMessageForm = (
  {
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
  }
) => {

  const getMessageLength = (language) => {
    return getRealMessageLength(language, message, currentClinic);
  };

  const getMappedHours = (hours) => {
    return hours.map(item => ({
      id: item,
      name: item,
    }));
  };

  return (
    <div className={styles.formContainer}>
      <EASTextField
        containerClass={styles.simpleField}
        fieldLabel={textForKey('Message title')}
        value={messageTitle}
        helperText={textForKey('messagetitledesc')}
        onChange={onMessageTitleChange}
      />

      <EASSelect
        rootClass={styles.simpleField}
        label={textForKey('Message language')}
        labelId="language-select"
        value={language}
        onChange={onLanguageChange}
        options={languages}
      />

      <EASTextarea
        containerClass={styles.simpleField}
        error={isLengthExceeded}
        value={message[language]}
        fieldLabel={textForKey('Message text')}
        onChange={onMessageChange}
        helperText={
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography className={styles.descriptionHelper}>
              {textForKey('languagedesc')}
            </Typography>
            <Typography
              className={clsx(
                styles.messageLength,
                {
                  [styles.exceeded]: isLengthExceeded
                }
              )}
            >
              {getMessageLength(language)}/{maxLength}
            </Typography>
          </Box>
        }
      />

      <div className={styles.tagsWrapper}>
        {availableTags.map((tag) => (
          <span
            role='button'
            tabIndex={0}
            key={tag.id}
            className={styles['tag-label']}
            onClick={onTagClick(tag)}
          >
                #{tag.label}
              </span>
        ))}
      </div>

      {!hideHour && (
        <EASSelect
          rootClass={styles.simpleField}
          label={textForKey('Send notification at')}
          options={getMappedHours(availableHours)}
          onChange={onMessageHourChange}
          value={hourToSend}
        />
      )}
    </div>
  )
};

export default MainMessageForm;
