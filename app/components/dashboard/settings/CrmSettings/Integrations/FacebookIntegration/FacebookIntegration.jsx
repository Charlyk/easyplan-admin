import React, { useEffect, useMemo, useState } from "react";
import FacebookLogin from 'react-facebook-login';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { toast } from "react-toastify";

import { saveClinicFacebookPage } from "../../../../../../../middleware/api/clinic";
import { saveFacebookToken } from "../../../../../../../middleware/api/users";
import { textForKey } from "../../../../../../utils/localization";
import { FacebookAppId } from "../../../../../../utils/constants";
import PagesListModal from "./PagesListModal";
import styles from './FacebookIntegration.module.scss';

const FacebookIntegration = ({ currentClinic }) => {
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
        <FacebookLogin
          autoLoad={false}
          appId={FacebookAppId}
          fields="name,email,picture,accounts"
          scope="public_profile,pages_show_list,pages_messaging"
          size="small"
          textButton={buttonText}
          callback={handleFacebookResponse}
        />
      </Box>
    </div>
  )
};

export default FacebookIntegration;
