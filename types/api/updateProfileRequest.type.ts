export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar?: string;
  username?: string;
  oldPassword?: string;
  confirmPassword?: string;
}
