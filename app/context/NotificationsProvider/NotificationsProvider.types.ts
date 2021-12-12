export type NotificationsProviderValue = {
  success: (message: any) => void;
  error: (message: any) => void;
  warn: (message: any) => void;
  show: (message: any) => void;
};

export type NotificationsProviderState = {
  isVisible: boolean;
  message?: string | null;
  severity: 'error' | 'warning' | 'info' | 'success';
};

export type Notification = {
  show: boolean;
  message?: any;
  severity: 'error' | 'warning' | 'info' | 'success';
};
