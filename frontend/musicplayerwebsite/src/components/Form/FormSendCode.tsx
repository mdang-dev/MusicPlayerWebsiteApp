"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/components/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {useRouter} from "next/navigation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios";
import {useVerify} from "@/app/Provider/VerifyContext";

const FormSchema = z.object({
    email: z.string().min(1, {
        message: "Vui lòng nhập email !",
    }),
})

export default function FormSendCode() {

    const router = useRouter();
    const { setCode, setEmailForgotPassword } = useVerify();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        axios.post(`${process.env.NEXT_PUBLIC_API}/api/get-code`, {
            email: data.email,
        }).then(function (response) {
            if (response.status !== 200) throw new Error('Error get code from server !');
            toast({
                description: 'Mã xác nhận đã được gửi vui lòng kiểm tra email !',
            })
            setCode(response.data.code);
            setEmailForgotPassword(data.email);
            router.push("/forgot-password");
        })

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className={`grid gap-3 mb-5`}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email.." {...field} className={`w-full`} type={`email`} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className={`w-full`}>GỬI</Button>
            </form>
        </Form>
    )
}
