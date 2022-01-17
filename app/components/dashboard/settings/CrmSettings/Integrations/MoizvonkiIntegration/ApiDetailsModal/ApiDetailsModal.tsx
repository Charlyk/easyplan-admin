import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';
import EASTextField from 'app/components/common/EASTextField';
import EASModal from 'app/components/common/modals/EASModal';
import { EmailRegex } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import styles from './ApiDetailsModal.module.scss';

interface ApiDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (apiUrl: string, apiKey: string) => void;
}

const ApiDetailsModal: React.FC<ApiDetailsModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [username, setUsername] = useState('');

  const isFormValid =
    apiUrl.includes('.moizvonki.ru') &&
    apiKey.length > 0 &&
    username.match(EmailRegex);

  const handleUsernameChange = (newValue: string) => {
    setUsername(newValue);
  };

  const handleApiUrlChange = (newValue: string) => {
    setApiUrl(newValue);
  };

  const handleApiKeyChange = (newValue: string) => {
    setApiKey(newValue);
  };

  const handleSubmitApiInfo = () => {
    onSubmit?.(apiUrl, apiKey);
    onClose?.();
  };

  return (
    <EASModal
      open={open}
      onClose={onClose}
      size='small'
      className={styles.apiDetailsModal}
      title={textForKey('moizvonki_connect_info')}
      onPrimaryClick={handleSubmitApiInfo}
      isPositiveDisabled={!isFormValid}
    >
      <div className={styles.data}>
        <EASTextField
          onChange={handleUsernameChange}
          containerClass={styles.field}
          fieldLabel={textForKey('username')}
          placeholder='example@email.com'
          helperText={textForKey('moizvonki_username_help')}
        />
        <EASTextField
          onChange={handleApiUrlChange}
          containerClass={styles.field}
          fieldLabel={textForKey('api_address')}
          placeholder='domain.moizvonki.ru'
        />
        <EASTextField
          onChange={handleApiKeyChange}
          fieldLabel={textForKey('api_key')}
        />
        <Typography className={styles.howToBtn}>
          <Link href='/how-to/get-moizvonki-data' passHref>
            <a target='_blank'>{textForKey('how_to_get_api_info')}</a>
          </Link>
        </Typography>
      </div>
    </EASModal>
  );
};

export default ApiDetailsModal;
