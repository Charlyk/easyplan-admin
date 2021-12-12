const getErrorMessage = (error) => {
  const { data } = error.response;
  if (data != null) {
    return data.message;
  } else {
    return error.message;
  }
};

export default getErrorMessage;
