import React, { useEffect, useState } from "react";
import styles from './ClinicTags.module.scss';
import EASTextField from "../../../../common/EASTextField";
import { textForKey } from "../../../../../utils/localization";
import onRequestError from "../../../../../utils/onRequestError";
import { requestCreateTag, requestDeleteTag, requestFetchTags } from "../../../../../../middleware/api/tags";
import Chip from "@material-ui/core/Chip";
import IconTrash from "../../../../icons/iconTrash";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

const ClinicTags = () => {
  const [text, setText] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchClinicTags();
  }, [])

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
  }

  const handleCreateTag = async () => {
    try {
      const response = await requestCreateTag(text);
      setTags([response.data, ...tags]);
    } catch (error) {
      onRequestError(error)
    } finally {
      setText('');
    }
  };

  const handleDeleteTag = async (tag) => {
    try {
      await requestDeleteTag(tag.id);
      setTags(tags.filter(item => item.id !== tag.id));
    } catch (error) {
      onRequestError(error);
    }
  }

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
        {tags.map(tag => (
          <Chip
            key={tag.id}
            label={tag.title}
            variant="outlined"
            classes={{
              root: styles.tagItem,
              outlined: styles.outlined,
              label: styles.label
            }}
            onDelete={() => handleDeleteTag(tag)}
          />
        ))}
      </div>
    </div>
  )
};

export default ClinicTags;
