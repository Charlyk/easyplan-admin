import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import LoadingButton from 'app/components/common/LoadingButton';
import { textForKey } from 'app/utils/localization';
import MoizvonkiLogo from 'public/moizvonki_logo.png';
import ApiDetailsModal from './ApiDetailsModal/ApiDetailsModal';
import styles from './MoizvonkiIntegration.module.scss';
import {
  dispatchFetchConnectionInfo,
  dispatchRemoveConnection,
  dispatchUpdateConnection,
} from './MoizvonkiIntegration.reducer';
import { moizvonkiIntegrationSelector } from './MoizvonkiIntegration.selector';

const MoizvonkiIntegration: React.FC = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const { isLoading, connection } = useSelector(moizvonkiIntegrationSelector);

  useEffect(() => {
    dispatch(dispatchFetchConnectionInfo());
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitConnection = (
    apiUrl: string,
    apiKey: string,
    username: string,
  ) => {
    dispatch(dispatchUpdateConnection({ apiUrl, apiKey, username }));
  };

  const handleDisconnectMoizvonki = () => {
    dispatch(dispatchRemoveConnection());
  };

  return (
    <div className={styles.moizvonkiIntegration}>
      <ApiDetailsModal
        open={showModal}
        connection={connection}
        onClose={handleCloseModal}
        onSubmit={handleSubmitConnection}
        onDisconnect={handleDisconnectMoizvonki}
      />
      <div className={styles.rowContainer}>
        <Image src={MoizvonkiLogo} width={30} height={30} />
        <Typography className={styles.rowTitle}>Moizvonki.ru</Typography>
      </div>
      <LoadingButton
        variant='contained'
        isLoading={isLoading}
        className={styles.connectButton}
        onClick={handleOpenModal}
      >
        {connection == null
          ? textForKey('Connect')
          : textForKey('edit_connection')}
      </LoadingButton>
    </div>
  );
};

export default MoizvonkiIntegration;
