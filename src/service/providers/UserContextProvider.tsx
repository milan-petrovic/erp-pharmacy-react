import React, { createContext, ReactNode, useState } from 'react';
import { AuthUser } from '../../constants/types';

export interface UserContextType {
    authenticated?: boolean;
    user?: AuthUser;
    loginUser?: (user: AuthUser) => void;
    logoutUser?: () => void;
}

export const UserContext = createContext<UserContextType>({});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser>();
    const [authenticated, setAuthenticated] = useState<boolean>();

    const loginUser = (authUser: AuthUser) => {
        setAuthenticated(true);
        setUser(authUser);
    };

    const logoutUser = () => {
        setAuthenticated(false);
        setUser(undefined);
    };

    return (
        <UserContext.Provider
            value={{ authenticated: authenticated, user: user, loginUser: loginUser, logoutUser: logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};
