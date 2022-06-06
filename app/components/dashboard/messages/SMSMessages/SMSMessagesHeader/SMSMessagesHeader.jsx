import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import IconPlus from 'app/components/icons/iconPlus';
import styles from './SMSMessagesHeader.module.scss';

const SMSMessagesHeader = ({ canCreate, onCreate }) => {
  const textForKey = useTranslate();
  return (
    <div className={styles['create-message-header']}>
      {canCreate && (
        <Button
          className={styles.createButton}
          disabled={!canCreate}
          onClick={onCreate}
        >
          {textForKey('create message')}
          <IconPlus fill='#fff' />
        </Button>
      )}
    </div>
  );
};

export default SMSMessagesHeader;

SMSMessagesHeader.propTypes = {
  canCreate: PropTypes.bool,
  onCreate: PropTypes.func,
};
