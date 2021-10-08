const handleRequestError = (error) => {
  const message = error?.response?.data?.message || error?.response?.statusText || error?.message;
  const statusCode = error?.response?.status ?? 400;
  if (statusCode === 401) {
    return {
      redirect: {
        destination: '/login',
        permanent: true,
      },
    }
  }
  return {
    redirect: {
      destination: `/error?message=${message}&status=${statusCode}`,
    },
  }
}

export default handleRequestError
