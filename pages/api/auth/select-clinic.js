import setCookies from "../../../app/utils/setCookies";

export const config = { api: { bodyParser: false } };

export default async (req, res) => {
  if (req.method !== 'GET') {
    return
  }
  const { clinicId, token } = req.query;
  setCookies(res, token, clinicId);
  res.json({ message: 'ok' });
};
