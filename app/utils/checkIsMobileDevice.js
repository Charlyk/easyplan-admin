const checkIsMobileDevice = (req) => {
  const userAgent = req?.headers['user-agent'];
  return Boolean(
    userAgent?.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    ),
  );
};

export default checkIsMobileDevice;
