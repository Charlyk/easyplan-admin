import { textForKey } from "./localization";

const getServiceName = (service) => {
  let name = service.name;
  if (service.toothId != null) {
    name = `${name} ${service.toothId}`;
  }
  if (service.destination != null) {
    name = `${name} (${textForKey(service.destination)})`;
  }
  return name;
};

export default getServiceName;
