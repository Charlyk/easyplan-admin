import React from 'react';
import ErrorPage from 'app/components/error/ErrorPage';
import { textForKey } from 'app/utils/localization';

const Error404 = () => {
  return (
    <ErrorPage
      query={{
        status: 404,
        message: textForKey('page_not_found'),
      }}
    />
  );
};

export default Error404;
