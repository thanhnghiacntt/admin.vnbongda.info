export interface User {

  userId?: string;

  id?: string;

  lastName?: string;

  email?: string;

  firstName?: string;

  fullName?: string;

  address?: string;

  profilePicture?: string;

  password?: string;

  role?: string;

  username?: string;

  confirmPassword?: string;

  oldPassword?: string;
}

export interface UserFilter {
  start: number,
  limit: number,
}
