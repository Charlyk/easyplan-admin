const onRequestError = (error: any) => {
  if (error.response != null) {
    const { data } = error.response;
    console.error(data.message || error.message);
  } else {
    console.error(error.message);
  }
};

export default onRequestError;
