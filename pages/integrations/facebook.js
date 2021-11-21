import React, { useCallback } from 'react';
import FacebookLogin from 'react-facebook-login';
import { FacebookAppId } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';

const Facebook = ({ redirect }) => {
  const handleFacebookResponse = useCallback((response) => {
    parent.postMessage(response, redirect);
  }, []);

  return (
    <div style={{ width: 'fit-content', height: '30px' }}>
      <FacebookLogin
        autoLoad={false}
        appId={FacebookAppId}
        fields='name,email,picture,accounts'
        scope='public_profile,pages_show_list,pages_messaging,pages_manage_metadata,pages_read_engagement'
        size='small'
        textButton={textForKey('Connect Facebook')}
        callback={handleFacebookResponse}
      />
    </div>
  );
};

export const getServerSideProps = ({ query }) => {
  const { redirect } = query;
  return {
    props: { redirect },
  };
};

export default React.memo(Facebook);
