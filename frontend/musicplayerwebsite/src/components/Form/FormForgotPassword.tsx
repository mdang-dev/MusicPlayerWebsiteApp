"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useVerify} from "@/app/Provider/VerifyContext";
import axios from "axios";
import {toast} from "@/components/hooks/use-toast";
import {redirect} from "next/navigation";

const FormSchema = z.object({
    newPassword: z.string().min(1, {
        message: "Vui lòng nhập email !",
    }),
    confirmPassword: z.string().min(1, {
        message: "Vui lòng nhập mật khẩu !"
    })
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Mật khẩu xác nhận không khớp !"
})

export default function FormForgotPassword() {

    const { emailForgotPassword, setEmailForgotPassword, setIsValid, setCode } = useVerify();
    console.log(emailForgotPassword);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {

        axios.post(`${process.env.NEXT_PUBLIC_API}/api/update-password`, {
            email: emailForgotPassword,
            password: data.newPassword
        }).then(function (response) {
            if(response.status !== 200) throw new Error('Error updating password');
            toast({
                description: 'Thay đổi mật khẩu thành công !'
            })
            setIsValid(false);
            setCode(null);
            setEmailForgotPassword(null);
        }).catch(function (error) {
            console.log(error.message);
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

                <div className={`grid gap-3 mb-5`}>
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Mật Khẩu Mới</FormLabel>
                                <FormControl>
                                    <Input placeholder="New password..." {...field} className={`w-full`} type={`password`}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Xác Nhận Mật Khẩu Mới</FormLabel>
                                <FormControl>
                                    <Input placeholder="Confirm password..." {...field} className={`w-full`} type={`password`}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit">XÁC NHẬN</Button>
            </form>
        </Form>
    )
}
