import { PopperProps } from '@mui/material';

export type NewPatientPopperProps = PopperProps & {
  onClose: () => void;
};
