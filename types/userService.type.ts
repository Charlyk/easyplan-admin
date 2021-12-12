export interface UserService {
  id: number;
  serviceId: number;
  name: string;
  color: string;
  price: number;
  percentage: number;
  serviceType: 'All' | 'Single' | 'Braces' | 'System';
  duration: number;
  selected: boolean;
}
