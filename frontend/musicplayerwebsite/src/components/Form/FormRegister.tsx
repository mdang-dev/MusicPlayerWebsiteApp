"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "@/components/hooks/use-toast"
import { Button } from "@/components/ui/button"
import dotenv from 'dotenv';
dotenv.config();

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
    userName: z.string().min(1, {
        message: "Vui lòng nhập email !",
    }),
    name: z.string().min(1, {
        message: "Vui lòng nhập họ tên !"
    }),
    email: z.string().min(1, {
        message: "Vui lòng nhập email !"
    }),
    password: z.string().min(1, {
        message: "Vui lòng nhập mật khẩu !"
    }),
    confirmPassword: z.string().min(1, {
       message: "Vui lòng xác nhận mật khẩu !"
    }),
    avatar: z.string(),
    role: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Mật khẩu xác nhận không khớp !"
})

export default function InputForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            userName: "",
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            avatar: "",
            role: false,
        },
    })

  async function onSubmit(data: z.infer<typeof FormSchema>) {

        const response  = await fetch(`http://localhost:8080/MusicPlayerServer/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                                    userName: data.userName,
                                    name: data.name,
                                    email: data.email,
                                    password: data.password,
                                    avatar: data.avatar,
                                    role: data.role
                                 }),
        });

        try {
            const result = await response.json();
            console.log(process.env.NEXT_PUBLIC_API);

            if(!response.ok){
                toast({
                    title: "Thông Báo !",
                    description: result.message || "Error",
                })
            }else{
                toast({
                    description: result.message,
                })
                if(result.message === "Đăng kí thành công vui lòng tiến hành đăng nhập !"){
                    form.reset();
                }
            }

        }catch (Error){
            console.log(Error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={`mx-3`}>

                <div className={`grid gap-3 mb-5`}>
                    <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="User name..." {...field} className={`w-full`} type={`text`} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Họ Tên</FormLabel>
                                <FormControl>
                                    <Input placeholder="Full name..." {...field} className={`w-full`} type={`text`} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email..." {...field} className={`w-full`} type={`email`} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mật Khẩu</FormLabel>
                                <FormControl>
                                    <Input placeholder="Password..." {...field} className={`w-full`} type={`password`} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Xác Nhận Mật Khẩu</FormLabel>
                                <FormControl>
                                    <Input placeholder="Confirm password..." {...field} className={`w-full`} type={`password`} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit">ĐĂNG KÝ</Button>
            </form>
        </Form>
    )
}
