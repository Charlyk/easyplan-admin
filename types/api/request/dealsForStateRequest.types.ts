export interface DealsForStateRequest {
  stateId: number;
  page: number;
  itemsPerPage: number;
  filter?: string | null;
}
