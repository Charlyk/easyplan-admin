/**
 *
 * @param {function(req?, res?): Promise<AxiosResponse<*>>} apiCall
 * @param req
 * @param res
 * @return {Promise<null|*>}
 */
const handler = async (apiCall, req, res) => {
  try {
    const response = await apiCall(req);
    if (response.headers['set-cookie'] != null) {
      res.setHeader('set-cookie', response.headers['set-cookie']);
    }
    const { data: responseData } = response;
    if (response.status !== 200) {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'POST']);
      res.status(response.status).json({
        error: true,
        message: responseData?.message ?? response.statusText,
      });
      return false;
    }
    const { isError, message, data } = responseData;
    if (isError) {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'POST']);
      res.status(400).json({ message, error: true });
      return false;
    }
    return data;
  } catch (error) {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'POST']);
    if (error?.response != null) {
      const { status, statusText, data } = error.response;
      const jsonResponse = {
        error: true,
        message: data?.message || statusText,
      };
      res.status(status).json(jsonResponse);
    } else {
      res.status(400).json({ error: true, message: error.message });
    }
    return false;
  }
};

export default handler;
