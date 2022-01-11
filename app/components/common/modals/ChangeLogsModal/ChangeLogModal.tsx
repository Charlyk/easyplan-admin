import React from 'react';
import { textForKey } from 'app/utils/localization';
import LeftSideModal from '../../LeftSideModal';
import styles from './ChangeLogModal.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ChangeLogModal: React.FC<Props> = ({ open, onClose }) => {
  return (
    <LeftSideModal
      show={open}
      onClose={onClose}
      title={textForKey('last_changes_list') + ':'}
      className={styles.changeLogModal}
    >
      <h1>Hello This is Modal!</h1>
    </LeftSideModal>
  );
};

export default ChangeLogModal;
