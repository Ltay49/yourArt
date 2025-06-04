import React, { createContext, useState, ReactNode } from 'react';

type User = {
  _id: string;
  firstname: string;
  surname: string;
  username: string;
  email: string;
  collection: Array<{
    collection: string;
    artTitle: string;
    artist: string;
    imageUrl: string;
  }
  >;
} | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
