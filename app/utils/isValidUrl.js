const isValidUrl = (value) => {
  const pattern =
    /(?:^|\s)((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/;
  return pattern.test(value);
};

export default isValidUrl;
