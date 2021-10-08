import setCookies from "../../../app/utils/setCookies";

export default async (req, res) => {
  if (req.method !== 'GET') {
    return
  }
  const { clinicId, token } = req.query;
  setCookies(res, token, clinicId);
  res.json({ message: 'ok' });
};
