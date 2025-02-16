"use client"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {SquareArrowLeft} from "lucide-react";
import FormForgotPassword from "@/components/Form/FormForgotPassword";
import {useVerify} from "@/app/Provider/VerifyContext";
import {redirect} from "next/navigation";

const Page = () => {

    const { isValid } = useVerify();
    if (!isValid) redirect("/login-register");

    return (
        <Card className={`w-80`}>
            <CardHeader>
                <div className={`flex items-center`}>
                    <CardTitle>Thay Đổi Mật Khẩu</CardTitle>
                    <Link href={"/"} className={`ml-auto inline-block`}><SquareArrowLeft/></Link>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <FormForgotPassword/>
            </CardContent>
        </Card>
    )

}

export default Page;