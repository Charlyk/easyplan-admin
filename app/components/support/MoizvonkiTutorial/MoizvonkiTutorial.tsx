import React from 'react';
import Typography from '@material-ui/core/Typography';
import Image from 'next/image';
import { useTranslate } from 'react-polyglot';
import homeProfile from 'public/howto/moizvonki/home-profile.png';
import homeSettings from 'public/howto/moizvonki/home-settings.png';
import homePage from 'public/howto/moizvonki/home.png';
import integrationsPage from 'public/howto/moizvonki/integrations.png';
import profile from 'public/howto/moizvonki/profile.png';
import settingsPage from 'public/howto/moizvonki/settings.png';
import SupportArticles from '../SupportArticles';
import styles from './MoizvonkiTutorial.module.scss';

const MoizvonkiTutorial: React.FC = () => {
  const textForKey = useTranslate();
  return (
    <SupportArticles>
      <div className={styles.moizvonkiTutorial}>
        <Typography variant='h4' className={styles.title}>
          {textForKey('how_to_get_moizvonki_data')}
        </Typography>
        <Typography className={styles.updatedAt}>
          {textForKey('article_updated_at', '17 Ianuarie 2022')}
        </Typography>
        <div className={styles.dataContainer}>
          <Typography className={styles.dataLabel}>
            <a href='https://moizvonki.ru' target='_blank' rel='noreferrer'>
              Moizvonki.ru
            </a>{' '}
            connection allows you to generate leads automatically into CRM,
            listen phone calls directly in EasyPlan app and monitor what
            employees are talking with your clients. After integration all calls
            received on the phone connected to Moizvonki.ru will be displayed in
            EasyPlan.
          </Typography>
          <Typography className={styles.dataLabel}>
            To integrate{' '}
            <a href='https://moizvonki.ru' target='_blank' rel='noreferrer'>
              Moizvonki.ru
            </a>{' '}
            with{' '}
            <a href='https://easyplan.pro' target='_blank' rel='noreferrer'>
              EasyPlan.pro
            </a>{' '}
            application please follow next steps:
          </Typography>
          <Typography variant='h5' className={styles.dataLabel}>
            Find user name
          </Typography>
          <Typography className={styles.dataLabel}>
            1. Login to your account on{' '}
            <a href='https://moizvonki.ru' target='_blank' rel='noreferrer'>
              Moizvonki.ru
            </a>{' '}
            and open dashboard home page.
          </Typography>
          <Typography className={styles.dataLabel}>
            2. Click on your name from left-side menu
          </Typography>
          <Image src={homeProfile} />
          <Typography className={styles.dataLabel}>
            2. Under your name click on My profile (Мой профиль)
          </Typography>
          <Image src={homeSettings} />
          <Typography className={styles.dataLabel}>
            3. Copy email address from Адрес электронной почты field
          </Typography>
          <Image src={profile} />
          <Typography variant='h5' className={styles.dataLabel}>
            Find API url and API key
          </Typography>
          <Typography className={styles.dataLabel}>
            1. Login into your account on{' '}
            <a href='https://moizvonki.ru' target='_blank' rel='noreferrer'>
              Moizvonki.ru
            </a>{' '}
            and open dashboard home page.
          </Typography>
          <Typography className={styles.dataLabel}>
            2. Open Settings from left-side menu (Настройки)
          </Typography>
          <Image src={homePage} />
          <Typography className={styles.dataLabel}>
            3. On settings menu, select Integration tab (Интеграция)
          </Typography>
          <Image src={settingsPage} />
          <Typography className={styles.dataLabel}>
            4. Copy values from API Address field (Ваш адрес API) and API Key
            field (Ваш ключ API) and paste them to EasyPlan connection dialog.
          </Typography>
          <Image src={integrationsPage} />
        </div>
      </div>
    </SupportArticles>
  );
};

export default MoizvonkiTutorial;
