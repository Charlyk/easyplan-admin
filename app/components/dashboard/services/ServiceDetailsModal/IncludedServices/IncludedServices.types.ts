import { IncludedService } from 'types';

export type IncludedServicesProps = {
  showStep?: boolean;
  initial?: IncludedService[];
  onChange?: (services: IncludedService[]) => void;
};
