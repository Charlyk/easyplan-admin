import axios from "axios";
import { baseApiUrl } from "../../../eas.config";

export default async function resetPassword(req, res) {
  const response = await resetUserPassword(req.body.username);
  if (response.status !== 200) {
    res.json({ error: true, message: response.statusText });
  } else {
    const { isError, message, data } = response.data;
    if (isError) {
      res.json({ message, error: true });
    } else {
      res.status(200).json(data);
    }
  }
}

function resetUserPassword(username) {
  return axios.post(
    `${baseApiUrl}/authentication/v1/reset-password`,
    { username },
    { headers: { 'X-EasyPlan-Clinic-Id': -1 } }
  );
}
