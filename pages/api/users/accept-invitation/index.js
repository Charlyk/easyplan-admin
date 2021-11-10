import axios from "axios";
import { handler } from "../../handler";
import getSubdomain from "../../../../app/utils/getSubdomain";
import updatedServerUrl from "../../../../app/utils/updateServerUrl";
import setCookies from '../../../../app/utils/setCookies';
import { HeaderKeys } from "../../../../app/utils/constants";


export const config = { api: { bodyParser: { sizeLimit: '100mb' } } };

export default async (req, res) => {
  switch (req.method) {
    case 'PUT':
      const data = await handler(fetchUsers, req, res);
      if (data != null) {
        const { user, token } = data;
        let selectedClinic = null;
        if (user.clinics.length > 0) {
          selectedClinic = user.clinics.find(clinic => clinic.isSelected) || user.clinics[0]
        }
        setCookies(res, token, selectedClinic?.clinicId);
        res.status(200).json(user);
      }
      break;
    default: {
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
    }
  }
};

function fetchUsers(req) {
  return axios.put(`${updatedServerUrl(req)}/users/accept-invitation`, req.body, {
    headers: {
      [HeaderKeys.subdomain]: getSubdomain(req),
      [HeaderKeys.contentType]: 'application/json',
    }
  });
}
