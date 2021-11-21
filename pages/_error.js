import React from 'react';
import ErrorPage from 'app/components/error/ErrorPage';
import { textForKey } from 'app/utils/localization';

const Error = ({ statusCode }) => {
  return (
    <ErrorPage
      query={{
        status: statusCode ?? 400,
        message: textForKey('something_went_wrong'),
      }}
    />
  );
};

export default Error;

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
