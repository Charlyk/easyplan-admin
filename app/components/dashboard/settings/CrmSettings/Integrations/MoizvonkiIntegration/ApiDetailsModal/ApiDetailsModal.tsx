import React from 'react';
import EASTextField from 'app/components/common/EASTextField';
import EASModal from 'app/components/common/modals/EASModal';
import { textForKey } from 'app/utils/localization';
import styles from './ApiDetailsModal.module.scss';

interface ApiDetailsModalProps {
  open: boolean;
  onClose: () => void;
}

const ApiDetailsModal: React.FC<ApiDetailsModalProps> = ({ open, onClose }) => {
  return (
    <EASModal
      open={open}
      onClose={onClose}
      size='small'
      className={styles.apiDetailsModal}
      title={textForKey('moizvonki_connect_info')}
    >
      <div className={styles.data}>
        <EASTextField
          containerClass={styles.field}
          fieldLabel={textForKey('api_address')}
          placeholder='domain.moizvonki.ru'
        />
        <EASTextField fieldLabel={textForKey('api_key')} />
      </div>
    </EASModal>
  );
};

export default ApiDetailsModal;
