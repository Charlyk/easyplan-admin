import { AxiosResponse } from 'axios';
import { updateVisitNote } from 'middleware/api/patients';
import { PatientVisit } from 'types';
import { UpdateVisitRequest } from 'types/api';

export async function requestUpdateVisitNotes(
  request: UpdateVisitRequest,
): Promise<AxiosResponse<PatientVisit>> {
  return updateVisitNote(request.patientId, request.visitId, request.note);
}
