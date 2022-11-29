import React from 'react';
import { userService } from 'src/services/user.service';
import { UserRole } from 'src/types/userSession';

type User = {
  id: string;
  name: string;
  role: UserRole;
  token: string;
  username: string;
  updated_at: string;
};

export const useUser = () => {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const subscription = userService.user.subscribe((x: any) => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  return user;
};
