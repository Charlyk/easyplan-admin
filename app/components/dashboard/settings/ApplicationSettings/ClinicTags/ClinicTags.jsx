import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ShareIcon from '@material-ui/icons/Share';
import EASTextField from 'app/components/common/EASTextField';
import { textForKey } from 'app/utils/localization';
import onRequestError from 'app/utils/onRequestError';
import {
  requestCreateTag,
  requestDeleteTag,
  requestFetchTags,
} from 'middleware/api/tags';
import styles from './ClinicTags.module.scss';

const ClinicTags = ({ onShare }) => {
  const [text, setText] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchClinicTags();
  }, []);

  const fetchClinicTags = async () => {
    try {
      const response = await requestFetchTags();
      setTags(response.data);
    } catch (error) {
      onRequestError(error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleCreateTag();
    }
  };

  const handleCreateTag = async () => {
    try {
      const response = await requestCreateTag(text);
      setTags([response.data, ...tags]);
    } catch (error) {
      onRequestError(error);
    } finally {
      setText('');
    }
  };

  const handleDeleteTag = async (tag) => {
    try {
      await requestDeleteTag(tag.id);
      setTags(tags.filter((item) => item.id !== tag.id));
    } catch (error) {
      onRequestError(error);
    }
  };

  const handleShareTag = (tag) => {
    onShare?.([tag]);
  };

  const handleShareAllTags = () => {
    onShare?.(tags);
  };

  return (
    <div className={styles.clinicTags}>
      <EASTextField
        fieldLabel={textForKey('setting_tags_field')}
        helperText={textForKey('setting_tags_helper')}
        onKeyDown={handleKeyDown}
        value={text}
        onChange={setText}
      />

      <Typography className={styles.tagsTitle}>
        {textForKey('setting_tags_current')}
      </Typography>
      <div className={styles.tagsContainer}>
        {tags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.title}
            icon={
              <IconButton
                className={styles.shareBtn}
                onClick={() => handleShareTag(tag)}
              >
                <ShareIcon className={styles.icon} />
              </IconButton>
            }
            variant='outlined'
            classes={{
              root: styles.tagItem,
              outlined: styles.outlined,
              label: styles.label,
              deleteIcon: styles.deleteIcon,
            }}
            onDelete={() => handleDeleteTag(tag)}
          />
        ))}
      </div>
      {tags.length > 0 && (
        <Button
          onClick={handleShareAllTags}
          classes={{
            root: styles.shareAllBtn,
            label: styles.label,
          }}
        >
          <ShareIcon className={styles.icon} />
          {textForKey('setting_tags_share_all')}
        </Button>
      )}
    </div>
  );
};

export default ClinicTags;
