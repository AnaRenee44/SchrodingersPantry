import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';

interface userTypes {
  id: string;
  name: string;
  preference: string;
  createdAt: string;
  updatedAt: string;
}

interface UserContextType {
  user?: userTypes;
  setUser: React.Dispatch<React.SetStateAction<userTypes>>;
  getUser: () => void;
}

interface Props {
  children: React.ReactNode;
}

const UserContext = createContext({} as UserContextType);

const UserContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<userTypes | null>(null);

  const getUser = () => {
    if (!user) {
      axios
        .get('/auth/user')
        .then(({ data }) => {
          console.log(data[0], 'context 31');
          setUser(data[0]);
        })
        .catch((err) => console.error('error context 34', err));
    }
  };

  const UserProps: UserContextType = {
    user,
    getUser,
    setUser,
  };

  return (
    <UserContext.Provider value={UserProps}>{children}</UserContext.Provider>
  );
};
export { UserContextProvider, UserContext };
