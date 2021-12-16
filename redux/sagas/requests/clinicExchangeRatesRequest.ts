import { AxiosResponse } from 'axios';
import { fetchClinicExchangeRates } from 'middleware/api/clinic';
import { ExchangeRate } from 'types';

export async function requestFetchClinicExchangeRates(): Promise<
  AxiosResponse<ExchangeRate[]>
> {
  return fetchClinicExchangeRates();
}
