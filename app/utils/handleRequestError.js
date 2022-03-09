import { loginUrl } from 'eas.config';

const handleRequestError = (error) => {
  const statusCode = error?.response?.status ?? 400;
  if (statusCode === 401) {
    return {
      redirect: {
        destination: loginUrl,
        permanent: false,
      },
    };
  }

  return {
    notFound: true,
  };
};

export default handleRequestError;
