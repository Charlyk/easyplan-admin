enum ScheduleStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  WaitingForPatient = 'WaitingForPatient',
  Late = 'Late',
  DidNotCome = 'DidNotCome',
  Canceled = 'Canceled',
  OnSite = 'OnSite',
  CompletedNotPaid = 'CompletedNotPaid',
  PartialPaid = 'PartialPaid',
  CompletedPaid = 'CompletedPaid',
  Rescheduled = 'Rescheduled',
  CompletedFree = 'CompletedFree',
}

export default ScheduleStatus;
