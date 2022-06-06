import React, { useEffect, useMemo, useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import orderBy from 'lodash/orderBy';
import { useRouter } from 'next/router';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import LoadingButton from 'app/components/common/LoadingButton';
import IconFacebookSm from 'app/components/icons/iconMetaLogo';
import { appBaseUrl } from 'eas.config';
import { saveClinicFacebookPage } from 'middleware/api/clinic';
import { generateFacebookAccessToken } from 'middleware/api/facebook';
import { currentClinicSelector } from 'redux/selectors/appDataSelector';
import { showErrorNotification } from 'redux/slices/globalNotificationsSlice';
import { FacebookPageType } from 'types';
import styles from './FacebookIntegration.module.scss';
import PagesListModal from './PagesListModal';

interface FacebookIntegrationProps {
  facebookToken?: string | null;
  facebookCode?: string | null;
}

const FacebookIntegration: React.FC<FacebookIntegrationProps> = ({
  facebookToken,
  facebookCode,
}) => {
  const textForKey = useTranslate();
  const router = useRouter();
  const dispatch = useDispatch();
  const currentClinic = useSelector(currentClinicSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [facebookPages, setFacebookPages] = useState(
    currentClinic.facebookPages,
  );
  const [pagesModal, setPagesModal] = useState({ open: false, pages: [] });

  const title = useMemo(() => {
    if (facebookPages == null || !Array.isArray(facebookPages)) {
      return textForKey('connect facebook page');
    }
    return textForKey(
      'connected_facebook_page',
      orderBy(facebookPages, 'name')
        .map((it) => it.name)
        .join(', '),
    );
  }, [facebookPages]);

  useEffect(() => {
    if (!facebookCode && !facebookToken) {
      return;
    }
    authenticateFacebookCode();
  }, [facebookCode, facebookToken]);

  useEffect(() => {
    setFacebookPages(currentClinic.facebookPages);
  }, [currentClinic]);

  const authenticateFacebookCode = async () => {
    setIsLoading(true);
    try {
      const redirectUrl = `${appBaseUrl}/integrations/facebook`;
      const response = await generateFacebookAccessToken(
        facebookCode,
        facebookToken,
        redirectUrl,
      );
      const pages = response.data.pages;
      handleShowPagesList(pages);
    } catch (error) {
      dispatch(showErrorNotification(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowPagesList = (pages: FacebookPageType[]) => {
    setPagesModal({ open: true, pages });
  };

  const handleClosePagesList = () => {
    setPagesModal({ open: false, pages: [] });
    router.replace('/settings?menu=crmSettings');
  };

  const handlePageSelected = async (pages: FacebookPageType[]) => {
    try {
      const requestBody = pages.map((page) => ({
        accessToken: page.access_token,
        category: page.category,
        name: page.name,
        pageId: page.id,
        instagramAccountId: page.connected_instagram_account?.id ?? null,
      }));
      await saveClinicFacebookPage(requestBody);
      setFacebookPages(pages);
      router.replace('/settings?menu=crmSettings');
    } catch (error) {
      dispatch(showErrorNotification(error.message));
    }
    handleClosePagesList();
  };

  const handleConnectClick = async () => {
    await router.replace(
      `${appBaseUrl}/integrations/facebook?connect=1&subdomain=${currentClinic.domainName}`,
    );
  };

  return (
    <div className={styles.facebookIntegration}>
      <PagesListModal
        {...pagesModal}
        onSelect={handlePageSelected}
        onClose={handleClosePagesList}
      />
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Box>
          <div className={styles.rowContainer}>
            <IconFacebookSm />
            <Typography className={styles.rowTitle}>
              Meta (Facebook, Instagram, Whatsapp)
            </Typography>
          </div>
          <Box display='flex' flexDirection='column'>
            <Typography className={styles.titleLabel}>{title}</Typography>
          </Box>
        </Box>
        <LoadingButton
          isLoading={isLoading}
          className='positive-button'
          onClick={handleConnectClick}
        >
          {textForKey('connect')}
        </LoadingButton>
      </Box>
    </div>
  );
};

export default FacebookIntegration;
