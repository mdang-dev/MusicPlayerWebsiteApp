'use client'

import React, {createContext, FC, useContext, useEffect, useState} from "react";


type VerifyContextProps = {
    code: string | null;
    setCode: React.Dispatch<React.SetStateAction<string | null>>;
    message: string | null;
    setMessage: React.Dispatch<React.SetStateAction<string | null>>;
    expirationTime: number | null;
    setExpirationTime: React.Dispatch<React.SetStateAction<number | null>>;
    emailForgotPassword: string | null;
    setEmailForgotPassword: React.Dispatch<React.SetStateAction<string | null>>;
    isValid: boolean;
    setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const VerifyContext = createContext<VerifyContextProps | undefined>(undefined);

const VerifyProvider: FC<{children: React.ReactNode}> = ({children}) => {

    const [code, setCode] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const [expirationTime, setExpirationTime] = React.useState<number | null>(null);
    const [emailForgotPassword, setEmailForgotPassword] = useState<string | null>(null);
    const [isValid, setIsValid] = React.useState<boolean>(false);
    useEffect(() => {
        if(code){
            setCode(code);
            let time:number = 10 * 60;
            const expired = setInterval(() => {
                --time;
                if(time === 0){
                    clearInterval(expired);
                    setCode(null);
                    time = 10 * 60;
                }
            }, 1000);
        }
    }, [code]);

    useEffect(() => {
        if(emailForgotPassword){
            setEmailForgotPassword(emailForgotPassword);
        }
    }, [emailForgotPassword]);

    useEffect(() => {
        if(isValid){
            setIsValid(isValid);
        }
    }, [isValid]);

    return (
        <VerifyContext.Provider
        value={{
            code,
            setCode,
            message,
            setMessage,
            expirationTime,
            setExpirationTime,
            emailForgotPassword,
            setEmailForgotPassword,
            isValid,
            setIsValid
        }}>
            {children}
        </VerifyContext.Provider>
    )
}

export const useVerify = () : VerifyContextProps => {
    const context = useContext(VerifyContext);
    if (!context) throw new Error("useVerify must be used within an VerifyProvider");
    return context;
}

export default VerifyProvider;