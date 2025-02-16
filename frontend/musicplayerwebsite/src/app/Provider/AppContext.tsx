"use client"

import React, {createContext, FC, useContext, useEffect, useState} from "react";
import {fetchProtected} from "@/app/Utils/FetchProtected";
import {toast} from "@/components/hooks/use-toast";
import axios from "axios";
import {login, result} from "@/app/Utils/Login";
import {redirect} from "next/navigation";
import {Toaster} from "@/components/ui/toaster";

type UserInfo = {
    userId: number;
    userName: string;
    name: string;
    email: string;
    avatar: string;
    role: boolean;
}

type UserContextProps = {
    user: UserInfo | null;
    setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
    loginUser: (email: string, password: string) => void;
    logOut: () => void;
    isAdmin: boolean;
    messageToast: string | null;
    setMessageToast: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppContext = createContext<UserContextProps | undefined>(undefined);

const AppProvider: FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [messageToast, setMessageToast] = useState<string | null>(null);
    const loginUser = async (email: string, password: string) => {

        await login(email, password);
        const {accessToken, refreshToken, message} = result;
        if(accessToken && refreshToken){
            localStorage.setItem("accessToken", accessToken);
            await axios.post(`/api/set-cookie`, {
                refreshToken
            })
            const response = await fetchProtected();
            if (response?.status !== 200) {
                setUser(null);
            } else {
                const user = await response?.data.userInfo;
                setUser(user);
                if (user && user.role) {
                    redirect("/dashboard/plays");
                } else {
                    redirect("/");
                }
            }
        }else {
            toast({
                description: message
            })
        }


    }


    const logOut = async () => {
        setUser(null);
        localStorage.removeItem("accessToken");
        setIsAdmin(false);
        const response = await axios.get(`/api/remove-cookie`);
        if (response.status !== 200) throw new Error("Could not remove cookie");
        redirect('/');
    }

    useEffect(() => {
        async function getUserInfo() {
                if(localStorage.getItem("accessToken")) {
                    const response = await fetchProtected();
                    setUser(await response?.data?.userInfo);
                }else setUser(null);
        }

        getUserInfo().catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        if (user) {
            setIsAdmin((prev) => {
                if (prev !== user?.role)
                    return !prev;
                return prev;
            });
        }
    }, [user]);


    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                isAdmin,
                loginUser,
                logOut,
                messageToast,
                setMessageToast
            }}
        >
            {children}
            <Toaster/>
        </AppContext.Provider>
    )
}

export const useApp = (): UserContextProps => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}

export default AppProvider;