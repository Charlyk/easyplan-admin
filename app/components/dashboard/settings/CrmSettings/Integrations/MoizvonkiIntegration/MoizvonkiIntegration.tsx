import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Image from 'next/image';
import { textForKey } from 'app/utils/localization';
import MoizvonkiLogo from 'public/moizvonki_logo.png';
import ApiDetailsModal from './ApiDetailsModal/ApiDetailsModal';
import styles from './MoizvonkiIntegration.module.scss';

const MoizvonkiIntegration: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.moizvonkiIntegration}>
      <ApiDetailsModal open={showModal} onClose={handleCloseModal} />
      <div className={styles.rowContainer}>
        <Image src={MoizvonkiLogo} width={30} height={30} />
        <Typography className={styles.rowTitle}>Moizvonki.ru</Typography>
      </div>
      <Button
        variant='contained'
        className='positive-button'
        onClick={handleOpenModal}
        classes={{ root: styles.connectButton }}
      >
        {textForKey('Connect')}
      </Button>
    </div>
  );
};

export default MoizvonkiIntegration;
