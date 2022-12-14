import { ChangeEvent } from 'react';
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
  onChange?: (
    data: FileList | string,
    event?: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  disableAutofill?: boolean;
  maxLength?: number;
  disableAutoFill?: boolean;
  id?: string;
  placeholder?: string;
}
