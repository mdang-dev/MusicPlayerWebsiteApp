import axios, {AxiosResponse} from "axios";
import {toast} from "@/components/hooks/use-toast";

type Res = {
    accessToken: string | null;
    refreshToken: string | null;
    message?: string;
}


let result: Res;

async function login(email: string, password: string): Promise<AxiosResponse | void> {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/auth`, {
            email,
            password,
        });
        const data = await response.data;
        if(data.accessToken && data.refreshToken) {
            result = {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            }
        }else {
            result = {
                accessToken: null,
                refreshToken: null,
                message: data.message
            }
        }

    }catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response) {
                toast({
                    description: err.response.data.message
                })
            }
        }
        console.error("Unexpected error:", err);

    }
}

export {login, result };


