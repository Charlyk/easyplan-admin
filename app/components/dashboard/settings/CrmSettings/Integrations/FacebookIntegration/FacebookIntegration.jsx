import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import NotificationsContext from 'app/context/notificationsContext';
import { textForKey } from 'app/utils/localization';
import { saveClinicFacebookPage } from 'middleware/api/clinic';
import { saveFacebookToken } from 'middleware/api/users';
import styles from './FacebookIntegration.module.scss';
import PagesListModal from './PagesListModal';

const FacebookIntegration = ({ currentClinic }) => {
  const toast = useContext(NotificationsContext);
  const [facebookPages, setFacebookPages] = useState(
    currentClinic.facebookPages,
  );
  const [pagesModal, setPagesModal] = useState({ open: false, pages: [] });
  const frameRef = useRef(null);

  const title = useMemo(() => {
    if (facebookPages == null || !Array.isArray(facebookPages)) {
      return textForKey('Connect facebook page for CRM');
    }
    return textForKey('connected_facebook_page').replace(
      '{1}',
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
    setFacebookPages(currentClinic.facebookPages);
  }, [currentClinic]);

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
  };

  const handlePageSelected = async (page) => {
    try {
      const requestBody = [
        {
          accessToken: page.access_token,
          category: page.category,
          name: page.name,
          pageId: page.id,
        },
      ];
      await saveClinicFacebookPage(requestBody);
      setFacebookPages([page]);
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
          await handlePageSelected(pages[0]);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.facebookIntegration}>
      <PagesListModal
        {...pagesModal}
        onSelect={handlePageSelected}
        onClose={handleClosePagesList}
      />
      <Typography className={styles.rowTitle}>Facebook</Typography>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        width='100%'
      >
        <Box display='flex' flexDirection='column'>
          <Typography className={styles.titleLabel}>{title}</Typography>
        </Box>
        <iframe
          title='Facebook Integration'
          ref={frameRef}
          id='facebookLogin'
          frameBorder='0'
          className={styles.connectContainer}
          src={`https://app.easyplan.pro/integrations/facebook?redirect=${window.location.href}`}
        />
      </Box>
    </div>
  );
};

export default FacebookIntegration;
