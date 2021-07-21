import React from 'react';
import { parseCookies } from "../utils";
import CreateClinicWrapper from "../app/components/common/CreateClinicWrapper";
import { wrapper } from "../store";

const CreateClinic = ({ token, redirect }) => {
  return <CreateClinicWrapper redirect={redirect} token={token} />;
};

export const getServerSideProps = async ({ req, query }) => {
  const { auth_token } = parseCookies(req);
  const { redirect } = query;
  return {
    props: {
      token: auth_token,
      redirect: redirect === '1',
    },
  }
};

export default wrapper.withRedux(CreateClinic);
