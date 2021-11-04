import React, { useCallback } from 'react';
import FacebookLogin from "react-facebook-login";
import { textForKey } from "../../app/utils/localization";
import { FacebookAppId } from "../../app/utils/constants";

const Facebook = ({ redirect }) => {
  const handleFacebookResponse = useCallback((response) => {
    parent.postMessage(response, redirect)
  }, []);

  return (
    <div style={{ width: 'fit-content', height: '30px' }}>
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

export const getServerSideProps = ({ query }) => {
  const { redirect } = query;
  return {
    props: { redirect }
  }
}

export default React.memo(Facebook);