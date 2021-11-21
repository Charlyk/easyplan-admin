import React from 'react';

const MainPage = () => {
  return <div />;
};

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: '/login',
      permanent: true,
    },
  };
};

export default MainPage;
