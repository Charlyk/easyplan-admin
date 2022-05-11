import React from 'react';
import { connect } from 'react-redux';

const Settings = () => {
  return (
    <div>
      <div />
    </div>
  );
};

export default connect((state) => state)(Settings);

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: '/settings/account-settings',
      permanent: true,
    },
  };
};
