import { useAuth, useUser, useSession } from '@clerk/clerk-react'
import { createContext, use, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const { getToken } = useAuth()
    const { user } = useUser()

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

    }


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}