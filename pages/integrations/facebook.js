import React, { useState } from 'react';
import handleRequestError from "../../app/utils/handleRequestError";
import { FacebookAppId, HeaderKeys } from "../../app/utils/constants";
import FacebookLogin from "react-facebook-login";
import { textForKey } from "../../app/utils/localization";
import { saveFacebookToken } from "../../middleware/api/users";
import { toast } from "react-toastify";
import { saveClinicFacebookPage } from "../../middleware/api/clinic";
import PagesListModal
  from "../../app/components/dashboard/settings/CrmSettings/Integrations/FacebookIntegration/PagesListModal";

const Facebook = ({ authToken, clinicId }) => {
  const [pagesModal, setPagesModal] = useState({ open: false, pages: [] });
  const headers = {
    [HeaderKeys.authorization]: authToken,
    [HeaderKeys.clinicId]: clinicId,
  };

  const handleShowPagesList = (pages) => {
    setPagesModal({ open: true, pages });
  };

  const handleClosePagesList = () => {
    setPagesModal({ open: false, pages: [] });
  };

  const handlePageSelected = async (page) => {
    try {
      await saveClinicFacebookPage({
        accessToken: page.access_token,
        category: page.category,
        name: page.name,
        pageId: page.id,
      }, headers);
    } catch (error) {
      toast.error(error.message);
    }
    handleClosePagesList();
  };

  const handleFacebookResponse = async (response) => {
    if (!response.accessToken) {
      return;
    }
    try {
      await saveFacebookToken(response.accessToken, headers);
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
    <div style={{ alignItems: 'center', justifyItems: 'center', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
      <PagesListModal
        {...pagesModal}
        onSelect={handlePageSelected}
        onClose={handleClosePagesList}
      />
      <FacebookLogin
        autoLoad={false}
        appId={FacebookAppId}
        fields="name,email,picture,accounts"
        scope="public_profile,pages_show_list,pages_messaging"
        size="small"
        textButton={textForKey('Connect Facebook')}
        callback={handleFacebookResponse}
      />
    </div>
  );
};

export const getServerSideProps = async ({ query }) => {
  try {
    const { token: authToken, clinic: clinicId } = query;
    return {
      props: { authToken, clinicId },
    };
  } catch (error) {
    return handleRequestError(error);
  }
}

export default Facebook;
