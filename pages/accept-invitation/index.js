import React from 'react';
import AcceptClinicInvitation from "../../app/components/common/AcceptClinicInvitation";

const AcceptInvitation = () => {
  return (
    <AcceptClinicInvitation />
  );
};

export const getServerSideProps = () => {
  return {
    props: {}
  }
}

export default AcceptInvitation;
