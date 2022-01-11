export interface AppNotification {
  id: number;
  title: string;
  message: string;
  imageUrl?: string | null;
  created: string;
  color?: string | null;
}
