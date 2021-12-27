import { BaseTextFieldProps } from '@material-ui/core';

export interface EASTextFieldProps extends BaseTextFieldProps {
  fieldLabel?: string;
  readOnly?: boolean;
  containerClass?: string;
  fieldClass?: string;
  inputClass?: string;
  error?: boolean;
  max?: number;
  min?: number;
  step?: number;
  endAdornment?: any;
  helperText?: string;
  type?: string;
  autoFocus?: boolean;
  variant?: 'outlined' | 'standard' | 'filled';
  onChange?: (data: File | string) => void;
  maxLength?: number;
  disableAutoFill?: boolean;
}
