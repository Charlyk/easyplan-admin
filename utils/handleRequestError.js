const handleRequestError = (error, res) => {
  const statusCode = error?.response?.status ?? 400;
  if (statusCode === 401) {
    return {
      redirect: {
        destination: '/login',
        permanent: true,
      },
    }
  }

  const message = error?.response?.data
    ? error.response.data.message
    : error?.response
      ? error.response.statusText
      : error.message;

  return {
    notFound: true,
  };
}

export default handleRequestError
