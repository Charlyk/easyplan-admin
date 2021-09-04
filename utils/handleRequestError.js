import { textForKey } from "./localization";
import Router from "next/router";
import { toast } from "react-toastify";

const handleRequestError = async (error, req, res) => {
  const status = error?.response?.status;
  const statusText = error?.response?.statusText || textForKey('something_went_wrong');
  if (status === 401) {
    if (req && req.url !== '/login') {
      res.writeHead(302, { Location: `/login` });
      res.end();
    } else if (!req && Router?.asPath !== '/login') {
      await Router?.replace('/login');
    }
  } else {
    toast.error(statusText)
  }
}

export default handleRequestError
