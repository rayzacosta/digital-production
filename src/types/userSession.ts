export type UserRole = 'operator' | 'admin' | 'manager';

export type CurrentUser = {
  id: string;
  role: UserRole;
};
