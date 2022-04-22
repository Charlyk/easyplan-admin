export type UpdateUserRequest = {
  username?: string | null;
  oldPassword?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  language?: string | null;
};
