import React, { useContext, useEffect, useMemo, useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import LoadingButton from 'app/components/common/LoadingButton';
import IconFacebookSm from 'app/components/icons/iconMetaLogo';
import NotificationsContext from 'app/context/notificationsContext';
import { textForKey } from 'app/utils/localization';
import onRequestFailed from 'app/utils/onRequestFailed';
import { appBaseUrl, environment } from 'eas.config';
import { saveClinicFacebookPage } from 'middleware/api/clinic';
import { generateFacebookAccessToken } from 'middleware/api/facebook';
import { saveFacebookToken } from 'middleware/api/users';
import { currentClinicSelector } from 'redux/selectors/appDataSelector';
import styles from './FacebookIntegration.module.scss';
import PagesListModal from './PagesListModal';

const FacebookIntegration = ({ facebookToken, facebookCode }) => {
  const router = useRouter();
  const toast = useContext(NotificationsContext);
  const currentClinic = useSelector(currentClinicSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [facebookPages, setFacebookPages] = useState(
    currentClinic.facebookPages,
  );
  const [pagesModal, setPagesModal] = useState({ open: false, pages: [] });

  const title = useMemo(() => {
    if (facebookPages == null || !Array.isArray(facebookPages)) {
      return textForKey('Connect facebook page for CRM');
    }
    return textForKey(
      'connected_facebook_page',
      facebookPages.map((it) => it.name).join(', '),
    );
  }, [facebookPages]);

  useEffect(() => {
    window.addEventListener('message', handleFrameMessage);
    return () => {
      window.removeEventListener('message', handleFrameMessage);
    };
  }, []);

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
      const baseUrl = window.location.hostname;
      const protocol = window.location.protocol;
      const port = environment === 'local' ? `:${window.location.port}` : '';
      const redirectUrl = `${protocol}//${baseUrl}${port}/integrations/facebook?connect=0&subdomain=${currentClinic.domainName}`;
      const response = await generateFacebookAccessToken(
        facebookCode,
        facebookToken,
        redirectUrl,
      );
      const pages = response.data.pages;
      handleShowPagesList(pages);
    } catch (error) {
      onRequestFailed(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFrameMessage = async (event) => {
    if (event.data.source != null) {
      return;
    }
    await handleFacebookResponse(event.data);
  };

  const handleShowPagesList = (pages) => {
    setPagesModal({ open: true, pages });
  };

  const handleClosePagesList = () => {
    setPagesModal({ open: false, pages: [] });
    router.replace('/settings?menu=crmSettings');
  };

  const handlePageSelected = async (pages) => {
    try {
      const requestBody = pages.map((page) => ({
        accessToken: page.access_token,
        category: page.category,
        name: page.name,
        pageId: page.id,
      }));
      await saveClinicFacebookPage(requestBody);
      setFacebookPages(pages);
      router.replace('/settings?menu=crmSettings');
    } catch (error) {
      toast.error(error.message);
    }
    handleClosePagesList();
  };

  /**
   * Handle facebook response
   * @param {{ accessToken?: string, userID?: string, status?: string, accounts?: { data: Array<*> } }} response
   * @return {Promise<void>}
   */
  const handleFacebookResponse = async (response) => {
    if (!response.accessToken) {
      return;
    }
    try {
      await saveFacebookToken(response.accessToken);
      if (response.accounts == null || response.accounts.data.length === 0) {
        toast.warn(
          textForKey('No authorized Facebook pages, please try again.'),
        );
      } else {
        const pages = response.accounts.data;
        if (pages.length > 1) {
          handleShowPagesList(pages);
        } else {
          await handlePageSelected(pages);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleConnectClick = () => {
    router.replace(`${appBaseUrl}/integrations/facebook?connect=1`);
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
            <Typography className={styles.rowTitle}>Meta (Facebook)</Typography>
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
          {textForKey('Connect')}
        </LoadingButton>
      </Box>
    </div>
  );
};

export default FacebookIntegration;
