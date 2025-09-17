import { useAuth, useUser, useSession } from '@clerk/clerk-react'
import { createContext, use, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const { getToken } = useAuth()
    const { user } = useUser()

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const logToken = async () => {

        console.log(await getToken());
    }

    useEffect(() => {
        if (user) {
            console.log(getToken())
            logToken();

        }
    }, [user])

    const value = {
        getToken, backendUrl
    }


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}