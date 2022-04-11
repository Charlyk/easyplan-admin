import { AxiosError } from 'axios';
import { ServerResponse } from './serverResponse.types';

export type ErrorResponse = AxiosError<ServerResponse<any>>;
