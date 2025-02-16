import FormSendCode from "@/components/Form/FormSendCode";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {SquareArrowLeft} from "lucide-react";

const Page = () => {



    return (
        <>
                <Card className={`w-96`}>
                    <CardHeader>
                        <div className={`flex items-center`}>
                            <CardTitle>Quên Mật Khẩu</CardTitle>
                            <Link href={"/login-register"} className={`ml-auto inline-block`}><SquareArrowLeft/></Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <FormSendCode/>
                    </CardContent>
                </Card>
        </>
    )

}

export default Page;