import React from 'react';
import AcceptClinicInvitation from "../../app/components/common/AcceptClinicInvitation";
import { JwtRegex } from "../../app/utils/constants";

const AcceptInvitation = ({ token, isNew }) => {
  return (
    <AcceptClinicInvitation token={token} isNew={isNew} />
  );
};

export const getServerSideProps = ({ query }) => {
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
    props: { token, isNew }
  }
}

export default AcceptInvitation;
