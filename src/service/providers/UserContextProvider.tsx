import React, { Dispatch, SetStateAction } from 'react';
import { createContext, ReactNode, useState } from 'react';
import { AuthUser } from '../../constants/types';

export interface UserContextType {
    authenticated: false;
    user?: AuthUser;
    setUser?: Dispatch<SetStateAction<AuthUser | undefined>>;
    setAuthenticated?: Dispatch<SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextType>({ authenticated: false });

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser>();
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    return (
        <UserContext.Provider
            value={{ authenticated: false, setAuthenticated: setAuthenticated, user: user, setUser: setUser }}>
            {children}
        </UserContext.Provider>
    );
};
