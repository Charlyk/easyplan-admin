const handleRequestError = (error) => {
  const statusCode = error?.response?.status ?? 400;
  if (statusCode === 401) {
    return {
      redirect: {
        destination: '/login',
        permanent: true,
      },
    };
  }

  return {
    notFound: true,
  };
};

export default handleRequestError;
