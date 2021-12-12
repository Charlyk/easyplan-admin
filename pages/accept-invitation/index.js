import React from 'react';
import { connect } from 'react-redux';
import AcceptClinicInvitation from 'app/components/common/AcceptClinicInvitation';
import checkIsMobileDevice from 'app/utils/checkIsMobileDevice';
import { JwtRegex } from 'app/utils/constants';

const AcceptInvitation = ({ token, isNew, isMobile }) => {
  return (
    <AcceptClinicInvitation token={token} isNew={isNew} isMobile={isMobile} />
  );
};

export default connect((state) => state)(AcceptInvitation);

export const getServerSideProps = ({ query, req }) => {
  const isMobile = checkIsMobileDevice(req);
  const { token, isNew } = query;
  if (!token.match(JwtRegex)) {
    return {
      redirect: {
        destination: '/login',
        permanent: true,
      },
    };
  }
  return {
    props: { token, isNew, isMobile },
  };
};
