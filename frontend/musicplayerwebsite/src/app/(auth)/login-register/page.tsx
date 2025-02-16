
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {SquareArrowLeft} from "lucide-react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import FormLogin from '@/components/Form/FormLogin'
import FormRegister from '@/components/Form/FormRegister'
import Link from "next/link";

export default function TabsDemo() {


    return (
        <Tabs defaultValue="account" className="w-[400px] h-max">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">ĐĂNG NHẬP</TabsTrigger>
                <TabsTrigger value="password">TÀI KHOẢN MỚI</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <Card>
                    <CardHeader>
                        <div className={`flex items-center`}>
                            <CardTitle>Account</CardTitle>
                            <Link href={"/"} className={`ml-auto inline-block`}><SquareArrowLeft/></Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <FormLogin/>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="password">
                <Card>
                    <CardHeader>
                        <div className={`flex items-center`}>
                            <CardTitle>Register</CardTitle>
                            <Link href={"/"} className={`ml-auto inline-block`}><SquareArrowLeft/></Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <FormRegister/>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
