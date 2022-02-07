export interface UpdateDealStateRequest {
  name?: string | null;
  moveDirection?: ColumnMoveDirection | null;
  color?: string | null;
}

export enum ColumnMoveDirection {
  Left = 'Left',
  Right = 'Right',
}
