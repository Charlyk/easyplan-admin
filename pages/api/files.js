import axios from 'axios';
import updatedServerUrl from 'app/utils/updateServerUrl';

export const config = {
  api: {
    externalResolver: true,
  },
};

function fetchImages(req) {
  const { fileName } = req.query;
  return axios.get(`${updatedServerUrl(req)}/files/${fileName}`, {
    responseType: 'arraybuffer',
  });
}

export default async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const response = await fetchImages(req);
      if (response.status !== 200) {
        res.setHeader('Allow', ['GET']);
        res.status(response.status).send(response.statusText);
      } else if (response.data) {
        res.send(Buffer.from(response.data));
      }
      break;
    }
    default: {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
    }
  }
};
