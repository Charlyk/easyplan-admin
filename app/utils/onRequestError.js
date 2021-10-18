import { toast } from "react-toastify";

const onRequestError = (error) => {
  if (error.response != null) {
    const { data } = error.response;
    toast?.error(data.message || error.message);
  } else {
    toast?.error(error.message);
  }
};

export default onRequestError;
