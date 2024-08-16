export interface User {
  id?: number;
  userId: number;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  username?: string;
  password?: string;
  role?: string;
  addressId?: number;
  timezone?: string;
}
