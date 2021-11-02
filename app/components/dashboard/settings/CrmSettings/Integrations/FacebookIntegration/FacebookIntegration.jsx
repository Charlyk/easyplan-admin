import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { appBaseUrl } from "../../../../../../../eas.config";
import { saveClinicFacebookPage } from "../../../../../../../middleware/api/clinic";
import { saveFacebookToken } from "../../../../../../../middleware/api/users";
import { textForKey } from "../../../../../../utils/localization";
import popupCenter from "../../../../../../utils/popupCenter";
import PagesListModal from "./PagesListModal";
import styles from './FacebookIntegration.module.scss';

const FacebookIntegration = ({ currentClinic, authToken }) => {
  const [facebookPage, setFacebookPage] = useState(currentClinic.facebookPage);
  const [pagesModal, setPagesModal] = useState({ open: false, pages: [] });
  const title = useMemo(() => {
    if (facebookPage == null) {
      return textForKey('Connect facebook page for CRM')
    }
    return textForKey('connected_facebook_page').replace('#', facebookPage.name);
  }, [facebookPage]);
  const buttonText = useMemo(() => {
    if (facebookPage == null) {
      return textForKey('Connect Facebook')
    }
    return textForKey('Connect another page');
  }, [facebookPage])

  useEffect(() => {
    setFacebookPage(currentClinic.facebookPage);
  }, [currentClinic]);

  const handleShowPagesList = (pages) => {
    setPagesModal({ open: true, pages });
  };

  const handleClosePagesList = () => {
    setPagesModal({ open: false, pages: [] });
  }

  /**
   * Handle page selected from modal
   * @param {{
   *   access_token: string,
   *   category: string,
   *   id: string,
   *   name: string,
   *   tasks: Array<string>,
   * }} page
   */
  const handlePageSelected = async (page) => {
    try {
      await saveClinicFacebookPage({
        accessToken: page.access_token,
        category: page.category,
        name: page.name,
        pageId: page.id,
      });
      setFacebookPage(page);
    } catch (error) {
      toast.error(error.message);
    }
    handleClosePagesList();
  };

  const handleOpenNewWindow = () => {
    popupCenter({
      url: `${appBaseUrl}/integrations/facebook?token=${authToken}&clinic=${currentClinic.id}`,
      title: 'Integrations',
      w: 200,
      h: 200,
    });
  }

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
        toast.warn(textForKey('No authorized Facebook pages, please try again.'));
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
      <Typography className={styles.rowTitle}>
        Facebook
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Box display="flex" flexDirection="column">
          <Typography className={styles.titleLabel}>
            {title}
          </Typography>
        </Box>
        <iframe
          id="facebookLogin"
          className={styles.connectContainer}
          src={`${appBaseUrl}/integrations/facebook?token=${authToken}&clinic=${currentClinic.id}`}
        />
      </Box>
    </div>
  )
};

export default FacebookIntegration;
