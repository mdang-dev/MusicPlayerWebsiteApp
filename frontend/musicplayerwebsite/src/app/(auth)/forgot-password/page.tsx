"use client"

import * as React from "react"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {SquareArrowLeft} from "lucide-react";
import Link from "next/link";
import {decrypt} from "@/app/Utils/Decode";
import {useVerify} from "@/app/Provider/VerifyContext";
import {useRouter} from "next/navigation";
import {useEffect, useMemo} from "react";

export default function InputOTPControlled() {
    const [value, setValue] = React.useState("")
    const { code, setIsValid } = useVerify();
     const router = useRouter();
    const isValid = useMemo(() => {
        return code && value === decrypt(code);
    }, [code, value]);

    useEffect(() => {
        if (isValid) {
            setIsValid(isValid);
            router.push("/new-password");
        }
    }, [isValid, router]);


    return (
        <>
                <Card>
                    <CardHeader>
                        <div className={`flex items-center`}>
                            <CardTitle>Xác Thực</CardTitle>
                            <Link href={"/verify-email"} className={`ml-auto inline-block`}><SquareArrowLeft/></Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <InputOTP
                                maxLength={6}
                                value={value}
                                onChange={(value) => setValue(value)}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0}/>
                                    <InputOTPSlot index={1}/>
                                    <InputOTPSlot index={2}/>
                                    <InputOTPSlot index={3}/>
                                    <InputOTPSlot index={4}/>
                                    <InputOTPSlot index={5}/>
                                </InputOTPGroup>
                            </InputOTP>
                            <div className="text-center text-sm">
                                { !isValid && value.length > 0  && (
                                    <div className={`text-red-800 text-[12px]`}>Mã Không Khớp Vui Lòng Kiểm Tra Lại !</div>
                                )
                                }
                            </div>
                        </div>
                    </CardContent>
                </Card>

        </>
    )
}
