import React from 'react';
import ErrorPage from "../app/components/error/ErrorPage";

const Error = ({ query }) => {
  return <ErrorPage query={query} />;
};

export const getServerSideProps = async ({ query }) => {
  return {
    props: { query }
  }
};

export default Error;
